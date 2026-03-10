import { NextRequest, NextResponse } from 'next/server'
import { requireModerator } from '@/lib/auth-middleware'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

// Use Prisma's generated types for proper type safety
type ContentWhereInput = Prisma.ContentWhereInput

export async function GET(request: NextRequest) {
  try {
    const user = await requireModerator(request)

    if (!user) {
      return NextResponse.json(
        { error: 'Cáº§n Ä‘Äƒng nháº­p Ä‘á»ƒ xem file' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    const where: ContentWhereInput = {
      authorId: user.id,
      fileUrl: { not: null }
    }

    if (type) {
      where.fileType = { startsWith: type }
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { tags: { contains: search } }
      ]
    }

    const [files, total] = await Promise.all([
      prisma.content.findMany({
        where,
        select: {
          id: true,
          title: true,
          fileUrl: true,
          fileType: true,
          fileSize: true,
          thumbnailUrl: true,
          createdAt: true,
          downloadCount: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.content.count({ where })
    ])

    return NextResponse.json({
      files,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Files fetch error:', error)
    return NextResponse.json(
      { error: 'KhÃ´ng thá»ƒ táº£i danh sÃ¡ch file' },
      { status: 500 }
    )
  }
}
