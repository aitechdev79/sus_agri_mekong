'use client';

import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { Factory, Fish, MapPin, Sprout, Tag, Zap } from 'lucide-react';

export default function VNBestPracticePage() {
  const practices = [
    {
      id: 'ca-mau',
      title: 'Mô hình Tôm - Rừng Cà Mau',
      description:
        'Mô hình nuôi tôm kết hợp bảo vệ rừng ngập mặn tại Cà Mau đạt chứng nhận ASC, giúp người dân tăng thu nhập 40% trong khi vẫn bảo tồn hệ sinh thái rừng ngập mặn.',
      metaLabel: 'Địa điểm',
      metaValue: 'Cà Mau, Đồng bằng sông Cửu Long',
      metaIcon: MapPin,
      icon: Fish,
      accent: 'emerald',
      href: '/tomcamau',
    },
    {
      id: 'an-giang',
      title: 'Lúa Hữu cơ An Giang',
      description:
        'HTX nông nghiệp An Giang áp dụng sản xuất lúa hữu cơ theo tiêu chuẩn VietGAP và SRP, giảm 60% lượng phân bón hóa học, nước tưới tiết kiệm 30%. Sản phẩm gạo ST25 xuất khẩu sang thị trường EU với giá cao gấp 3 lần gạo thường.',
      metaLabel: 'Địa điểm',
      metaValue: 'An Giang, Đồng bằng sông Cửu Long',
      metaIcon: MapPin,
      icon: Sprout,
      accent: 'sky',
    },
    {
      id: 'vinamilk',
      title: 'Vinamilk - Trang trại Bò sữa Xanh',
      description:
        'Vinamilk xây dựng trang trại bò sữa Organic đạt tiêu chuẩn quốc tế, áp dụng công nghệ xử lý chất thải hiện đại, tận dụng biogas để phát điện. Công ty cam kết đạt Net Zero vào năm 2050 và liên tục công bố báo cáo phát triển bền vững hàng năm.',
      metaLabel: 'Lĩnh vực',
      metaValue: 'Chế biến thực phẩm, Nông nghiệp công nghệ cao',
      metaIcon: Tag,
      icon: Factory,
      accent: 'violet',
    },
    {
      id: 'trung-nam',
      title: 'Trung Nam Group - Năng lượng Tái tạo',
      description:
        'Tập đoàn Trung Nam phát triển hơn 2,000 MW điện mặt trời và điện gió, góp phần giảm 3 triệu tấn CO2 mỗi năm. Công ty tiên phong trong chuyển đổi năng lượng sạch tại Việt Nam và đạt nhiều chứng nhận quốc tế về ESG.',
      metaLabel: 'Lĩnh vực',
      metaValue: 'Năng lượng tái tạo, Điện mặt trời, Điện gió',
      metaIcon: Tag,
      icon: Zap,
      accent: 'amber',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <div className="relative z-50">
        <NavigationBar />
      </div>

      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section - Full Width Banner */}
        <section className="relative w-full h-[420px] md:h-[520px]">
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
            <div className="container mx-auto px-6 max-w-6xl pb-12">
              <p className="text-sm uppercase tracking-[0.2em] text-white/70 font-montserrat mb-4">
                Vietnam Best Practices
              </p>
              <h1 className="text-3xl md:text-5xl font-bold text-white font-montserrat mb-4">
                Thực hành tốt tại Việt Nam
              </h1>
              <p className="text-base md:text-lg text-white/80 font-montserrat max-w-3xl">
                Tập hợp những mô hình điển hình về phát triển bền vững, đổi mới xanh và trách nhiệm xã hội từ các
                doanh nghiệp, hợp tác xã và cộng đồng tại Việt Nam.
              </p>
            </div>
          </div>
        </section>

        {/* Vietnam Best Practices */}
        <section id="vietnam-practices" className="py-16 bg-[#F8F7F2]">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="mb-10">
              <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-gray-900 mb-3">
                Những mô hình tiêu biểu
              </h2>
              <p className="font-montserrat text-gray-600 max-w-3xl">
                Các mô hình dưới đây thể hiện cách doanh nghiệp và cộng đồng Việt Nam chuyển hóa các mục tiêu
                phát triển bền vững thành tác động thực tế, từ nông nghiệp sinh thái đến năng lượng tái tạo.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {practices.map((practice) => {
                const Icon = practice.icon;
                const MetaIcon = practice.metaIcon;
                const accentClasses: Record<string, string> = {
                  emerald: 'text-emerald-700 bg-emerald-100 border-emerald-200',
                  sky: 'text-sky-700 bg-sky-100 border-sky-200',
                  violet: 'text-violet-700 bg-violet-100 border-violet-200',
                  amber: 'text-amber-700 bg-amber-100 border-amber-200',
                };
                const content = (
                  <>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${accentClasses[practice.accent]}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-montserrat uppercase tracking-wide">
                        <MetaIcon className="w-4 h-4" />
                        {practice.metaLabel}
                      </div>
                    </div>
                    <h3 className="font-montserrat font-bold text-xl text-gray-900 mb-3">
                      {practice.title}
                    </h3>
                    <p className="text-gray-600 font-montserrat leading-relaxed mb-5">
                      {practice.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-montserrat">
                      <span className="font-semibold">{practice.metaLabel}:</span>
                      <span>{practice.metaValue}</span>
                    </div>
                  </>
                );

                if (practice.href) {
                  return (
                    <Link
                      key={practice.id}
                      href={practice.href}
                      className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 block"
                      aria-label={practice.title}
                    >
                      {content}
                    </Link>
                  );
                }

                return (
                  <div
                    key={practice.id}
                    className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    {content}
                  </div>
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
