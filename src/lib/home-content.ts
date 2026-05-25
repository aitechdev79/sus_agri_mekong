import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';

export interface HomeContentGridItem {
  id: string;
  title: string;
  titleEn?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
  projectUrl?: string | null;
  thumbnailUrl?: string | null;
  imageUrl?: string | null;
  hasContent?: boolean;
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

const HOME_FEATURED_LIMIT = 3;

async function queryHomeStoryItems(): Promise<HomeContentGridItem[]> {
  const items = await prisma.content.findMany({
    where: {
      status: 'PUBLISHED',
      type: 'STORY',
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
    },
    orderBy: [
      { displayOrder: { sort: 'asc', nulls: 'last' } },
      { publishedAt: { sort: 'desc', nulls: 'last' } },
      { createdAt: 'desc' },
    ],
    take: HOME_FEATURED_LIMIT,
  });

  return items.map(({ content, contentEn, ...item }) => ({
    ...item,
    hasContent: hasRichText(content) || hasRichText(contentEn),
  }));
}

async function queryHomeNewsItems(): Promise<HomeContentGridItem[]> {
  const items = await prisma.content.findMany({
    where: {
      status: 'PUBLISHED',
      type: 'NEWS',
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
    },
    orderBy: [
      { displayOrder: { sort: 'asc', nulls: 'last' } },
      { publishedAt: { sort: 'desc', nulls: 'last' } },
      { createdAt: 'desc' },
    ],
    take: HOME_FEATURED_LIMIT,
  });

  return items.map(({ content, contentEn, ...item }) => ({
    ...item,
    hasContent: hasRichText(content) || hasRichText(contentEn),
  }));
}

export const getHomeStoryItems = unstable_cache(
  queryHomeStoryItems,
  ['home-story-items'],
  { revalidate: 60 }
);

export const getHomeNewsItems = unstable_cache(
  queryHomeNewsItems,
  ['home-news-items'],
  { revalidate: 60 }
);

export async function getHomeFeaturedContent() {
  const [stories, news] = await Promise.all([
    getHomeStoryItems(),
    getHomeNewsItems(),
  ]);

  return { stories, news };
}
