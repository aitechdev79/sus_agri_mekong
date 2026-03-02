import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { requireAuth } from '@/lib/auth-middleware'
import { sanitizeRichText } from '@/lib/sanitize'

// Use Prisma's generated types for proper type safety
type ContentWhereInput = Prisma.ContentWhereInput

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
    return { ok: false, error: 'Mục "Thực hành điển hình" chỉ nhận nội dung loại Điển hình (STORY).' }
  }

  if (sectionKey === 'HOME_HOAT_DONG_DU_AN' && type !== 'PROJECT_ACTIVITY') {
    return { ok: false, error: 'Mục "Hoạt động dự án" chỉ nhận nội dung loại Hoạt động dự án.' }
  }

  return { ok: true }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured') === 'true'

    const skip = (page - 1) * limit

    const where: ContentWhereInput = {
      status: 'PUBLISHED',
      isPublic: true
    }

    if (category) {
      where.category = category
    }

    if (type) {
      // Handle multiple types separated by comma
      if (type.includes(',')) {
        const types = type.split(',').map(t => t.trim())
        where.type = { in: types as never }
      } else {
        where.type = type as never
      }
    }

    if (featured) {
      where.isFeatured = true
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { content: { contains: search } }
      ]
    }

    const [contents, total] = await Promise.all([
      prisma.content.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              role: true
            }
          },
          _count: {
            select: {
              comments: true,
              bookmarks: true
            }
          }
        },
        orderBy: [
          { isFeatured: 'desc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.content.count({ where })
    ])

    return NextResponse.json({
      contents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Content fetch error:', error)
    return NextResponse.json(
      { error: 'Không thể tải nội dung' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)

    if (!user) {
      return NextResponse.json(
        { error: 'Cần đăng nhập để tạo nội dung' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const {
      title,
      description,
      content,
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

    const sanitizedContent = sanitizeRichText(content || '')
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

    if (type === 'PROJECT_ACTIVITY' && !projectUrl) {
      return NextResponse.json(
        { error: 'Hoạt động dự án cần có đường dẫn dự án (URL).' },
        { status: 400 }
      )
    }

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

    // Only admins can create featured content or publish directly
    const finalStatus = user.role === 'ADMIN' ? (status || 'PUBLISHED') : 'DRAFT'
    const finalIsFeatured = user.role === 'ADMIN' ? (isFeatured || false) : false

    const newContent = await prisma.content.create({
      data: {
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
        isFeatured: finalIsFeatured,
        status: finalStatus,
        authorId: user.id,
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
      },
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

    return NextResponse.json(newContent, { status: 201 })
  } catch (error) {
    console.error('Content creation error:', error)
    return NextResponse.json(
      { error: 'Không thể tạo nội dung' },
      { status: 500 }
    )
  }
}
