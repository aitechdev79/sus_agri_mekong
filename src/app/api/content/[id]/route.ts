import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, requireModerator } from '@/lib/auth-middleware'
import { sanitizeRichText } from '@/lib/sanitize'

interface RouteParams {
  params: Promise<{ id: string }>
}

function normalizeEventDate(value?: string | null, isAllDay?: boolean) {
  if (!value) return null

  const normalized = isAllDay ? `${value}T00:00:00` : value
  const date = new Date(normalized)
  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date
}

function normalizeDisplayOrder(value?: unknown) {
  if (value === null || value === undefined || value === '') return null
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return null
  return Math.trunc(parsed)
}

function validateSectionPlacement(type: string, sectionKey?: string | null) {
  if (!sectionKey) return { ok: true }

  if (sectionKey === 'HOME_DIEN_HINH' && type !== 'STORY') {
    return { ok: false, error: 'Muc "Thuc hanh dien hinh" chi nhan noi dung loai STORY.' }
  }

  if (sectionKey === 'HOME_HOAT_DONG_DU_AN' && type !== 'PROJECT_ACTIVITY') {
    return { ok: false, error: 'Muc "Hoat dong du an" chi nhan noi dung loai PROJECT_ACTIVITY.' }
  }

  return { ok: true }
}

async function validateCategoryForUpdate(nextCategory: string | undefined, currentCategory: string) {
  if (!nextCategory) {
    return { ok: false, error: 'Danh muc la bat buoc' }
  }

  const category = await prisma.category.findUnique({
    where: { slug: nextCategory },
    select: { isActive: true }
  })

  if (!category) {
    return { ok: false, error: 'Danh muc khong ton tai' }
  }

  if (!category.isActive && nextCategory !== currentCategory) {
    return { ok: false, error: 'Danh muc da ngung hoat dong' }
  }

  return { ok: true }
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const content = await prisma.content.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true,
            organization: true
          }
        },
        comments: {
          where: { isApproved: true },
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            },
            replies: {
              where: { isApproved: true },
              include: {
                user: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            comments: true,
            bookmarks: true
          }
        }
      }
    })

    if (!content) {
      return NextResponse.json(
        { error: 'Khong tim thay noi dung' },
        { status: 404 }
      )
    }

    // Check if content is public or user has access
    const user = await requireAuth(request)
    if (!content.isPublic && (!user || (user.id !== content.authorId && user.role !== 'ADMIN'))) {
      return NextResponse.json(
        { error: 'Khong co quyen truy cap noi dung nay' },
        { status: 403 }
      )
    }

    // Increment view count
    await prisma.content.update({
      where: { id },
      data: { viewCount: { increment: 1 } }
    })

    // Log analytics
    await prisma.analytics.create({
      data: {
        event: 'content_view',
        contentId: id,
        userId: user?.id,
        metadata: {
          userAgent: request.headers.get('user-agent'),
          referer: request.headers.get('referer')
        }
      }
    })

    return NextResponse.json(content)
  } catch (error) {
    console.error('Content fetch error:', error)
    return NextResponse.json(
      { error: 'Khong the tai noi dung' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const user = await requireAuth(request)

    if (!user) {
      return NextResponse.json(
        { error: 'Can dang nhap de chinh sua' },
        { status: 401 }
      )
    }

    const content = await prisma.content.findUnique({
      where: { id }
    })

    if (!content) {
      return NextResponse.json(
        { error: 'Khong tim thay noi dung' },
        { status: 404 }
      )
    }

    // Check permissions
    if (content.authorId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Khong co quyen chinh sua noi dung nay' },
        { status: 403 }
      )
    }

    const data = await request.json()
    const {
      title,
      description,
      content: contentText,
      type,
      category,
      tags,
      sectionKey,
      displayOrder,
      undertitle,
      projectUrl,
      isPublic,
      isFeatured,
      status,
      videoUrl,
      imageUrl,
      thumbnailUrl,
      fileUrl,
      fileType,
      fileSize,
      eventStartAt,
      eventEndAt,
      eventTimezone,
      eventLocation,
      isAllDay
    } = data

    const sanitizedContent = sanitizeRichText(contentText || '')
    const normalizedEventStartAt = normalizeEventDate(eventStartAt, isAllDay)
    const normalizedEventEndAt = normalizeEventDate(eventEndAt, isAllDay)
    const normalizedDisplayOrder = normalizeDisplayOrder(displayOrder)

    const placementValidation = validateSectionPlacement(type, sectionKey)
    if (!placementValidation.ok) {
      return NextResponse.json(
        { error: placementValidation.error },
        { status: 400 }
      )
    }

    const categoryValidation = await validateCategoryForUpdate(category, content.category)
    if (!categoryValidation.ok) {
      return NextResponse.json(
        { error: categoryValidation.error },
        { status: 400 }
      )
    }

    if (type === 'PROJECT_ACTIVITY' && !projectUrl) {
      return NextResponse.json(
        { error: 'Hoat dong du an can co Content URL.' },
        { status: 400 }
      )
    }

    if (type === 'EVENT' && !normalizedEventStartAt) {
      return NextResponse.json(
        { error: 'Su kien can co thoi gian bat dau hop le' },
        { status: 400 }
      )
    }

    if (normalizedEventStartAt && normalizedEventEndAt && normalizedEventEndAt < normalizedEventStartAt) {
      return NextResponse.json(
        { error: 'Thoi gian ket thuc phai sau thoi gian bat dau' },
        { status: 400 }
      )
    }

    console.log('Update request for content:', id)
    console.log('Content type being saved:', type)
    console.log('Full data received:', { type, category, title })

    // Only admins can modify featured status or change status of published content
    const updateData: Record<string, unknown> = {
      title,
      description,
      content: sanitizedContent,
      type,
      category,
      tags: Array.isArray(tags) ? tags.join(', ') : tags || '',
      sectionKey: sectionKey || null,
      displayOrder: normalizedDisplayOrder,
      undertitle: undertitle || null,
      projectUrl: projectUrl || null,
      isPublic: isPublic !== false,
      videoUrl: videoUrl || null,
      imageUrl: imageUrl || null,
      thumbnailUrl: thumbnailUrl || null,
      fileUrl: fileUrl || null,
      fileType: fileType || null,
      fileSize: fileSize || null,
      eventStartAt: type === 'EVENT' ? normalizedEventStartAt : null,
      eventEndAt: type === 'EVENT' ? normalizedEventEndAt : null,
      eventTimezone: type === 'EVENT' ? (eventTimezone || null) : null,
      eventLocation: type === 'EVENT' ? (eventLocation || null) : null,
      isAllDay: type === 'EVENT' ? Boolean(isAllDay) : false
    }

    if (user.role === 'ADMIN') {
      updateData.isFeatured = isFeatured
      updateData.status = status
    } else if (content.status === 'DRAFT') {
      updateData.status = status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT'
    }

    console.log('Final updateData being saved:', updateData)

    const updatedContent = await prisma.content.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    } as never)

    console.log('Content updated successfully. New type:', updatedContent.type)

    return NextResponse.json(updatedContent)
  } catch (error) {
    console.error('Content update error:', error)
    return NextResponse.json(
      { error: 'Khong the cap nhat noi dung' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const user = await requireModerator(request)

    if (!user) {
      return NextResponse.json(
        { error: 'Khong co quyen xoa noi dung' },
        { status: 403 }
      )
    }

    const content = await prisma.content.findUnique({
      where: { id }
    })

    if (!content) {
      return NextResponse.json(
        { error: 'Khong tim thay noi dung' },
        { status: 404 }
      )
    }

    // Check permissions
    if (content.authorId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Khong co quyen xoa noi dung nay' },
        { status: 403 }
      )
    }

    await prisma.content.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Da xoa noi dung thanh cong' })
  } catch (error) {
    console.error('Content deletion error:', error)
    return NextResponse.json(
      { error: 'Khong the xoa noi dung' },
      { status: 500 }
    )
  }
}
