'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Handshake, Network, BookOpen } from 'lucide-react';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import PartnerLogoCard from '@/components/PartnerLogoCard';
import { getLocaleFromPathname, withLocalePrefix } from '@/lib/content-locale';
import type { PublicPartnerItem } from '@/lib/public-partners';

const FALLBACK_PARTNERS: PublicPartnerItem[] = [
  { id: 'vinamilk', companyName: 'Vinamilk', logoUrl: '/Logo_Vinamilk_(2023).png', website: null },
  { id: 'john-deere', companyName: 'John Deere', logoUrl: '/John_Deere_logo.svg.png', website: null },
  { id: 'loctroi', companyName: 'Loc Troi', logoUrl: '/06-loctroi.png', website: null },
  { id: 'binhdien', companyName: 'Binh Dien', logoUrl: '/03-binhdien.jpg', website: null },
  { id: 'cp', companyName: 'CP', logoUrl: '/02-CP.jpg', website: null },
];

interface JoinUsPageClientProps {
  initialPartners: PublicPartnerItem[];
}

export default function JoinUsPageClient({ initialPartners = [] }: JoinUsPageClientProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isEn = locale === 'en';
  const signUpBusinessHref =
    session?.user?.role === 'BUSINESS'
      ? `${withLocalePrefix('/business/profile', locale)}?init=1`
      : `${withLocalePrefix('/auth/signup', locale)}?role=business`;
  const [partners, setPartners] = useState<PublicPartnerItem[]>(initialPartners);
  const [loadingPartners, setLoadingPartners] = useState(initialPartners.length === 0);

  useEffect(() => {
    if (initialPartners.length > 0) {
      setPartners(initialPartners);
      setLoadingPartners(false);
      return;
    }

    const loadPartners = async () => {
      try {
        setLoadingPartners(true);
        const response = await fetch('/api/partners?all=1');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load partners');
        }

        const list = Array.isArray(data.partners) ? data.partners : [];
        setPartners(
          list
            .filter((item: PublicPartnerItem) => item.logoUrl)
            .map((item: PublicPartnerItem) => ({
              id: item.id,
              companyName: item.companyName,
              logoUrl: item.logoUrl,
              website: item.website ?? null,
            })),
        );
      } catch (error) {
        console.error('Join-us partners fetch error:', error);
        setPartners([]);
      } finally {
        setLoadingPartners(false);
      }
    };

    void loadPartners();
  }, [initialPartners]);

  const displayPartners = useMemo(() => {
    if (partners.length > 0) return partners;
    return FALLBACK_PARTNERS;
  }, [partners]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50 font-montserrat">
      <NavigationBar />

      <main className="pt-24">
        <section className="container mx-auto max-w-5xl px-6 py-10 pb-16">
          <div className="overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-xl">
            <div className="grid gap-0 md:grid-cols-[1.1fr_1fr]">
              <div className="px-7 py-9 md:px-10 md:py-12">
                <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                  {isEn ? 'Join the Partner Network' : 'Tham gia mạng lưới đối tác'}
                </h1>

                <p className="mt-5 text-justify text-base leading-relaxed text-slate-700">
                  {isEn
                    ? 'Become a member of our collaboration network to advance business goals in innovation and sustainable development. We connect industry leaders to create positive solutions for Vietnam’s agricultural community.'
                    : 'Tham gia thành viên của mạng lưới đối tác, doanh nghiệp liên kết cùng VCCI-HCM để kết nối, cập nhật thông tin và thúc đẩy các mục tiêu kinh doanh và phát triển bền vững. Tại đây chúng tôi kết nối các đối tác trong và ngoài nước, các doanh nghiệp, hiệp hội để xây dựng nền tảng phát triển bền vững cho cộng đồng doanh nghiệp tại Việt Nam.'}
                </p>
                {isEn && (
                  <p className="mt-4 text-justify text-base leading-relaxed text-slate-700">
                    By joining this global initiative, you can collaborate with leading organizations, share knowledge, and help build a more sustainable agricultural value chain.
                  </p>
                )}
              </div>

              <div className="relative min-h-72">
                <Image
                  src="/hero_members.jpg"
                  alt={isEn ? 'Join the collaboration network' : 'Tham gia mạng lưới hợp tác'}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="bg-vn-rice-white px-7 py-8 md:px-10">
              <div className="mb-7 grid gap-4 md:grid-cols-3">
                <article className="rounded-2xl p-6">
                  <div className="mb-3 inline-flex rounded-lg bg-amber-100 p-2 text-amber-700">
                    <Network className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">{isEn ? 'Connect' : 'Kết nối'}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {isEn
                      ? 'Connect with leading businesses and experts in the industry.'
                      : 'Kết nối với các doanh nghiệp và chuyên gia hàng đầu trong ngành.'}
                  </p>
                </article>

                <article className="rounded-2xl p-6">
                  <div className="mb-3 inline-flex rounded-lg bg-amber-100 p-2 text-amber-700">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">{isEn ? 'Share' : 'Chia sẻ'}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {isEn
                      ? 'Access research, reports, and best-practice toolkits.'
                      : 'Tiếp cận các nghiên cứu, báo cáo và công cụ thực hành tốt nhất.'}
                  </p>
                </article>

                <article className="rounded-2xl p-6">
                  <div className="mb-3 inline-flex rounded-lg bg-amber-100 p-2 text-amber-700">
                    <Handshake className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">{isEn ? 'Collaborate' : 'Hợp tác'}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {isEn
                      ? 'Join collaborative projects and sustainable development initiatives.'
                      : 'Tham gia các dự án hợp tác và sáng kiến phát triển bền vững.'}
                  </p>
                </article>
              </div>

              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h3 className="text-lg font-semibold text-slate-900">{isEn ? 'Partners' : 'ĐỐI TÁC'}</h3>
                <Link
                  href={signUpBusinessHref}
                  className="inline-flex items-center justify-center self-start rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 md:self-auto"
                >
                  {isEn ? 'Become a partner' : 'Trở thành đối tác'}
                </Link>
              </div>

              {loadingPartners && partners.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white px-6 py-8 text-center text-sm text-gray-500">
                  {isEn ? 'Loading partners...' : 'Đang tải đối tác...'}
                </div>
              ) : (
                <div className="grid grid-cols-2 justify-center gap-6 md:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] md:gap-8">
                  {displayPartners.map((partner, index) => (
                    <PartnerLogoCard
                      key={partner.id}
                      companyName={partner.companyName}
                      logoUrl={partner.logoUrl}
                      website={partner.website}
                      priority={index < 4}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
