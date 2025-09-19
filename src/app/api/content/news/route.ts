import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const newsItems = await prisma.content.findMany({
      where: {
        status: 'PUBLISHED',
        isPublic: true,
        type: {
          in: ['ARTICLE', 'STORY', 'NEWS'], // Including dedicated NEWS content type
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        thumbnailUrl: true,
        imageUrl: true,
        viewCount: true,
        createdAt: true,
        type: true, // Added for debugging
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 6, // Limit to 6 items for the homepage
    });

    console.log('News API - Found items:', newsItems.length);
    newsItems.forEach((item, index) => {
      console.log(`News ${index + 1}:`, {
        id: item.id,
        title: item.title.substring(0, 50),
        type: item.type,
        thumbnailUrl: item.thumbnailUrl ? 'YES' : 'NO',
        imageUrl: item.imageUrl ? 'YES' : 'NO'
      });
    });

    return NextResponse.json(newsItems);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

export const revalidate = 3600; // Cache for 1 hour