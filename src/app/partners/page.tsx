'use client';

import Image from 'next/image';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
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
      <h3 className="mb-3 font-montserrat text-xl font-bold text-[#1F2937]">{card.title}</h3>
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
          title: 'Government and institutions',
          items: [
            'Ministry of Labour (now under Ministry of Home Affairs)',
            'Vietnam General Confederation of Labour',
            'Vietnam Farmers Union',
          ],
        },
        {
          title: 'International NGO partners',
          items: ['Oxfam', 'ILO (International Labour Organization)', 'DI (Development International)', 'NHO'],
        },
        {
          title: 'Domestic industry associations',
          items: [
            'VASEP, VFA, and fisheries associations in Can Tho, An Giang, Ca Mau, Soc Trang',
            'HAWA, BIFA, DOWA',
            'CSID, VITAS',
          ],
        },
        {
          title: 'Core partner network',
          items: ['VCCI, Oxfam, DGD, Vietnam Farmers Union, VASEP, VFA, and local associations'],
        },
      ]
    : [
        {
          title: 'Cơ quan quản lý và tổ chức',
          items: ['Bộ Lao động (nay thuộc Bộ Nội vụ)', 'Tổng Liên đoàn Lao động Việt Nam', 'Hội Nông dân Việt Nam'],
        },
        {
          title: 'Đối tác NGO quốc tế',
          items: ['Oxfam', 'ILO (Tổ chức Lao động Quốc tế)', 'DI (Development International)', 'NHO'],
        },
        {
          title: 'Hiệp hội ngành nghề trong nước',
          items: [
            'VASEP, VFA và các hiệp hội thủy sản tại Cần Thơ, An Giang, Cà Mau, Sóc Trăng',
            'HAWA, BIFA, DOWA',
            'CSID, VITAS',
          ],
        },
        {
          title: 'Mạng lưới đối tác nòng cốt',
          items: ['VCCI, Oxfam, DGD, Hội Nông dân Việt Nam, VASEP, VFA và các hiệp hội địa phương'],
        },
      ];

  const oxfamCards: LinkCard[] = isEn
    ? [
        {
          title: 'GRAISEA Project',
          description: 'Gender-transformative and responsible agricultural investment in Southeast Asia.',
          note: '-> Supporting business capacity building in shrimp and rice value chains.',
          href: 'https://graisea.github.io/',
        },
        {
          title: 'Right To Food Project',
          description:
            'Promoting private-sector cooperation to develop inclusive business and responsible investment in Vietnam’s rice value chain.',
          note: '-> Supporting businesses in the rice value chain.',
          href: 'https://policy-practice.oxfam.org/resources/a-common-sense-approach-to-the-right-to-food-558742/',
        },
        {
          title: 'DGD Project',
          description:
            'Improving international market access for shrimp and rice enterprises through better workplace skills and occupational safety.',
          note: '-> Supporting enterprises in shrimp and rice processing value chains.',
          href: 'https://vietnam.oxfam.org/kick-project-component-supporting-female-farmers-and-informal-workers',
        },
      ]
    : [
        {
          title: 'Dự án GRAISEA',
          description: 'Tăng cường bình đẳng giới và đầu tư kinh doanh nông nghiệp có trách nhiệm tại Đông Nam Á.',
          note: '-> Hỗ trợ nâng cao năng lực doanh nghiệp trong chuỗi chế biến tôm và lúa gạo.',
          href: 'https://graisea.github.io/',
        },
        {
          title: 'Dự án Right To Food',
          description:
            'Thúc đẩy hợp tác khu vực tư nhân nhằm phát triển mô hình kinh doanh toàn diện và đầu tư có trách nhiệm trong chuỗi giá trị lúa gạo tại Việt Nam.',
          note: '-> Hỗ trợ doanh nghiệp trong chuỗi lúa gạo.',
          href: 'https://policy-practice.oxfam.org/resources/a-common-sense-approach-to-the-right-to-food-558742/',
        },
        {
          title: 'Dự án DGD',
          description:
            'Cải thiện khả năng tiếp cận thị trường quốc tế của doanh nghiệp tôm và lúa thông qua nâng cao kỹ năng làm việc và an toàn vệ sinh lao động.',
          note: '-> Hỗ trợ doanh nghiệp trong chuỗi chế biến tôm và lúa gạo.',
          href: 'https://vietnam.oxfam.org/kick-project-component-supporting-female-farmers-and-informal-workers',
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
              <h1 className="font-montserrat text-4xl font-black tracking-tight text-[#1F2937] md:text-5xl">
                {hero.title}
              </h1>
              <p className="mt-5 max-w-3xl font-montserrat text-base leading-relaxed text-[#4B5563] md:text-lg">
                {hero.description}
              </p>
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

        <section className="pb-8">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
              <div className="mb-8 grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
                <div className="relative mx-auto h-28 w-44 md:h-32 md:w-48">
                  <Image src="/OX_HL_C_RGB.png" alt="Oxfam Logo" fill className="object-contain" sizes="220px" />
                </div>
                <div>
                  <h2 className="font-montserrat text-3xl font-bold text-[#1F2937]">
                    {isEn ? 'Projects with Oxfam' : 'Dự án cùng Oxfam'}
                  </h2>
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-3">
                {oxfamCards.map((card) => (
                  <ProjectLinkCard key={card.title} card={card} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="pb-16">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
              <div className="mb-8 grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
                <div className="relative mx-auto h-24 w-36 md:h-28 md:w-44">
                  <Image src="/ILOlogo.png" alt="ILO Logo" fill className="object-contain" sizes="200px" />
                </div>
                <div>
                  <h2 className="font-montserrat text-3xl font-bold text-[#1F2937]">
                    {isEn ? 'Projects with ILO' : 'Dự án cùng ILO'}
                  </h2>
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
