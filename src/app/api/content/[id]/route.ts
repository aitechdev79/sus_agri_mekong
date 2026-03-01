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
        { error: 'Không tìm thấy nội dung' },
        { status: 404 }
      )
    }

    // Check if content is public or user has access
    const user = await requireAuth(request)
    if (!content.isPublic && (!user || (user.id !== content.authorId && user.role !== 'ADMIN'))) {
      return NextResponse.json(
        { error: 'Không có quyền truy cập nội dung này' },
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
      { error: 'Không thể tải nội dung' },
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
        { error: 'Cần đăng nhập để chỉnh sửa' },
        { status: 401 }
      )
    }

    const content = await prisma.content.findUnique({
      where: { id }
    })

    if (!content) {
      return NextResponse.json(
        { error: 'Không tìm thấy nội dung' },
        { status: 404 }
      )
    }

    // Check permissions
    if (content.authorId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Không có quyền chỉnh sửa nội dung này' },
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

    if (type === 'EVENT' && !normalizedEventStartAt) {
      return NextResponse.json(
        { error: 'Sự kiện cần có thời gian bắt đầu hợp lệ' },
        { status: 400 }
      )
    }

    if (normalizedEventStartAt && normalizedEventEndAt && normalizedEventEndAt < normalizedEventStartAt) {
      return NextResponse.json(
        { error: 'Thời gian kết thúc phải sau thời gian bắt đầu' },
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
      { error: 'Không thể cập nhật nội dung' },
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
        { error: 'Không có quyền xóa nội dung' },
        { status: 403 }
      )
    }

    const content = await prisma.content.findUnique({
      where: { id }
    })

    if (!content) {
      return NextResponse.json(
        { error: 'Không tìm thấy nội dung' },
        { status: 404 }
      )
    }

    // Check permissions
    if (content.authorId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Không có quyền xóa nội dung này' },
        { status: 403 }
      )
    }

    await prisma.content.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Đã xóa nội dung thành công' })
  } catch (error) {
    console.error('Content deletion error:', error)
    return NextResponse.json(
      { error: 'Không thể xóa nội dung' },
      { status: 500 }
    )
  }
}
