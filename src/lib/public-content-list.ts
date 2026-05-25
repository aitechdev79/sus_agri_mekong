import { unstable_cache } from 'next/cache';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export interface PublicListPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PublicListResponse<T> {
  contents: T[];
  pagination: PublicListPagination;
}

export interface EventListItem {
  id: string;
  title: string;
  titleEn: string | null;
  description: string | null;
  descriptionEn: string | null;
  thumbnailUrl: string | null;
  imageUrl: string | null;
  eventStartAt: Date | null;
  eventEndAt: Date | null;
  eventLocation: string | null;
  createdAt: Date;
}

export interface PolicyListItem {
  id: string;
  title: string;
  titleEn: string | null;
  description: string | null;
  descriptionEn: string | null;
}

export interface ReportListItem {
  id: string;
  title: string;
  titleEn: string | null;
  description: string | null;
  descriptionEn: string | null;
  thumbnailUrl: string | null;
  imageUrl: string | null;
  fileUrl: string | null;
}

export interface NewsListItem {
  id: string;
  title: string;
  titleEn: string | null;
  description: string | null;
  descriptionEn: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  viewCount: number;
  thumbnailUrl: string | null;
  imageUrl: string | null;
  category: string;
}

export interface StoryListItem {
  id: string;
  title: string;
  titleEn: string | null;
  description: string | null;
  descriptionEn: string | null;
  thumbnailUrl: string | null;
  imageUrl: string | null;
  viewCount: number;
  publishedAt: Date | null;
  createdAt: Date;
}

export interface ProjectActivityListItem {
  id: string;
  title: string;
  titleEn: string | null;
  undertitle: string | null;
  description: string | null;
  descriptionEn: string | null;
  projectUrl: string | null;
  thumbnailUrl: string | null;
  imageUrl: string | null;
}

function normalizePage(value: number) {
  return Number.isFinite(value) && value > 0 ? Math.trunc(value) : 1;
}

function normalizeLimit(value: number, fallback: number) {
  return Number.isFinite(value) && value > 0 ? Math.min(Math.trunc(value), 50) : fallback;
}

function searchWhere(search?: string): Prisma.ContentWhereInput | undefined {
  const normalized = search?.trim();
  if (!normalized) return undefined;

  return {
    OR: [
      { title: { contains: normalized, mode: 'insensitive' } },
      { titleEn: { contains: normalized, mode: 'insensitive' } },
      { description: { contains: normalized, mode: 'insensitive' } },
      { descriptionEn: { contains: normalized, mode: 'insensitive' } },
      { content: { contains: normalized, mode: 'insensitive' } },
      { contentEn: { contains: normalized, mode: 'insensitive' } },
    ],
  };
}

export const getPublicEventsPage = unstable_cache(
  async (pageValue = 1, limitValue = 10): Promise<PublicListResponse<EventListItem>> => {
    const page = normalizePage(pageValue);
    const limit = normalizeLimit(limitValue, 10);
    const skip = (page - 1) * limit;
    const where: Prisma.ContentWhereInput = {
      type: 'EVENT',
      status: 'PUBLISHED',
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
          { eventStartAt: { sort: 'desc', nulls: 'last' } },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.content.count({ where }),
    ]);

    return {
      contents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  },
  ['public-events-page'],
  { revalidate: 60 }
);

export const getPublicPoliciesPage = unstable_cache(
  async (pageValue = 1, limitValue = 10, search = ''): Promise<PublicListResponse<PolicyListItem>> => {
    const page = normalizePage(pageValue);
    const limit = normalizeLimit(limitValue, 10);
    const skip = (page - 1) * limit;
    const where: Prisma.ContentWhereInput = {
      type: 'POLICY',
      status: 'PUBLISHED',
      ...searchWhere(search),
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
        },
        orderBy: [
          { publishedAt: { sort: 'desc', nulls: 'last' } },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.content.count({ where }),
    ]);

    return {
      contents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  },
  ['public-policies-page'],
  { revalidate: 60 }
);

