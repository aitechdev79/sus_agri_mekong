import { permanentRedirect } from 'next/navigation';

interface CommitmentRedirectPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CommitmentRedirectPage({ params }: CommitmentRedirectPageProps) {
  const { locale } = await params;
  permanentRedirect(`/${locale}/vision-mission`);
}
