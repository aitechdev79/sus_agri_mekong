import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const SECTION_MAP: Record<string, { type: 'STORY' | 'PROJECT_ACTIVITY'; take: number }> = {
  'dien-hinh': { type: 'STORY', take: 3 },
  'hoat-dong-du-an': { type: 'PROJECT_ACTIVITY', take: 3 }
}

function hasRichText(value?: string | null) {
  if (!value) return false

  return Boolean(
    value
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .trim()
  )
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    const { section } = await params
    const config = SECTION_MAP[section]

    if (!config) {
      return NextResponse.json({ error: 'Không tìm thấy section' }, { status: 404 })
    }

    const items = await prisma.content.findMany({
      where: {
        status: 'PUBLISHED',
        isPublic: true,
        type: config.type
      },
      select: {
        id: true,
        title: true,
        titleEn: true,
        description: true,
        descriptionEn: true,
        content: true,
        contentEn: true,
        undertitle: true,
        projectUrl: true,
        thumbnailUrl: true,
        imageUrl: true,
        displayOrder: true,
        createdAt: true
      },
      orderBy: [
        { displayOrder: { sort: 'asc', nulls: 'last' } },
        { createdAt: 'desc' }
      ],
      take: config.take
    })

    const responseItems = items.map(({ content, contentEn, ...item }) => ({
      ...item,
      hasContent: hasRichText(content) || hasRichText(contentEn)
    }))

    const response = NextResponse.json(responseItems)
    response.headers.set('Cache-Control', 'no-store, no-cache, max-age=0, must-revalidate')
    return response
  } catch (error) {
    console.error('Section fetch error:', error)
    return NextResponse.json(
      { error: 'Không thể tải nội dung chọn lọc' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0