export const getPublicReportsPage = unstable_cache(
  async (pageValue = 1, limitValue = 6, search = ''): Promise<PublicListResponse<ReportListItem>> => {
    const page = normalizePage(pageValue);
    const limit = normalizeLimit(limitValue, 6);
    const skip = (page - 1) * limit;
    const where: Prisma.ContentWhereInput = {
      type: 'DOCUMENT',
      status: 'PUBLISHED',
      ...searchWhere(search),
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
          fileUrl: true,
        },
        orderBy: [
          { publishedAt: { sort: 'desc', nulls: 'last' } },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.content.count({ where }),
    ]);

    return {
      contents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  },
  ['public-reports-page'],
  { revalidate: 60 }
);

export const getPublicNewsPage = unstable_cache(
  async (pageValue = 1, limitValue = 10): Promise<PublicListResponse<NewsListItem>> => {
    const page = normalizePage(pageValue);
    const limit = normalizeLimit(limitValue, 10);
    const skip = (page - 1) * limit;
    const where: Prisma.ContentWhereInput = {
      status: 'PUBLISHED',
      type: { in: ['NEWS', 'ARTICLE'] },
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
          publishedAt: true,
          createdAt: true,
          viewCount: true,
          thumbnailUrl: true,
          imageUrl: true,
          category: true,
        },
        orderBy: [
          { publishedAt: { sort: 'desc', nulls: 'last' } },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.content.count({ where }),
    ]);

    return {
      contents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  },
  ['public-news-page'],
  { revalidate: 60 }
);

export const getPublicStoriesPage = unstable_cache(
  async (pageValue = 1, limitValue = 5): Promise<PublicListResponse<StoryListItem>> => {
    const page = normalizePage(pageValue);
    const limit = normalizeLimit(limitValue, 5);
    const skip = (page - 1) * limit;
    const where: Prisma.ContentWhereInput = {
      status: 'PUBLISHED',
      type: 'STORY',
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
          viewCount: true,
          publishedAt: true,
          createdAt: true,
        },
        orderBy: [
          { publishedAt: { sort: 'desc', nulls: 'last' } },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.content.count({ where }),
    ]);

    return {
      contents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  },
  ['public-stories-page'],
  { revalidate: 60 }
);

export const getPublicFeaturedStoriesPage = unstable_cache(
  async (pageValue = 1, limitValue = 10): Promise<PublicListResponse<StoryListItem>> => {
    const page = normalizePage(pageValue);
    const limit = normalizeLimit(limitValue, 10);
    const skip = (page - 1) * limit;
    const where: Prisma.ContentWhereInput = {
      status: 'PUBLISHED',
      type: 'STORY',
      sectionKey: 'HOME_DIEN_HINH',
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
          viewCount: true,
          publishedAt: true,
          createdAt: true,
        },
        orderBy: [
          { displayOrder: { sort: 'asc', nulls: 'last' } },
          { publishedAt: { sort: 'desc', nulls: 'last' } },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.content.count({ where }),
    ]);

    return {
      contents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  },
  ['public-featured-stories-page'],
  { revalidate: 60 }
);

export const getPublicProjectActivitiesPage = unstable_cache(
  async (pageValue = 1, limitValue = 6): Promise<PublicListResponse<ProjectActivityListItem>> => {
    const page = normalizePage(pageValue);
    const limit = normalizeLimit(limitValue, 6);
    const skip = (page - 1) * limit;
    const where: Prisma.ContentWhereInput = {
      status: 'PUBLISHED',
      type: 'PROJECT_ACTIVITY',
    };

    const [contents, total] = await Promise.all([
      prisma.content.findMany({
        where,
        select: {
          id: true,
          title: true,
          titleEn: true,
          undertitle: true,
          description: true,
          descriptionEn: true,
          projectUrl: true,
          thumbnailUrl: true,
          imageUrl: true,
        },
        orderBy: [
          { displayOrder: { sort: 'asc', nulls: 'last' } },
          { publishedAt: { sort: 'desc', nulls: 'last' } },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.content.count({ where }),
    ]);

    return {
      contents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  },
  ['public-project-activities-page'],
  { revalidate: 60 }
);
