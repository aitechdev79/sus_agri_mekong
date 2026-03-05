'use client';

import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { Factory, Fish, MapPin, Sprout, Tag, Zap } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { getLocaleFromPathname } from '@/lib/content-locale';

export default function VNBestPracticePage() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isEn = locale === 'en';

  const practices = [
    {
      id: 'ca-mau',
      title: isEn ? 'Ca Mau Shrimp-Forest Model' : 'Mô hình Tôm - Rừng Cà Mau',
      description:
        isEn
          ? 'Integrated shrimp farming with mangrove conservation in Ca Mau is scaling under ASC standards, increasing product value while protecting coastal ecosystems.'
          : 'Mô hình nuôi tôm kết hợp bảo vệ rừng ngập mặn tại Cà Mau đang được mở rộng theo chuẩn ASC, giúp tăng giá trị sản phẩm đồng thời bảo tồn hệ sinh thái rừng ven biển.',
      metaLabel: isEn ? 'Location' : 'Địa điểm',
      metaValue: isEn ? 'Ca Mau, Mekong Delta' : 'Cà Mau, Đồng bằng sông Cửu Long',
      metaIcon: MapPin,
      icon: Fish,
      accent: 'emerald',
      href: 'https://seafood.vasep.com.vn/key-seafood-sectors/shrimp/news/ca-mau-accelerates-shrimp-farming-certification-to-enhance-export-value-34157.html',
    },
    {
      id: 'an-giang',
      title: isEn ? 'An Giang Organic Rice' : 'Lúa Hữu cơ An Giang',
      description:
        isEn
          ? 'An Giang is scaling rice models under SRP, VietGAP, and organic standards to reduce input costs and meet sustainable export requirements.'
          : 'An Giang đang mở rộng các mô hình lúa theo chuẩn SRP, VietGAP và hữu cơ để giảm chi phí đầu vào, tăng chất lượng gạo và đáp ứng tốt hơn các yêu cầu xuất khẩu bền vững.',
      metaLabel: isEn ? 'Location' : 'Địa điểm',
      metaValue: isEn ? 'An Giang, Mekong Delta' : 'An Giang, Đồng bằng sông Cửu Long',
      metaIcon: MapPin,
      icon: Sprout,
      accent: 'sky',
      href: 'https://van.nongnghiepmoitruong.vn/srp-cultivation-path-forward-amid-climate-change-in-an-giang-d791084.html',
    },
    {
      id: 'vinamilk',
      title: isEn ? 'Vinamilk - Green Dairy Farm' : 'Vinamilk - Trang trại Bò sữa Xanh',
      description:
        isEn
          ? 'Vinamilk develops its Green Farm system and Dairy Net Zero 2050 roadmap, combining regenerative agriculture, renewable energy, and carbon-neutral standards.'
          : 'Vinamilk phát triển hệ thống Green Farm và lộ trình Dairy Net Zero 2050, kết hợp nông nghiệp tái tạo, năng lượng tái tạo và chuẩn carbon trung hòa trong chăn nuôi bò sữa.',
      metaLabel: isEn ? 'Sector' : 'Lĩnh vực',
      metaValue: isEn ? 'Food processing, High-tech agriculture' : 'Chế biến thực phẩm, Nông nghiệp công nghệ cao',
      metaIcon: Tag,
      icon: Factory,
      accent: 'violet',
      href: 'https://www.vinamilk.com.vn/en/sustainability/planet',
    },
    {
      id: 'trung-nam',
      title: isEn ? 'Trung Nam Group - Renewable Energy' : 'Trung Nam Group - Năng lượng Tái tạo',
      description:
        isEn
          ? 'Trung Nam Group is among Vietnam’s pioneers in large-scale solar and wind projects, contributing to clean energy transition.'
          : 'Trung Nam Group là một trong những đơn vị tiên phong phát triển các dự án điện mặt trời và điện gió quy mô lớn tại Việt Nam, góp phần thúc đẩy chuyển dịch năng lượng sạch.',
      metaLabel: isEn ? 'Sector' : 'Lĩnh vực',
      metaValue: isEn ? 'Renewable energy, Solar, Wind' : 'Năng lượng tái tạo, Điện mặt trời, Điện gió',
      metaIcon: Tag,
      icon: Zap,
      accent: 'amber',
      href: 'https://trungnamgroup.com.vn/en-US/trungnam-is-committed-to-assisting-in-the-development-of-sustainable-energy-sources',
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="relative z-50">
        <NavigationBar />
      </div>

      <main className="pt-16">
        <section className="relative h-[420px] w-full md:h-[520px]">
          <Image
            src="/esg_hero.jpg"
            alt="Vietnam Best Practices Hero Banner"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto max-w-6xl px-6 pb-12">
              <p className="mb-4 font-montserrat text-sm uppercase tracking-[0.2em] text-white/70">
                Vietnam Best Practices
              </p>
              <h1 className="mb-4 font-montserrat text-3xl font-bold text-white md:text-5xl">
                {isEn ? 'Good Practices in Vietnam' : 'Thực hành tốt tại Việt Nam'}
              </h1>
              <p className="max-w-3xl font-montserrat text-base text-white/80 md:text-lg">
                {isEn
                  ? 'A collection of notable models on sustainability, green innovation, and social responsibility from businesses and communities in Vietnam.'
                  : 'Tập hợp những mô hình điển hình về phát triển bền vững, đổi mới xanh và trách nhiệm xã hội từ các doanh nghiệp, hợp tác xã và cộng đồng tại Việt Nam.'}
              </p>
            </div>
          </div>
        </section>

        <section id="vietnam-practices" className="bg-[#F8F7F2] py-16">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="mb-10">
              <h2 className="mb-3 font-montserrat text-3xl font-bold text-gray-900 md:text-4xl">
                {isEn ? 'Featured Models' : 'Những mô hình tiêu biểu'}
              </h2>
              <p className="max-w-3xl font-montserrat text-gray-600">
                {isEn
                  ? 'These examples show how Vietnamese businesses and communities turn sustainability goals into real-world impact, from regenerative agriculture to renewable energy.'
                  : 'Các mô hình dưới đây thể hiện cách doanh nghiệp và cộng đồng Việt Nam chuyển hóa các mục tiêu phát triển bền vững thành tác động thực tế, từ nông nghiệp sinh thái đến năng lượng tái tạo.'}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {practices.map((practice) => {
                const Icon = practice.icon;
                const MetaIcon = practice.metaIcon;
                const accentClasses: Record<string, string> = {
                  emerald: 'border-emerald-200 bg-emerald-100 text-emerald-700',
                  sky: 'border-sky-200 bg-sky-100 text-sky-700',
                  violet: 'border-violet-200 bg-violet-100 text-violet-700',
                  amber: 'border-amber-200 bg-amber-100 text-amber-700',
                };

                return (
                  <a
                    key={practice.id}
                    href={practice.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg"
                    aria-label={practice.title}
                  >
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${accentClasses[practice.accent]}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex items-center gap-2 font-montserrat text-xs uppercase tracking-wide text-gray-500">
                        <MetaIcon className="h-4 w-4" />
                        {practice.metaLabel}
                      </div>
                    </div>
                    <h3 className="mb-3 font-montserrat text-xl font-bold text-gray-900">
                      {practice.title}
                    </h3>
                    <p className="mb-5 font-montserrat leading-relaxed text-gray-600">
                      {practice.description}
                    </p>
                    <div className="flex items-center gap-2 font-montserrat text-sm text-gray-600">
                      <span className="font-semibold">{practice.metaLabel}:</span>
                      <span>{practice.metaValue}</span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
