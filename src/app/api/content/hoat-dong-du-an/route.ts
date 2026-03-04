import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '6', 10))
    const skip = (page - 1) * limit

    const where = {
      status: 'PUBLISHED' as const,
      isPublic: true,
      type: 'PROJECT_ACTIVITY' as const,
      sectionKey: 'HOME_HOAT_DONG_DU_AN' as const
    }

    const [contents, total] = await Promise.all([
      prisma.content.findMany({
        where,
        select: {
          id: true,
          title: true,
          undertitle: true,
          description: true,
          projectUrl: true,
          thumbnailUrl: true,
          imageUrl: true,
          displayOrder: true,
          createdAt: true
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
    console.error('Hoat-dong-du-an fetch error:', error)
    return NextResponse.json(
      { error: 'Không thể tải danh sách hoạt động dự án' },
      { status: 500 }
    )
  }
}

export const revalidate = 300
