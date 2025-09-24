import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-middleware'

interface AnalyticsWhere {
  createdAt: {
    gte: Date
  }
  event?: string
}

interface DailyStats {
  [date: string]: {
    [event: string]: number
  }
}

interface AnalyticsItem {
  event: string
  createdAt: Date
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const { event, contentId, metadata } = await request.json()

    if (!event) {
      return NextResponse.json(
        { error: 'Event là bắt buộc' },
        { status: 400 }
      )
    }

    await prisma.analytics.create({
      data: {
        event,
        contentId,
        userId: user?.id,
        metadata: metadata || {}
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Không thể ghi nhận analytics' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')
    const event = searchParams.get('event')

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const where: AnalyticsWhere = {
      createdAt: {
        gte: startDate
      }
    }

    if (event) {
      where.event = event
    }

    const [analytics, topContent, eventCounts] = await Promise.all([
      // Daily analytics
      prisma.analytics.findMany({
        where,
        select: {
          event: true,
          createdAt: true,
          contentId: true
        },
        orderBy: { createdAt: 'desc' }
      }),

      // Top content by views
      prisma.content.findMany({
        where: {
          status: 'PUBLISHED'
        },
        select: {
          id: true,
          title: true,
          viewCount: true,
          downloadCount: true,
          category: true,
          type: true
        },
        orderBy: { viewCount: 'desc' },
        take: 10
      }),

      // Event counts
      prisma.analytics.groupBy({
        by: ['event'],
        where,
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        }
      })
    ])

    // Group analytics by day
    const dailyStats = analytics.reduce((acc: DailyStats, item: AnalyticsItem) => {
      const date = item.createdAt.toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = {}
      }
      if (!acc[date][item.event]) {
        acc[date][item.event] = 0
      }
      acc[date][item.event]++
      return acc
    }, {})

    return NextResponse.json({
      dailyStats,
      topContent,
      eventCounts,
      summary: {
        totalEvents: analytics.length,
        uniqueContent: new Set(analytics.map(a => a.contentId).filter(Boolean)).size,
        dateRange: { start: startDate, end: new Date() }
      }
    })
  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json(
      { error: 'Không thể tải analytics' },
      { status: 500 }
    )
  }
}