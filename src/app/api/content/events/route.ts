import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function parseDateParam(value: string | null) {
  if (!value) return null

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return 'invalid'
  }

  return date
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const from = parseDateParam(searchParams.get('from'))
    const to = parseDateParam(searchParams.get('to'))

    if (from === 'invalid' || to === 'invalid') {
      return NextResponse.json(
        { error: 'Giá trị from hoặc to không hợp lệ' },
        { status: 400 }
      )
    }

    const events = await prisma.content.findMany({
      where: {
        type: 'EVENT',
        status: 'PUBLISHED',
        isPublic: true,
        eventStartAt: {
          gte: from || undefined,
          lte: to || undefined
        }
      },
      select: {
        id: true,
        title: true,
        description: true,
        thumbnailUrl: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
        eventStartAt: true,
        eventEndAt: true,
        eventTimezone: true,
        eventLocation: true,
        isAllDay: true,
        type: true,
        category: true,
        viewCount: true
      },
      orderBy: {
        eventStartAt: 'asc'
      }
    } as never)

    const response = NextResponse.json(events)
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    return response
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

export const revalidate = 60
