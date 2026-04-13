import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getLimit(request: NextRequest) {
  const limit = Number(request.nextUrl.searchParams.get('limit') || 3);
  if (!Number.isFinite(limit)) return 3;
  return Math.min(Math.max(Math.trunc(limit), 1), 6);
}

export async function GET(request: NextRequest) {
  try {
    const limit = getLimit(request);

    const newsItems = await prisma.content.findMany({
      where: {
        status: 'PUBLISHED',
        isPublic: true,
        type: 'NEWS', // Only NEWS content type
      },
      select: {
        id: true,
        title: true,
        titleEn: true,
        description: true,
        descriptionEn: true,
        thumbnailUrl: true,
        imageUrl: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    const response = NextResponse.json(newsItems);

    response.headers.set('Cache-Control', 'no-store, no-cache, max-age=0, must-revalidate');

    return response;
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
