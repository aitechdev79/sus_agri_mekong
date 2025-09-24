import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, requireModerator } from '@/lib/auth-middleware'

interface RouteParams {
  params: Promise<{ id: string }>
}

interface ContentUpdateData {
  title: string
  description: string
  content: string
  type: string
  category: string
  tags: string
  isPublic: boolean
  videoUrl?: string | null
  imageUrl?: string | null
  thumbnailUrl?: string | null
  fileUrl?: string | null
  fileType?: string | null
  fileSize?: number | null
  isFeatured?: boolean
  status?: string
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
      fileSize
    } = data

    console.log('Update request for content:', id)
    console.log('Content type being saved:', type)
    console.log('Full data received:', { type, category, title })

    // Only admins can modify featured status or change status of published content
    const updateData: ContentUpdateData = {
      title,
      description,
      content: contentText,
      type,
      category,
      tags: Array.isArray(tags) ? tags.join(', ') : tags || '',
      isPublic: isPublic !== false,
      videoUrl: videoUrl || null,
      imageUrl: imageUrl || null,
      thumbnailUrl: thumbnailUrl || null,
      fileUrl: fileUrl || null,
      fileType: fileType || null,
      fileSize: fileSize || null
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
    })

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