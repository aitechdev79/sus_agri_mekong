'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getLocaleFromPathname, withLocalePrefix } from '@/lib/content-locale';
import PartnerLogoCard from '@/components/PartnerLogoCard';

interface PartnerItem {
  id: string;
  companyName: string;
  logoUrl: string | null;
  website: string | null;
}

const FALLBACK_PARTNERS: PartnerItem[] = [
  { id: 'vinamilk', companyName: 'Vinamilk', logoUrl: '/Logo_Vinamilk_(2023).png', website: null },
  { id: 'john-deere', companyName: 'John Deere', logoUrl: '/John_Deere_logo.svg.png', website: null },
  { id: 'loctroi', companyName: 'Loc Troi', logoUrl: '/06-loctroi.png', website: null },
  { id: 'binhdien', companyName: 'Binh Dien', logoUrl: '/03-binhdien.jpg', website: null },
  { id: 'cp', companyName: 'CP', logoUrl: '/02-CP.jpg', website: null },
  { id: 'vietfood', companyName: 'Vietfood', logoUrl: '/vietfood.png', website: null },
  { id: 'agribank', companyName: 'Agribank', logoUrl: '/Agribank.png', website: null },
  { id: 'phan-bon-ca-mau', companyName: 'Phân bón Cà Mau', logoUrl: '/phan bon ca mau.png', website: null },
];

export default function SignUpSection() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isEn = locale === 'en';
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [carouselStart, setCarouselStart] = useState(0);
  const [carouselTransition, setCarouselTransition] = useState(true);

  useEffect(() => {
    const loadPartners = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/partners');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load partners');
        }

        const list = Array.isArray(data.partners) ? data.partners : [];
        setPartners(
          list.filter((item: PartnerItem) => item.logoUrl).map((item: PartnerItem) => ({
            id: item.id,
            companyName: item.companyName,
            logoUrl: item.logoUrl,
            website: item.website ?? null,
          })),
        );
      } catch (error) {
        console.error('Partners section fetch error:', error);
        setPartners([]);
      } finally {
        setLoading(false);
      }
    };

    loadPartners();
  }, []);

  const displayPartners = useMemo(() => {
    if (partners.length > 0) {
      return partners;
    }
    return FALLBACK_PARTNERS;
  }, [partners]);

  useEffect(() => {
    if (displayPartners.length <= 4) {
      setCarouselStart(0);
      setCarouselTransition(true);
      return;
    }

    const intervalId = window.setInterval(() => {
      setCarouselTransition(true);
      setCarouselStart((current) => current + 1);
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [displayPartners.length]);

  const carouselPartners = useMemo(() => {
    if (displayPartners.length <= 4) {
      return displayPartners;
    }

    return [...displayPartners, ...displayPartners.slice(0, 4)];
  }, [displayPartners]);

  const handleCarouselTransitionEnd = () => {
    if (displayPartners.length > 4 && carouselStart >= displayPartners.length) {
      setCarouselTransition(false);
      setCarouselStart(0);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setCarouselTransition(true));
      });
    }
  };

  return (
    <section className="relative bg-vn-rice-white py-14 md:py-20">
      <div className="absolute inset-0 bg-white/55" aria-hidden="true" />
      <div className="container relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative mb-10 md:mb-16">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between md:gap-8">
            <div className="md:max-w-[60%]">
              <p
                className="mb-3 font-montserrat text-xl font-bold uppercase tracking-wider md:mb-4 md:text-2xl"
                style={{ color: 'rgba(60, 60, 59, 0.6)' }}
              >
                {isEn ? 'Partners' : 'Đối tác'}
              </p>

              <h2
                className="max-w-[18rem] text-balance font-montserrat text-[1.35rem] font-semibold leading-snug text-vn-dark md:max-w-none md:text-[22px] md:leading-tight"
              >
                {isEn
                  ? 'Become a partner to connect with VCCI-HCM and receive updates on programs and content.'
                  : 'Trở thành đối tác để được kết nối, cập nhật các chương trình, nội dung với VCCI-HCM'}
              </h2>
            </div>

            <Link
              href={withLocalePrefix('/join-us', locale)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-[#0A7029] px-5 py-4 text-center font-montserrat text-base font-bold text-[#0A7029] transition-colors duration-300 hover:bg-[#0A7029] hover:text-white md:w-auto md:flex-shrink-0 md:px-8 md:py-4"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0A7029';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#0A7029';
              }}
              aria-label={isEn ? 'Become a partner' : 'Trở thành đối tác'}
            >
              {isEn ? 'Become a partner' : 'Trở thành đối tác'}
              <span className="text-xl">→</span>
            </Link>
          </div>
        </div>

        {loading && partners.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-8 text-center text-sm text-gray-500">
            {isEn ? 'Loading partners...' : 'Đang tải đối tác...'}
          </div>
        ) : (
          <div className="overflow-hidden [--partner-gap:0.75rem] sm:[--partner-gap:1rem] lg:[--partner-gap:2rem] [--partner-per-view:1] sm:[--partner-per-view:2] lg:[--partner-per-view:4]">
            <div
              className={`flex gap-[var(--partner-gap)] ${carouselTransition ? 'transition-transform duration-700 ease-in-out' : ''}`}
              style={{
                transform: `translateX(calc(-${carouselStart} * ((100% - ((var(--partner-per-view) - 1) * var(--partner-gap))) / var(--partner-per-view) + var(--partner-gap))))`,
              }}
              onTransitionEnd={handleCarouselTransitionEnd}
            >
              {carouselPartners.map((partner, index) => (
                <div
                  key={`${partner.id}-${index}`}
                  className="shrink-0"
                  style={{ flexBasis: 'calc((100% - ((var(--partner-per-view) - 1) * var(--partner-gap))) / var(--partner-per-view))' }}
                >
                  <PartnerLogoCard
                    companyName={partner.companyName}
                    logoUrl={partner.logoUrl}
                    website={partner.website}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
