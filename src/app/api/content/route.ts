import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-middleware'

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

    const where: any = {
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
        where.type = { in: types }
      } else {
        where.type = type
      }
    }

    if (featured) {
      where.isFeatured = true
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { titleEn: { contains: search } },
        { description: { contains: search } },
        { descriptionEn: { contains: search } },
        { content: { contains: search } },
        { contentEn: { contains: search } }
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

    // Only admins can create featured content or publish directly
    const finalStatus = user.role === 'ADMIN' ? (status || 'PUBLISHED') : 'DRAFT'
    const finalIsFeatured = user.role === 'ADMIN' ? (isFeatured || false) : false

    const newContent = await prisma.content.create({
      data: {
        title,
        description,
        content,
        type,
        category,
        tags: Array.isArray(tags) ? tags.join(', ') : tags || '',
        isPublic: isPublic !== false,
        isFeatured: finalIsFeatured,
        status: finalStatus,
        authorId: user.id,
        videoUrl: videoUrl || null,
        imageUrl: imageUrl || null,
        thumbnailUrl: thumbnailUrl || null,
        fileUrl: fileUrl || null,
        fileType: fileType || null,
        fileSize: fileSize || null
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
    })

    return NextResponse.json(newContent, { status: 201 })
  } catch (error) {
    console.error('Content creation error:', error)
    return NextResponse.json(
      { error: 'Không thể tạo nội dung' },
      { status: 500 }
    )
  }
}