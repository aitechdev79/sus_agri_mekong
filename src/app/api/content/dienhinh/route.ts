import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const dienhinhItems = await prisma.content.findMany({
      where: {
        status: 'PUBLISHED',
        isPublic: true,
        type: 'STORY', // 'Điển hình' content uses STORY type
        // Remove category filter since we want all STORY type content for 'Điển hình'
      },
      select: {
        id: true,
        title: true,
        description: true,
        thumbnailUrl: true,
        imageUrl: true,
        viewCount: true,
        createdAt: true,
        type: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 6, // Limit to 6 items for the homepage
    });

    console.log('Điển hình API - Found items:', dienhinhItems.length);
    dienhinhItems.forEach((item, index) => {
      console.log(`Điển hình ${index + 1}:`, {
        id: item.id,
        title: item.title.substring(0, 50),
        type: item.type,
        category: item.category,
        thumbnailUrl: item.thumbnailUrl ? 'YES' : 'NO',
        imageUrl: item.imageUrl ? 'YES' : 'NO'
      });
    });

    return NextResponse.json(dienhinhItems);
  } catch (error) {
    console.error('Error fetching điển hình:', error);
    return NextResponse.json(
      { error: 'Failed to fetch điển hình' },
      { status: 500 }
    );
  }
}

export const revalidate = 3600; // Cache for 1 hour