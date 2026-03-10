import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = Number(searchParams.get('page') || '1');
    const limit = Number(searchParams.get('limit') || '10');

    const currentPage = Number.isFinite(page) && page > 0 ? Math.trunc(page) : 1;
    const currentLimit = Number.isFinite(limit) && limit > 0 ? Math.trunc(limit) : 10;
    const skip = (currentPage - 1) * currentLimit;

    const where = {
      type: 'EVENT' as const,
      status: 'PUBLISHED' as const,
      isPublic: true,
    };

    const [contents, total] = await Promise.all([
      prisma.content.findMany({
        where,
        select: {
          id: true,
          title: true,
          titleEn: true,
          description: true,
          descriptionEn: true,
          thumbnailUrl: true,
          imageUrl: true,
          eventStartAt: true,
          eventEndAt: true,
          eventLocation: true,
          createdAt: true,
        },
        orderBy: [
          { eventStartAt: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: currentLimit,
      }),
      prisma.content.count({ where }),
    ]);

    return NextResponse.json({
      contents,
      pagination: {
        page: currentPage,
        limit: currentLimit,
        total,
        pages: Math.max(1, Math.ceil(total / currentLimit)),
      },
    });
  } catch (error) {
    console.error('Error fetching paginated events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
