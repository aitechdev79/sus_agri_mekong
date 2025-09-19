import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const stories = await prisma.content.findMany({
      where: {
        status: 'PUBLISHED',
        isPublic: true,
        type: 'STORY'
      },
      select: {
        id: true,
        title: true,
        description: true,
        content: true,
        imageUrl: true,
        thumbnailUrl: true,
        viewCount: true,
        createdAt: true,
        author: {
          select: {
            name: true,
            organization: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 6, // Limit to 6 items for the homepage
    });

    return NextResponse.json(stories);
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stories' },
      { status: 500 }
    );
  }
}

export const revalidate = 3600; // Cache for 1 hour