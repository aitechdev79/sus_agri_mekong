import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { PublicContent } from '@/types/content';

function toIso(value: Date | null | undefined) {
  return value?.toISOString() || null;
}

async function queryPublishedContent(contentId: string): Promise<PublicContent | null> {
  const content = await prisma.content.findUnique({
    where: { id: contentId },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          role: true,
          organization: true,
        },
      },
    },
  });

  if (!content || content.status !== 'PUBLISHED') {
    return null;
  }

  return {
    ...content,
    publishedAt: toIso(content.publishedAt),
    createdAt: content.createdAt.toISOString(),
    updatedAt: content.updatedAt.toISOString(),
    eventStartAt: toIso(content.eventStartAt),
    eventEndAt: toIso(content.eventEndAt),
  } as PublicContent;
}

export const getPublishedContentById = unstable_cache(
  async (contentId: string) => queryPublishedContent(contentId),
  ['published-content-by-id'],
  { revalidate: 300 }
);
