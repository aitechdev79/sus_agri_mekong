import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

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
    const search = request.nextUrl.searchParams.get('search')?.trim() || '';
    const category = request.nextUrl.searchParams.get('category')?.trim() || '';
    const type = request.nextUrl.searchParams.get('type')?.trim() || '';
    const contentStatus = request.nextUrl.searchParams.get('status')?.trim() || '';
    const where: Prisma.ContentWhereInput = {
      ...(category ? { category } : {}),
      ...(type ? { type: type as Prisma.EnumContentTypeFilter['equals'] } : {}),
      ...(contentStatus ? { status: contentStatus as Prisma.EnumContentStatusFilter['equals'] } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { titleEn: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { descriptionEn: { contains: search, mode: 'insensitive' } },
              { tags: { contains: search, mode: 'insensitive' } },
              { author: { name: { contains: search, mode: 'insensitive' } } },
              { author: { email: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };

    const [content, total, published, draft, viewAggregate] = await Promise.all([
      prisma.content.findMany({
        where,
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
      prisma.content.count({ where }),
      prisma.content.count({ where: { ...where, status: 'PUBLISHED' } }),
      prisma.content.count({ where: { ...where, status: 'DRAFT' } }),
      prisma.content.aggregate({
        where,
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
