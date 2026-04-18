import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const content = await prisma.content.findFirst({
      where: {
        id,
        status: 'PUBLISHED',
        isPublic: true
      },
      select: {
        id: true
      }
    })

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    await prisma.$transaction([
      prisma.content.update({
        where: { id },
        data: { viewCount: { increment: 1 } }
      }),
      prisma.analytics.create({
        data: {
          event: 'content_view',
          contentId: id,
          metadata: {
            userAgent: request.headers.get('user-agent'),
            referer: request.headers.get('referer')
          }
        }
      })
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Content view tracking error:', error)
    return NextResponse.json({ error: 'Failed to track content view' }, { status: 500 })
  }
}
