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
    label: isEn ? 'Sustainable Collaboration' : 'H?p tác b?n v?ng',
    title: isEn ? 'Strategic Partners' : 'Ð?i tác chi?n lu?c',
    description: isEn
      ? 'Our platform grows through long-term collaboration with domestic and international partners, combining expertise, resources, and shared commitments to improve responsible business practices in Vietnam.'
      : 'C?ng thông tin phát tri?n nh? s? d?ng hành dài h?n c?a các d?i tác trong và ngoài nu?c, k?t n?i ngu?n l?c, chuyên môn và cam k?t chung d? thúc d?y th?c hành kinh doanh có trách nhi?m t?i Vi?t Nam.',
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
          title: 'Co quan qu?n lý và t? ch?c',
          items: ['B? Lao d?ng (nay thu?c B? N?i v?)', 'T?ng Liên doàn Lao d?ng Vi?t Nam', 'H?i Nông dân Vi?t Nam'],
        },
        {
          title: 'Ð?i tác NGO qu?c t?',
          items: ['Oxfam', 'ILO (T? ch?c Lao d?ng Qu?c t?)', 'DI (Development International)', 'NHO'],
        },
        {
          title: 'Hi?p h?i ngành ngh? trong nu?c',
          items: [
            'VASEP, VFA và các hi?p h?i th?y s?n t?i C?n Tho, An Giang, Cà Mau, Sóc Trang',
            'HAWA, BIFA, DOWA',
            'CSID, VITAS',
          ],
        },
        {
          title: 'M?ng lu?i d?i tác nòng c?t',
          items: ['VCCI, Oxfam, DGD, H?i Nông dân Vi?t Nam, VASEP, VFA và các hi?p h?i d?a phuong'],
        },
      ];

  const oxfamCards: LinkCard[] = isEn
    ? [
        {
          title: 'GRAISEA Project',
          description: 'Gender-transformative and responsible agricultural investment in Southeast Asia.',
          note: '? Supporting business capacity building in shrimp and rice value chains.',
          href: 'https://graisea.github.io/',
        },
        {
          title: 'Right To Food Project',
          description:
            'Promoting private-sector cooperation to develop inclusive business and responsible investment in Vietnam’s rice value chain.',
          note: '? Supporting businesses in the rice value chain.',
          href: 'https://policy-practice.oxfam.org/resources/a-common-sense-approach-to-the-right-to-food-558742/',
        },
        {
          title: 'DGD Project',
          description:
            'Improving international market access for shrimp and rice enterprises through better workplace skills and occupational safety.',
          note: '? Supporting enterprises in shrimp and rice processing value chains.',
          href: 'https://vietnam.oxfam.org/kick-project-component-supporting-female-farmers-and-informal-workers',
        },
      ]
    : [
        {
          title: 'D? án GRAISEA',
          description: 'Tang cu?ng bình d?ng gi?i và d?u tu kinh doanh nông nghi?p có trách nhi?m t?i Ðông Nam Á.',
          note: '? H? tr? nâng cao nang l?c doanh nghi?p trong chu?i ch? bi?n tôm và lúa g?o.',
          href: 'https://graisea.github.io/',
        },
        {
          title: 'D? án Right To Food',
          description:
            'Thúc d?y h?p tác khu v?c tu nhân nh?m phát tri?n mô hình kinh doanh toàn di?n và d?u tu có trách nhi?m trong chu?i giá tr? lúa g?o t?i Vi?t Nam.',
          note: '? H? tr? doanh nghi?p trong chu?i lúa g?o.',
          href: 'https://policy-practice.oxfam.org/resources/a-common-sense-approach-to-the-right-to-food-558742/',
        },
        {
          title: 'D? án DGD',
          description:
            'C?i thi?n kh? nang ti?p c?n th? tru?ng qu?c t? c?a doanh nghi?p tôm và lúa thông qua nâng cao k? nang làm vi?c và an toàn v? sinh lao d?ng.',
          note: '? H? tr? doanh nghi?p trong chu?i ch? bi?n tôm và lúa g?o.',
          href: 'https://vietnam.oxfam.org/kick-project-component-supporting-female-farmers-and-informal-workers',
        },
      ];

  const iloCards: LinkCard[] = isEn
    ? [
        {
          title: 'SCORE Project',
          description: 'Sustainable enterprise development project.',
          note: '? Supporting competitiveness in wood processing, textiles, and supporting industries.',
          href: 'https://www.ilo.org/projects-and-partnerships/projects/sustaining-competitive-and-responsible-enterprises-score',
        },
        {
          title: 'PE4DW Project',
          description: 'Productivity ecosystems for decent work project.',
          note: '? Supporting productivity and sustainability standards for supporting-industry enterprises.',
          href: 'https://www.ilo.org/projects-and-partnerships/projects/productivity-ecosystems-decent-work',
        },
        {
          title: 'RSCA Project',
          description: 'Social responsibility in Asian supply chains project.',
          note: '? Building capacity for seafood enterprises in social responsibility and sustainability practices.',
          href: 'https://www.ilo.org/projects-and-partnerships/projects/responsible-supply-chains-asia',
        },
      ]
    : [
        {
          title: 'D? án SCORE',
          description: 'D? án phát tri?n doanh nghi?p b?n v?ng.',
          note: '? H? tr? nâng cao nang l?c c?nh tranh cho doanh nghi?p ngành ch? bi?n g?, d?t may và công nghi?p h? tr?.',
          href: 'https://www.ilo.org/projects-and-partnerships/projects/sustaining-competitive-and-responsible-enterprises-score',
        },
        {
          title: 'D? án PE4DW',
          description: 'D? án H? sinh thái nang su?t vì vi?c làm b?n v?ng.',
          note: '? H? tr? nâng cao nang su?t và tiêu chu?n b?n v?ng cho doanh nghi?p ngành công nghi?p h? tr?.',
          href: 'https://www.ilo.org/projects-and-partnerships/projects/productivity-ecosystems-decent-work',
        },
        {
          title: 'D? án RSCA',
          description: 'D? án Trách nhi?m xã h?i trong chu?i cung ?ng t?i châu Á.',
          note: '? H? tr? nâng cao nang l?c cho doanh nghi?p th?y s?n v? th?c hành trách nhi?m xã h?i và b?n v?ng.',
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
              <Image src="/art_members.png" alt="Partners illustration" fill className="object-contain" sizes="(max-width: 768px) 90vw, 40vw" priority />
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
                    {isEn ? 'Projects with Oxfam' : 'D? án cùng Oxfam'}
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
                    {isEn ? 'Projects with ILO' : 'D? án cùng ILO'}
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

