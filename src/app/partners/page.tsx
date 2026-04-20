'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { Building2, Factory, Globe2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { getLocaleFromPathname, withLocalePrefix } from '@/lib/content-locale';

type TextCard = {
  title: string;
  items: string[];
  icon: ReactNode;
};

function PartnerSectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-7 max-w-3xl">
      <p className="mb-2 font-montserrat text-xs font-bold uppercase tracking-[0.14em] text-[#0A7029]">{eyebrow}</p>
      <h2 className="font-montserrat text-2xl font-bold tracking-tight text-[#1F2937] md:text-3xl">{title}</h2>
      <p className="mt-3 font-montserrat text-base leading-relaxed text-[#5F6876]">{description}</p>
    </div>
  );
}

function FormattedItem({ item }: { item: string }) {
  const [label, ...rest] = item.split(':');
  const detail = rest.join(':').trim();

  if (!detail) {
    return <span>{item}</span>;
  }

  return (
    <span>
      <strong className="font-semibold text-[#27313F]">{label}:</strong> {detail}
    </span>
  );
}

function PartnerGroupCard({ card }: { card: TextCard }) {
  return (
    <article className="h-full rounded-lg border border-[#E1E6DF] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
      <div className="mb-4 flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-[#FFF8E1] text-[#D49400]">
          {card.icon}
        </span>
        <h3 className="font-montserrat text-lg font-bold leading-snug text-[#1F2937] md:text-xl">{card.title}</h3>
      </div>
      <ul className="space-y-2.5 font-montserrat text-sm leading-relaxed text-[#5F6876] md:text-[15px]">
        {card.items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#0A7029]" aria-hidden="true" />
            <FormattedItem item={item} />
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function PartnersPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isEn = locale === 'en';

  const hero = {
    label: isEn ? 'Sustainable Collaboration' : 'Hợp tác bền vững',
    title: isEn ? 'Strategic Partners' : 'Đối tác chiến lược',
    kicker: isEn
      ? 'Connecting the public sector, associations, enterprises, and international programs.'
      : 'Kết nối khu vực công, hiệp hội, doanh nghiệp và các chương trình quốc tế.',
    description: isEn
      ? 'Our platform grows through long-term collaboration with domestic and international partners, combining expertise, resources, and shared commitments to improve responsible business practices in Vietnam.'
      : 'Cổng thông tin phát triển nhờ sự đồng hành dài hạn của các đối tác trong và ngoài nước, kết nối nguồn lực, chuyên môn và cam kết chung để thúc đẩy thực hành kinh doanh có trách nhiệm tại Việt Nam.',
  };

  const stateGroups: TextCard[] = [
    {
      title: isEn ? 'Central state management agencies' : 'Cơ quan quản lý nhà nước tại trung ương',
      icon: <Building2 className="h-5 w-5" />,
      items: isEn
        ? [
            'Ministry of Labour, Invalids and Social Affairs (now merged into the Ministry of Home Affairs)',
            'Ministry of Industry and Trade',
            'Vietnam General Confederation of Labour',
            'Central Committee of the Vietnam Farmers Union',
            'Other ministries and sectors...',
          ]
        : [
            'Bộ Lao động, Thương binh & Xã hội (Nay sát nhập vào Bộ Nội vụ)',
            'Bộ Công thương',
            'Tổng Liên đoàn Lao động Việt Nam',
            'Trung ương Hội Nông dân Việt Nam',
            'Các Bộ ngành khác...',
          ],
    },
    {
      title: isEn ? 'Local state management agencies' : 'Cơ quan quản lý nhà nước tại địa phương',
      icon: <Building2 className="h-5 w-5" />,
      items: isEn
        ? [
            'Provincial/municipal Departments of Labour, Invalids and Social Affairs (now Departments of Home Affairs)',
            'Provincial/municipal Departments of Industry and Trade',
            'Provincial/municipal Labour Federations',
            'Provincial/municipal Vietnam Farmers Union chapters',
            'Other local departments and sectors...',
          ]
        : [
            'Sở Lao động, Thương binh & Xã hội (Nay là Sở Nội vụ) tỉnh, thành phố',
            'Sở Công thương tỉnh, thành phố',
            'Liên đoàn Lao động Việt Nam tỉnh, thành phố',
            'Hội Nông dân Việt Nam tại tỉnh, thành phố',
            'Các Sở ngành khác...',
          ],
    },
  ];

  const supportGroups: TextCard[] = [
    {
      title: isEn ? 'Business associations and industry associations' : 'Các Hiệp hội doanh nghiệp, Hiệp hội ngành nghề',
      icon: <Factory className="h-5 w-5" />,
      items: isEn
        ? [
            'Textiles, footwear, and handbags: Vietnam Textile and Apparel Association (VITAS); Ho Chi Minh City Association of Garment, Textile, Embroidery and Knitting (AGTEK); Vietnam Leather, Footwear and Handbag Association (LEFASO);...',
            'Seafood: Vietnam Association of Seafood Exporters and Producers (VASEP), Can Tho Fisheries Association,...',
            'Wood processing: Handicraft and Wood Industry Association of Ho Chi Minh City (HAWA); Binh Duong Furniture Association (BIFA); Dong Nai Wood and Handicraft Association (DOWA); Gia Lai Forest Products Association (FPA);...',
            'Food: Vietnam Food Association (VFA); Vietnam Coffee-Cocoa Association (VICOFA); Vietnam Rubber Association (VRA); Vietnam Pepper and Spice Association (VPSA);...',
            'Other industry associations...',
          ]
        : [
            'Dệt may, da giày, túi xách: Hiệp hội Dệt may Việt Nam (VITAS); Hiệp hội Dệt may thời trang TP.HCM (AGTEK); Hiệp hội Da - Giày - Túi xách Việt Nam (LEFASO);...',
            'Thủy sản: Hiệp hội Chế biến và Xuất khẩu Thủy sản Việt Nam (VASEP), Hiệp hội thủy sản Cần Thơ,...',
            'Chế biến gỗ: Hội Mỹ nghệ và Chế biến gỗ TP.HCM (HAWA); Hiệp hội chế biến gỗ tỉnh Bình Dương (BIFA); Hiệp hội Gỗ và Thủ Công Mỹ Nghệ Đồng Nai (DOWA); Hiệp hội gỗ và lâm sản Gia Lai (FPA);...',
            'Thực phẩm: Hiệp hội Lương thực Việt Nam (VFA); Hiệp hội Cà phê, Ca cao Việt Nam (VICOFA); Hiệp hội Cao su Việt Nam (VRA); Hiệp hội Hồ tiêu và cây gia vị Việt Nam (VPSA);...',
            'Các Hiệp hội ngành nghề khác...',
          ],
    },
    {
      title: isEn ? 'International NGOs and programs' : 'Các NGO và chương trình quốc tế',
      icon: <Globe2 className="h-5 w-5" />,
      items: isEn
        ? [
            'International Labour Organization (ILO)',
            'Confederation of Norwegian Enterprise (NHO)',
            'Oxfam in Vietnam',
            'Confederation of Danish Industry (DI)',
            'Investing in Women (IW)',
            'Aus4Skills Program',
            '...',
          ]
        : [
            'Tổ chức Lao động Quốc tế (ILO)',
            'Liên đoàn Doanh nghiệp Nauy (NHO)',
            'Tổ chức Oxfam tại Việt Nam',
            'Liên đoàn Công nghiệp Đan Mạch (DI)',
            'Investing in Women (IW)',
            'Chương trình Aus4skills',
            '...',
          ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F3EA]">
      <NavigationBar />

      <main className="pt-20">
        <section className="relative overflow-hidden border-b border-[#E1E6DF] bg-white">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(232,245,233,0.65),rgba(255,255,255,0.95)_48%,rgba(255,248,225,0.5))]" aria-hidden="true" />
          <div className="container relative mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-[1.15fr_0.85fr] md:items-center md:py-16">
            <div>
              <p className="mb-4 inline-flex rounded-md bg-[#0A7029]/10 px-3 py-1 font-montserrat text-xs font-bold uppercase tracking-[0.14em] text-[#0A7029]">
                {hero.label}
              </p>
              <h1 className="font-montserrat text-4xl font-bold tracking-tight text-[#1F2937] md:text-5xl">{hero.title}</h1>
              <p className="mt-4 max-w-2xl font-montserrat text-lg font-semibold leading-relaxed text-[#334155]">{hero.kicker}</p>
              <p className="mt-4 max-w-3xl font-montserrat text-base leading-relaxed text-[#5F6876] md:text-lg">{hero.description}</p>
            </div>
            <div className="relative mx-auto h-[220px] w-full max-w-sm md:h-[280px]">
              <Image
                src="/art_members.png"
                alt="Partners illustration"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 90vw, 40vw"
                priority
              />
            </div>
          </div>
        </section>

        <section className="py-14 md:py-16">
          <div className="container mx-auto max-w-6xl px-6">
            <PartnerSectionHeader
              eyebrow={isEn ? 'Public sector' : 'Khu vực công'}
              title={isEn ? 'State management agencies' : 'Cơ quan quản lý nhà nước'}
              description={
                isEn
                  ? 'The platform connects central and local agencies that support responsible business practices and sustainable development.'
                  : 'Nền tảng kết nối các cơ quan trung ương và địa phương cùng thúc đẩy thực hành kinh doanh có trách nhiệm và phát triển bền vững.'
              }
            />
            <div className="grid gap-5 md:grid-cols-2">
              {stateGroups.map((card) => (
                <PartnerGroupCard key={card.title} card={card} />
              ))}
            </div>
          </div>
        </section>

        <section className="pb-14 md:pb-16">
          <div className="container mx-auto max-w-6xl px-6">
            <PartnerSectionHeader
              eyebrow={isEn ? 'Networks and programs' : 'Mạng lưới và chương trình'}
              title={isEn ? 'Associations and international programs' : 'Hiệp hội và chương trình hỗ trợ'}
              description={
                isEn
                  ? 'Business associations, industry associations, NGOs, and international programs bring technical expertise and practical support to enterprises.'
                  : 'Các hiệp hội doanh nghiệp, hiệp hội ngành nghề, NGO và chương trình quốc tế bổ sung chuyên môn, nguồn lực và hỗ trợ thực tiễn cho doanh nghiệp.'
              }
            />
            <div className="grid gap-5 lg:grid-cols-[1.12fr_0.88fr]">
              {supportGroups.map((card) => (
                <PartnerGroupCard key={card.title} card={card} />
              ))}
            </div>
          </div>
        </section>

        <section className="pb-16">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="flex flex-col gap-5 rounded-lg border border-[#D8E2D6] bg-white px-6 py-7 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-montserrat text-xs font-bold uppercase tracking-[0.14em] text-[#0A7029]">
                  {isEn ? 'Partnership' : 'Đối tác'}
                </p>
                <h2 className="mt-2 font-montserrat text-2xl font-bold tracking-tight text-[#1F2937]">
                  {isEn ? 'Connect with VCCI-HCM' : 'Kết nối cùng VCCI-HCM'}
                </h2>
                <p className="mt-2 max-w-2xl font-montserrat text-sm leading-relaxed text-[#5F6876] md:text-base">
                  {isEn
                    ? 'Become a partner to receive updates on programs, content, and collaboration opportunities.'
                    : 'Trở thành đối tác để được kết nối, cập nhật các chương trình, nội dung và cơ hội hợp tác.'}
                </p>
              </div>
              <Link
                href={withLocalePrefix('/join-us', locale)}
                className="inline-flex w-fit items-center justify-center rounded-md border border-[#0A7029] px-5 py-3 font-montserrat text-sm font-bold text-[#0A7029] transition hover:bg-[#0A7029] hover:text-white"
              >
                {isEn ? 'Become a partner' : 'Trở thành đối tác'}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
