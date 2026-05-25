import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';

export interface PublicPartnerItem {
  id: string;
  companyName: string;
  logoUrl: string | null;
  website: string | null;
}

const PARTNERS_HOME_LIMIT_KEY = 'partners_home_limit';
const DEFAULT_HOME_LIMIT = 4;

async function queryPublicPartners(showAll: boolean): Promise<{
  partners: PublicPartnerItem[];
  homeDisplayLimit: number;
}> {
  const setting = await prisma.appSetting.findUnique({
    where: { key: PARTNERS_HOME_LIMIT_KEY },
    select: { valueInt: true },
  });

  const homeDisplayLimit = setting?.valueInt && setting.valueInt > 0 ? setting.valueInt : DEFAULT_HOME_LIMIT;

  const partners = await prisma.businessProfile.findMany({
    where: {
      status: 'APPROVED',
      isPublic: true,
      displayOrder: {
        gte: 0,
      },
    },
    select: {
      id: true,
      companyName: true,
      logoUrl: true,
      website: true,
    },
    orderBy: [{ displayOrder: 'asc' }, { updatedAt: 'desc' }],
    ...(showAll ? {} : { take: homeDisplayLimit }),
  });

  return { partners, homeDisplayLimit };
}

export const getPublicPartners = unstable_cache(queryPublicPartners, ['public-partners'], {
  revalidate: 60,
});
