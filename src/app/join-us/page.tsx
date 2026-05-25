import JoinUsPageClient from '@/components/join-us/JoinUsPageClient';
import { getPublicPartners } from '@/lib/public-partners';
import type { PublicPartnerItem } from '@/lib/public-partners';

export const revalidate = 60;

export default async function JoinUsPage() {
  let partners: PublicPartnerItem[] = [];

  try {
    const result = await getPublicPartners(true);
    partners = result.partners;
  } catch (error) {
    console.error('Failed to preload join-us partners:', error);
  }

  return <JoinUsPageClient initialPartners={partners} />;
}
