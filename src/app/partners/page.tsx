'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { Building2, Factory, Globe2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { getLocaleFromPathname } from '@/lib/content-locale';

type LinkCard = {
  title: string;
  description: string;
  note: string;
  href: string;
};

type TextCard = {
  title: string;
  items: string[];
  icon: ReactNode;
};

function ProjectLinkCard({ card }: { card: LinkCard }) {
  return (
    <a
      href={card.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block flex h-full w-full flex-col border bg-white p-5"
      style={{ borderColor: '#FFB81C' }}
    >
      <div className="relative flex min-h-[170px] flex-1 flex-col pb-4">
        <div className="absolute bottom-0 left-0 h-0.5 w-full" style={{ backgroundColor: '#E8F5E9' }}></div>
        <div
          className="absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-500 ease-out group-hover:w-full"
          style={{ backgroundColor: '#0A7029' }}
        ></div>

        <h3 className="mb-2 font-montserrat text-lg font-bold md:text-xl" style={{ color: '#3C3C3B' }}>
          {card.title}
        </h3>
        <p className="mb-2 font-montserrat text-sm md:text-base" style={{ color: '#6B7280' }}>
          {card.description}
        </p>
        <p className="font-montserrat text-sm italic" style={{ color: '#6B7280' }}>
          {card.note}
        </p>
      </div>
    </a>
  );
}

function PartnerGroupCard({ card }: { card: TextCard }) {
  return (
    <article className="rounded-2xl bg-white/90 p-6 shadow-sm ring-1 ring-[#E8F5E9] backdrop-blur">
      <div className="mb-3 flex items-center gap-3">
        <span className="inline-flex items-center justify-center text-[#FFB81C]">{card.icon}</span>
        <h3 className="font-montserrat text-xl font-bold text-[#1F2937]">{card.title}</h3>
      </div>
      <ul className="space-y-2 font-montserrat text-sm leading-relaxed text-[#4B5563] md:text-base">
        {card.items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#0A7029]" aria-hidden="true" />
            <span>{item}</span>
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
    description: isEn
      ? 'Our platform grows through long-term collaboration with domestic and international partners, combining expertise, resources, and shared commitments to improve responsible business practices in Vietnam.'
      : 'Cổng thông tin phát triển nhờ sự đồng hành dài hạn của các đối tác trong và ngoài nước, kết nối nguồn lực, chuyên môn và cam kết chung để thúc đẩy thực hành kinh doanh có trách nhiệm tại Việt Nam.',
  };

  const partnerGroups: TextCard[] = isEn
    ? [
        {
          title: 'Central state management agencies',
          icon: <Building2 className="h-6 w-6" />,
          items: [
            'Ministry of Labour, Invalids and Social Affairs (now merged into the Ministry of Home Affairs)',
            'Ministry of Industry and Trade',
            'Vietnam General Confederation of Labour',
            'Central Committee of the Vietnam Farmers Union',
            'Other ministries and sectors...',
          ],
        },
        {
          title: 'Local state management agencies',
          icon: <Building2 className="h-6 w-6" />,
          items: [
            'Provincial/municipal Departments of Labour, Invalids and Social Affairs (now Departments of Home Affairs)',
            'Provincial/municipal Departments of Industry and Trade',
            'Provincial/municipal Labour Federations',
            'Provincial/municipal Vietnam Farmers Union chapters',
            'Other local departments and sectors...',
          ],
        },
        {
          title: 'Business associations and industry associations',
          icon: <Factory className="h-6 w-6" />,
          items: [
            'Textiles, footwear, and handbags: Vietnam Textile and Apparel Association (VITAS); Ho Chi Minh City Association of Garment, Textile, Embroidery and Knitting (AGTEK); Vietnam Leather, Footwear and Handbag Association (LEFASO);...',
            'Seafood: Vietnam Association of Seafood Exporters and Producers (VASEP), Can Tho Fisheries Association,...',
            'Wood processing: Handicraft and Wood Industry Association of Ho Chi Minh City (HAWA); Binh Duong Furniture Association (BIFA); Dong Nai Wood and Handicraft Association (DOWA); Gia Lai Forest Products Association (FPA);...',
            'Food: Vietnam Food Association (VFA); Vietnam Coffee-Cocoa Association (VICOFA); Vietnam Rubber Association (VRA); Vietnam Pepper and Spice Association (VPSA);...',
            'Other industry associations...',
          ],
        },
        {
          title: 'International NGOs and programs',
          icon: <Globe2 className="h-6 w-6" />,
          items: [
            'International Labour Organization (ILO)',
            'Confederation of Norwegian Enterprise (NHO)',
            'Oxfam in Vietnam',
            'Confederation of Danish Industry (DI)',
            'Investing in Women (IW)',
            'Aus4Skills Program',
            '...',
          ],
        },
      ]
    : [
        {
          title: 'Cơ quan quản lý nhà nước tại Trung ương',
          icon: <Building2 className="h-6 w-6" />,
          items: [
            'Bộ Lao động, Thương binh & Xã hội (Nay sát nhập vào Bộ Nội vụ)',
            'Bộ Công thương',
            'Tổng Liên đoàn Lao động Việt Nam',
            'Trung ương Hội Nông dân Việt Nam',
            'Các Bộ ngành khác...',
          ],
        },
        {
          title: 'Cơ quan quản lý Nhà nước tại địa phương',
          icon: <Building2 className="h-6 w-6" />,
          items: [
            'Sở Lao động, Thương binh & Xã hội (Nay là Sở Nội vụ) tỉnh, thành phố',
            'Sở Công thương tỉnh, thành phố',
            'Liên đoàn Lao động Việt Nam tỉnh, thành phố',
            'Hội Nông dân Việt Nam tại tỉnh, thành phố',
            'Các Sở ngành khác...',
          ],
        },
        {
          title: 'Các Hiệp hội doanh nghiệp, Hiệp hội ngành nghề',
          icon: <Factory className="h-6 w-6" />,
          items: [
            'Dệt may, da giày, túi xách: Hiệp hội Dệt may Việt Nam (VITAS); Hiệp hội Dệt may thời trang TP.HCM (AGTEK); Hiệp hội Da - Giày - Túi xách Việt Nam (LEFASO);...',
            'Thủy sản: Hiệp hội Chế biến và Xuất khẩu Thủy sản Việt Nam (VASEP), Hiệp hội thủy sản Cần Thơ,...',
            'Chế biến gỗ: Hội Mỹ nghệ và Chế biến gỗ TP.HCM (HAWA); Hiệp hội chế biến gỗ tỉnh Bình Dương (BIFA); Hiệp hội Gỗ và Thủ Công Mỹ Nghệ Đồng Nai (DOWA); Hiệp hội gỗ và lâm sản Gia Lai (FPA);...',
            'Thực phẩm: Hiệp hội Lương thực Việt Nam (VFA); Hiệp hội Cà phê, Ca cao Việt Nam (VICOFA); Hiệp hội Cao su Việt Nam (VRA); Hiệp hội Hồ tiêu và cây gia vị Việt Nam (VPSA);...',
            'Các Hiệp hội ngành nghề khác...',
          ],
        },
        {
          title: 'Các NGO và chương trình quốc tế',
          icon: <Globe2 className="h-6 w-6" />,
          items: [
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

  const iloCards: LinkCard[] = isEn
    ? [
        {
          title: 'SCORE Project',
          description: 'Sustainable enterprise development project.',
          note: '-> Supporting competitiveness in wood processing, textiles, and supporting industries.',
          href: 'https://www.ilo.org/projects-and-partnerships/projects/sustaining-competitive-and-responsible-enterprises-score',
        },
        {
          title: 'PE4DW Project',
          description: 'Productivity ecosystems for decent work project.',
          note: '-> Supporting productivity and sustainability standards for supporting-industry enterprises.',
          href: 'https://www.ilo.org/projects-and-partnerships/projects/productivity-ecosystems-decent-work',
        },
        {
          title: 'RSCA Project',
          description: 'Social responsibility in Asian supply chains project.',
          note: '-> Building capacity for seafood enterprises in social responsibility and sustainability practices.',
          href: 'https://www.ilo.org/projects-and-partnerships/projects/responsible-supply-chains-asia',
        },
      ]
    : [
        {
          title: 'Dự án SCORE',
          description: 'Dự án phát triển doanh nghiệp bền vững.',
          note: '-> Hỗ trợ nâng cao năng lực cạnh tranh cho doanh nghiệp ngành chế biến gỗ, dệt may và công nghiệp hỗ trợ.',
          href: 'https://www.ilo.org/projects-and-partnerships/projects/sustaining-competitive-and-responsible-enterprises-score',
        },
        {
          title: 'Dự án PE4DW',
          description: 'Dự án Hệ sinh thái năng suất vì việc làm bền vững.',
          note: '-> Hỗ trợ nâng cao năng suất và tiêu chuẩn bền vững cho doanh nghiệp ngành công nghiệp hỗ trợ.',
          href: 'https://www.ilo.org/projects-and-partnerships/projects/productivity-ecosystems-decent-work',
        },
        {
          title: 'Dự án RSCA',
          description: 'Dự án Trách nhiệm xã hội trong chuỗi cung ứng tại châu Á.',
          note: '-> Hỗ trợ nâng cao năng lực cho doanh nghiệp thủy sản về thực hành trách nhiệm xã hội và bền vững.',
          href: 'https://www.ilo.org/projects-and-partnerships/projects/responsible-supply-chains-asia',
        },
      ];

  return (
    <div className="min-h-screen bg-[#F6F3EA]">
      <NavigationBar />

      <main className="pt-20">
        <section className="relative overflow-hidden bg-white">
          <div className="absolute inset-0 bg-gradient-to-br from-[#EAF7EF] via-white to-[#FFF7E0]" aria-hidden="true" />
          <div className="container relative mx-auto grid max-w-6xl gap-8 px-6 py-14 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-20">
            <div>
              <p className="mb-4 inline-flex rounded-full bg-[#0A7029]/10 px-4 py-1 font-montserrat text-xs font-bold uppercase tracking-[0.14em] text-[#0A7029]">
                {hero.label}
              </p>
              <h1 className="font-montserrat text-4xl font-black tracking-tight text-[#1F2937] md:text-5xl">{hero.title}</h1>
              <p className="mt-5 max-w-3xl font-montserrat text-base leading-relaxed text-[#4B5563] md:text-lg">{hero.description}</p>
            </div>
            <div className="relative mx-auto h-[260px] w-full max-w-md md:h-[320px]">
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

        <section className="py-14">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="grid gap-5 md:grid-cols-2">
              {partnerGroups.map((card) => (
                <PartnerGroupCard key={card.title} card={card} />
              ))}
            </div>
          </div>
        </section>

        <section className="pb-16">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
              <div className="mb-8 flex justify-center">
                <div className="relative mx-auto h-24 w-36 md:h-28 md:w-44">
                  <Image src="/ILOlogo.png" alt="ILO Logo" fill className="object-contain" sizes="200px" />
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-3">
                {iloCards.map((card) => (
                  <ProjectLinkCard key={card.title} card={card} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
