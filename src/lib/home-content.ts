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

export async function getHomeStoryItems(limit = 3): Promise<HomeContentGridItem[]> {
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
    take: limit,
  });

  return items.map(({ content, contentEn, ...item }) => ({
    ...item,
    hasContent: hasRichText(content) || hasRichText(contentEn),
  }));
}

export async function getHomeNewsItems(limit = 3): Promise<HomeContentGridItem[]> {
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
    take: limit,
  });

  return items.map(({ content, contentEn, ...item }) => ({
    ...item,
    hasContent: hasRichText(content) || hasRichText(contentEn),
  }));
}
