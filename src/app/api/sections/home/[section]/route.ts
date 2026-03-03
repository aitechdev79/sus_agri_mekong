import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const SECTION_MAP: Record<string, { sectionKey: 'HOME_DIEN_HINH' | 'HOME_HOAT_DONG_DU_AN'; type: 'STORY' | 'PROJECT_ACTIVITY'; take: number }> = {
  'dien-hinh': { sectionKey: 'HOME_DIEN_HINH', type: 'STORY', take: 6 },
  'hoat-dong-du-an': { sectionKey: 'HOME_HOAT_DONG_DU_AN', type: 'PROJECT_ACTIVITY', take: 6 }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    const { section } = await params
    const config = SECTION_MAP[section]

    if (!config) {
      return NextResponse.json({ error: 'Khong tim thay section' }, { status: 404 })
    }

    const items = await prisma.content.findMany({
      where: {
        status: 'PUBLISHED',
        isPublic: true,
        sectionKey: config.sectionKey,
        type: config.type
      },
      select: {
        id: true,
        title: true,
        description: true,
        undertitle: true,
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
      take: config.take
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('Section fetch error:', error)
    return NextResponse.json(
      { error: 'Khong the tai noi dung chon loc' },
      { status: 500 }
    )
  }
}

export const revalidate = 3600
