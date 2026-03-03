'use client';

import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { Building2, Factory, Shirt, Zap } from 'lucide-react';

const practiceCards = [
  {
    title: 'Unilever - Kế hoạch Sống Bền vững',
    description:
      'Unilever đã cam kết giảm tác động môi trường, thúc đẩy chuỗi cung ứng bền vững và mở rộng tác động xã hội tích cực thông qua chương trình phát triển bền vững của doanh nghiệp.',
    href: 'https://www.unilever.com/planet-and-society/climate-action/',
    ariaLabel: 'Unilever - Kế hoạch Sống Bền vững',
    icon: Factory,
    iconWrapperClassName: 'bg-blue-100 text-blue-700',
    tags: ['Giảm carbon', 'Chuỗi cung ứng bền vững', 'Trách nhiệm xã hội'],
  },
  {
    title: 'Tesla - Năng lượng Tái tạo',
    description:
      'Tesla tiên phong trong việc chuyển đổi sang năng lượng sạch thông qua xe điện, pin lưu trữ và hệ sinh thái năng lượng mặt trời, qua đó thúc đẩy quá trình điện hóa ở quy mô toàn cầu.',
    href: 'https://www.tesla.com/impact',
    ariaLabel: 'Tesla - Năng lượng Tái tạo',
    icon: Zap,
    iconWrapperClassName: 'bg-green-100 text-green-700',
    tags: ['Năng lượng sạch', 'Đổi mới công nghệ', 'Net Zero'],
  },
  {
    title: 'Patagonia - Kinh tế Tuần hoàn',
    description:
      'Patagonia theo đuổi mô hình kinh tế tuần hoàn với Worn Wear, khuyến khích sửa chữa, tái sử dụng và kéo dài vòng đời sản phẩm để giảm phát thải và giảm tiêu thụ tài nguyên mới.',
    href: 'https://wornwear.patagonia.com/',
    ariaLabel: 'Patagonia - Kinh tế Tuần hoàn',
    icon: Shirt,
    iconWrapperClassName: 'bg-purple-100 text-purple-700',
    tags: ['Tái chế', 'Kinh tế tuần hoàn', 'Bảo vệ môi trường'],
  },
  {
    title: 'Microsoft - Phát thải Carbon Âm',
    description:
      'Microsoft cam kết đạt carbon âm vào năm 2030 và loại bỏ toàn bộ lượng carbon lịch sử của mình vào năm 2050, đồng thời đầu tư mạnh vào đổi mới khí hậu và công nghệ loại bỏ carbon.',
    href: 'https://blogs.microsoft.com/blog/2020/01/16/microsoft-will-be-carbon-negative-by-2030/',
    ariaLabel: 'Microsoft - Phát thải Carbon Âm',
    icon: Building2,
    iconWrapperClassName: 'bg-yellow-100 text-yellow-700',
    tags: ['Carbon âm', 'Đổi mới khí hậu', 'Cam kết dài hạn'],
  },
] as const;

export default function GlobalBestPracticePage() {
  return (
    <div className="min-h-screen">
      <div className="relative z-50">
        <NavigationBar />
      </div>

      <main className="pt-16">
        <section className="relative h-[400px] w-full md:h-[500px]">
          <Image
            src="/esg_hero.jpg"
            alt="Global Best Practices Hero Banner"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </section>

        <section id="global-practices" className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
          <div className="container mx-auto max-w-6xl px-6">
            <h2 className="mb-8 font-montserrat text-3xl font-bold text-gray-800 md:text-4xl">
              Thực hành tốt trên thế giới
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {practiceCards.map((card) => {
                const Icon = card.icon;

                return (
                  <a
                    key={card.title}
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-xl"
                    aria-label={card.ariaLabel}
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${card.iconWrapperClassName}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-montserrat text-xl font-bold text-gray-800">
                        {card.title}
                      </h3>
                    </div>
                    <p className="mb-4 font-montserrat leading-relaxed text-gray-700">
                      {card.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {card.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
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
