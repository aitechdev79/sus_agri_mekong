import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const featuredContent = await prisma.content.findFirst({
      where: {
        status: 'PUBLISHED',
        isPublic: true,
        isFeatured: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        thumbnailUrl: true,
        viewCount: true,
        fileUrl: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!featuredContent) {
      // Fallback to most viewed content if no featured content
      const fallbackContent = await prisma.content.findFirst({
        where: {
          status: 'PUBLISHED',
          isPublic: true,
        },
        select: {
          id: true,
          title: true,
          description: true,
          type: true,
          thumbnailUrl: true,
          viewCount: true,
          fileUrl: true,
          createdAt: true,
        },
        orderBy: {
          viewCount: 'desc',
        },
      });

      return NextResponse.json(fallbackContent);
    }

    return NextResponse.json(featuredContent);
  } catch (error) {
    console.error('Error fetching featured content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured content' },
      { status: 500 }
    );
  }
}