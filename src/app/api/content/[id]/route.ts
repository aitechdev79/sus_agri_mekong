import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireModerator } from '@/lib/auth-middleware'
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
    return { ok: false, error: 'Má»¥c "Thá»±c hÃ nh Ä‘iá»ƒn hÃ¬nh" chá»‰ nháº­n ná»™i dung loáº¡i STORY.' }
  }

  if (sectionKey === 'HOME_HOAT_DONG_DU_AN' && type !== 'PROJECT_ACTIVITY') {
    return { ok: false, error: 'Má»¥c "Hoáº¡t Ä‘á»™ng dá»± Ã¡n" chá»‰ nháº­n ná»™i dung loáº¡i PROJECT_ACTIVITY.' }
  }

  return { ok: true }
}

async function validateCategoryForUpdate(nextCategory: string | undefined, currentCategory: string) {
  if (!nextCategory) {
    return { ok: false, error: 'Danh má»¥c lÃ  báº¯t buá»™c' }
  }

  const category = await prisma.category.findUnique({
    where: { slug: nextCategory },
    select: { isActive: true }
  })

  if (!category) {
    return { ok: false, error: 'Danh má»¥c khÃ´ng tá»“n táº¡i' }
  }

  if (!category.isActive && nextCategory !== currentCategory) {
    return { ok: false, error: 'Danh má»¥c Ä‘Ã£ ngá»«ng hoáº¡t Ä‘á»™ng' }
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
        { error: 'KhÃ´ng tÃ¬m tháº¥y ná»™i dung' },
        { status: 404 }
      )
    }

    // Check if content is public or user has access
    const user = await requireModerator(request)
    if (!content.isPublic && (!user || (user.role !== 'ADMIN' && user.role !== 'MODERATOR'))) {
      return NextResponse.json(
        { error: 'KhÃ´ng cÃ³ quyá»n truy cáº­p ná»™i dung nÃ y' },
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
      { error: 'KhÃ´ng thá»ƒ táº£i ná»™i dung' },
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
    const user = await requireModerator(request)

    if (!user) {
      return NextResponse.json(
        { error: 'Cáº§n Ä‘Äƒng nháº­p Ä‘á»ƒ chá»‰nh sá»­a' },
        { status: 403 }
      )
    }

    const content = await prisma.content.findUnique({
      where: { id }
    })

    if (!content) {
      return NextResponse.json(
        { error: 'KhÃ´ng tÃ¬m tháº¥y ná»™i dung' },
        { status: 404 }
      )
    }

    // Check permissions
    if (content.authorId !== user.id && user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
      return NextResponse.json(
        { error: 'KhÃ´ng cÃ³ quyá»n chá»‰nh sá»­a ná»™i dung nÃ y' },
        { status: 403 }
      )
    }

    const data = await request.json()
    const {
      title,
      titleEn,
      description,
      descriptionEn,
      content: contentText,
      contentEn,
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
    const sanitizedContentEn = sanitizeRichText(contentEn || '')
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
        { error: 'Hoáº¡t Ä‘á»™ng dá»± Ã¡n cáº§n cÃ³ Content URL.' },
        { status: 400 }
      )
    }

    if (type === 'EVENT' && !normalizedEventStartAt) {
      return NextResponse.json(
        { error: 'Sá»± kiá»‡n cáº§n cÃ³ thá»i gian báº¯t Ä‘áº§u há»£p lá»‡' },
        { status: 400 }
      )
    }

    if (normalizedEventStartAt && normalizedEventEndAt && normalizedEventEndAt < normalizedEventStartAt) {
      return NextResponse.json(
        { error: 'Thá»i gian káº¿t thÃºc pháº£i sau thá»i gian báº¯t Ä‘áº§u' },
        { status: 400 }
      )
    }

    console.log('Update request for content:', id)
    console.log('Content type being saved:', type)
    console.log('Full data received:', { type, category, title })

    // Only admins can modify featured status or change status of published content
    const updateData: Record<string, unknown> = {
      title,
      titleEn: titleEn || null,
      description,
      descriptionEn: descriptionEn || null,
      content: sanitizedContent,
      contentEn: sanitizedContentEn || null,
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
      { error: 'KhÃ´ng thá»ƒ cáº­p nháº­t ná»™i dung' },
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
        { error: 'KhÃ´ng cÃ³ quyá»n xÃ³a ná»™i dung' },
        { status: 403 }
      )
    }

    const content = await prisma.content.findUnique({
      where: { id }
    })

    if (!content) {
      return NextResponse.json(
        { error: 'KhÃ´ng tÃ¬m tháº¥y ná»™i dung' },
        { status: 404 }
      )
    }

    // Check permissions
    if (content.authorId !== user.id && user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
      return NextResponse.json(
        { error: 'KhÃ´ng cÃ³ quyá»n xÃ³a ná»™i dung nÃ y' },
        { status: 403 }
      )
    }

    await prisma.content.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'ÄÃ£ xÃ³a ná»™i dung thÃ nh cÃ´ng' })
  } catch (error) {
    console.error('Content deletion error:', error)
    return NextResponse.json(
      { error: 'KhÃ´ng thá»ƒ xÃ³a ná»™i dung' },
      { status: 500 }
    )
  }
}


