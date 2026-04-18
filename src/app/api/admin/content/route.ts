import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function getPagination(request: NextRequest) {
  const page = Number(request.nextUrl.searchParams.get('page') || 1);
  const limit = Number(request.nextUrl.searchParams.get('limit') || 20);
  const currentPage = Number.isFinite(page) && page > 0 ? Math.trunc(page) : 1;
  const currentLimit = Number.isFinite(limit) && limit > 0 ? Math.min(Math.trunc(limit), 100) : 20;

  return {
    page: currentPage,
    limit: currentLimit,
    skip: (currentPage - 1) * currentLimit,
  };
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'MODERATOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { page, limit, skip } = getPagination(request);

    const [content, total, published, draft, viewAggregate] = await Promise.all([
      prisma.content.findMany({
        include: {
          author: {
            select: {
              name: true,
              role: true,
            },
          },
        },
        orderBy: [
          { publishedAt: { sort: 'desc', nulls: 'last' } },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.content.count(),
      prisma.content.count({ where: { status: 'PUBLISHED' } }),
      prisma.content.count({ where: { status: 'DRAFT' } }),
      prisma.content.aggregate({
        _sum: {
          viewCount: true,
        },
      }),
    ]);

    return NextResponse.json({
      contents: content,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit)),
      },
      stats: {
        total,
        published,
        draft,
        totalViews: viewAggregate._sum.viewCount || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching admin content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}
