import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getLimit(request: NextRequest) {
  const limit = Number(request.nextUrl.searchParams.get('limit') || 3);
  if (!Number.isFinite(limit)) return 3;
  return Math.min(Math.max(Math.trunc(limit), 1), 6);
}

function hasRichText(value?: string | null) {
  if (!value) return false;

  return Boolean(
    value
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .trim()
  );
}

export async function GET(request: NextRequest) {
  try {
    const limit = getLimit(request);

    const newsItems = await prisma.content.findMany({
      where: {
        status: 'PUBLISHED',
        type: 'NEWS', // Only NEWS content type
      },
      select: {
        id: true,
        title: true,
        titleEn: true,
        description: true,
        descriptionEn: true,
        content: true,
        contentEn: true,
        projectUrl: true,
        thumbnailUrl: true,
        imageUrl: true,
        publishedAt: true,
        createdAt: true,
      },
      orderBy: [
        { displayOrder: { sort: 'asc', nulls: 'last' } },
        { publishedAt: { sort: 'desc', nulls: 'last' } },
        { createdAt: 'desc' },
      ],
      take: limit,
    });

    const responseItems = newsItems.map(({ content, contentEn, ...item }) => ({
      ...item,
      hasContent: hasRichText(content) || hasRichText(contentEn),
    }));

    const response = NextResponse.json(responseItems);

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
