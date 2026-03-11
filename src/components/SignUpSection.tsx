'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getLocaleFromPathname, withLocalePrefix } from '@/lib/content-locale';

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
      return partners.slice(0, 8);
    }
    return FALLBACK_PARTNERS;
  }, [partners]);

  return (
    <section className="bg-vn-rice-white py-20">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="relative mb-16">
          <div className="flex items-start justify-between">
            <div style={{ maxWidth: '60%' }}>
              <p
                className="mb-4 font-montserrat text-[18px] font-semibold uppercase tracking-wider"
                style={{ color: 'rgba(60, 60, 59, 0.6)' }}
              >
                {isEn ? 'Become a partner' : 'Trở thành đối tác'}
              </p>

              <h2
                className="font-montserrat text-vn-dark font-bold leading-tight"
                style={{ fontSize: '38.4px', fontWeight: 700 }}
              >
                {isEn
                  ? 'Partners receive updates on new programs and content. Connect with businesses, experts and farmers in the ecosystem.'
                  : 'Đối tác doanh nghiệp được cập nhật các chương trình và nội dung mới nhất. Được kết nối với cộng đồng doanh nghiệp, chuyên gia và nông dân.'}
              </h2>
            </div>

            <Link
              href={withLocalePrefix('/join-us', locale)}
              className="inline-flex flex-shrink-0 items-center gap-2 font-montserrat font-bold transition-all duration-300 hover:scale-105"
              style={{ border: '2px solid #0A7029', color: '#0A7029', padding: '16px 32px', borderRadius: '8px', backgroundColor: 'transparent' }}
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
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-10 text-center text-sm text-gray-500">
            {isEn ? 'Loading partners...' : 'Đang tải đối tác...'}
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
              {displayPartners.slice(0, 4).map((partner) => (
                <div
                  key={partner.id}
                  className="bg-white rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-105"
                  style={{ border: '1px solid rgba(0, 0, 0, 0.1)', padding: '24px', maxHeight: '120px' }}
                >
                  <div className="relative flex h-20 w-full items-center justify-center">
                    <Image src={partner.logoUrl || '/Logo_Vinamilk_(2023).png'} alt={partner.companyName} fill className="object-contain" />
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200" style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }} />

            <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
              {displayPartners.slice(4, 8).map((partner) => (
                <div
                  key={partner.id}
                  className="bg-white rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-105"
                  style={{ border: '1px solid rgba(0, 0, 0, 0.1)', padding: '24px', maxHeight: '120px' }}
                >
                  <div className="relative flex h-20 w-full items-center justify-center">
                    <Image src={partner.logoUrl || '/Logo_Vinamilk_(2023).png'} alt={partner.companyName} fill className="object-contain" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
