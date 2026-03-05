import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '10', 10))
    const skip = (page - 1) * limit

    const where = {
      status: 'PUBLISHED' as const,
      isPublic: true,
      type: 'STORY' as const,
      sectionKey: 'HOME_DIEN_HINH' as const
    }

    const [contents, total] = await Promise.all([
      prisma.content.findMany({
        where,
        select: {
          id: true,
          title: true,
          titleEn: true,
          description: true,
          descriptionEn: true,
          projectUrl: true,
          thumbnailUrl: true,
          imageUrl: true,
          viewCount: true,
          createdAt: true,
          displayOrder: true
        },
        orderBy: [
          { displayOrder: 'asc' },
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
    console.error('Dien-hinh fetch error:', error)
    return NextResponse.json(
      { error: 'Không thể tải danh sách điển hình' },
      { status: 500 }
    )
  }
}

export const revalidate = 300
