import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const communityItems = await prisma.content.findMany({
      where: {
        status: 'PUBLISHED',
        isPublic: true,
        type: {
          in: ['STORY', 'GUIDE'], // Community stories and guides
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        thumbnailUrl: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 9, // Limit to 9 items for carousel (3 slides of 3 items)
    });

    return NextResponse.json(communityItems);
  } catch (error) {
    console.error('Error fetching community content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch community content' },
      { status: 500 }
    );
  }
}

export const revalidate = 3600; // Cache for 1 hour