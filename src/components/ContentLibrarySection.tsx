'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BarChart3, FileText, Globe2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { getLocaleFromPathname, withLocalePrefix } from '@/lib/content-locale';

export default function ContentLibrarySection() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isEn = locale === 'en';

  const contentCards = [
    {
      id: 'policy',
      title: isEn ? 'Policies & Regulations' : 'Chính sách và quy định',
      description: isEn
        ? 'Latest legal updates, regulations, and compliance references for businesses'
        : 'Cập nhật các chính sách, quy định và văn bản pháp luật liên quan đến doanh nghiệp',
      href: withLocalePrefix('/policy', locale),
      icon: '📋',
      bgColor: 'vn-green-light',
      iconColor: 'vn-green',
      hoverBg: 'vn-green',
    },
    {
      id: 'reports',
      title: isEn ? 'Research & Reports' : 'Nghiên cứu và Báo cáo',
      description: isEn
        ? 'Explore in-depth reports and research on sustainable development'
        : 'Khám phá các nghiên cứu, báo cáo và phân tích chuyên sâu về phát triển bền vững',
      href: withLocalePrefix('/reports', locale),
      icon: '📊',
      bgColor: 'vn-gold-light',
      iconColor: 'vn-gold',
      hoverBg: 'vn-gold',
    },
    {
      id: 'global-practices',
      title: isEn ? 'Global Good Practices' : 'Thực hành tốt trên thế giới',
      description: isEn
        ? 'Learn from successful sustainability models and practices worldwide'
        : 'Học hỏi từ các mô hình phát triển bền vững thành công của doanh nghiệp toàn cầu',
      href: withLocalePrefix('/global_best_practice', locale),
      icon: '🌍',
      bgColor: 'vn-red-light',
      iconColor: 'vn-red',
      hoverBg: 'vn-red',
    },
    {
      id: 'vietnam-practices',
      title: isEn ? 'Good Practices in Vietnam' : 'Thực hành tốt tại Việt Nam',
      description: isEn
        ? 'Discover outstanding ESG stories from businesses and communities in Vietnam'
        : 'Khám phá các điển hình ESG xuất sắc trong doanh nghiệp và cộng đồng Việt Nam',
      href: withLocalePrefix('/VN_best_practice', locale),
      icon: '🇻🇳',
      bgColor: 'vn-green-light',
      iconColor: 'vn-green',
      hoverBg: 'vn-green',
      specialBorder: true,
    },
  ];

  return (
    <section className="py-16 w-full">
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="mb-12 text-left">
          <h2 className="font-bold mb-4 font-montserrat" style={{ fontSize: '40px', fontWeight: 700, color: '#3C3C3B' }}>
            {isEn ? 'Content Library' : 'Thư viện Nội dung'}
          </h2>
          <p className="font-montserrat text-lg max-w-3xl" style={{ color: '#6B7280' }}>
            {isEn
              ? 'Access curated resources on policy, research, and sustainable practices'
              : 'Truy cập kho tài liệu phong phú về chính sách, nghiên cứu và thực hành bền vững'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contentCards.map((card) => {
            // Determine icon based on card ID
            let iconContent;
            if (card.id === 'policy') {
              iconContent = <FileText className="w-10 h-10" />;
            } else if (card.id === 'reports') {
              iconContent = <BarChart3 className="w-10 h-10" />;
            } else if (card.id === 'global-practices') {
              iconContent = <Globe2 className="w-10 h-10" />;
            } else if (card.id === 'vietnam-practices') {
              iconContent = (
                <Image
                  src="/VN map icon.png"
                  alt="Vietnam map"
                  width={48}
                  height={48}
                />
              );
            }

            return (
              <Link
                key={card.id}
                href={card.href}
                className="group block overflow-hidden bg-white transition-all duration-500"
                style={{
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                }}
                aria-label={`${card.title} - ${card.description}`}
              >
                {/* Content Container - Zooms on hover */}
                <div className="flex flex-col items-center text-center p-6 transition-transform duration-500 group-hover:scale-105">
                  {/* Icon Container - Zooms with content */}
                  <div
                    className="mb-4 w-16 h-16 flex items-center justify-center transition-transform duration-500"
                    style={{ backgroundColor: '#ffb81c' }}
                  >
                    {iconContent}
                  </div>
                  {/* Title */}
                  <h3 className="text-lg md:text-xl font-bold mb-3 font-montserrat" style={{ color: '#3C3C3B' }}>
                    {card.title}
                  </h3>
                  {/* Description */}
                  <p className="text-sm md:text-base font-montserrat leading-relaxed" style={{ color: '#6B7280' }}>
                    {card.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
