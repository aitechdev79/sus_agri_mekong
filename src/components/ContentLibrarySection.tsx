'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function ContentLibrarySection() {
  const contentCards = [
    {
      id: 'policy',
      title: 'Chính sách và quy định',
      description: 'Cập nhật các chính sách, quy định và văn bản pháp luật liên quan đến doanh nghiệp',
      href: '/policy',
      icon: '📋',
      bgColor: 'vn-green-light',
      iconColor: 'vn-green',
      hoverBg: 'vn-green',
    },
    {
      id: 'reports',
      title: 'Nghiên cứu và Báo cáo',
      description: 'Khám phá các nghiên cứu, báo cáo và phân tích chuyên sâu về phát triển bền vững',
      href: '/reports',
      icon: '📊',
      bgColor: 'vn-gold-light',
      iconColor: 'vn-gold',
      hoverBg: 'vn-gold',
    },
    {
      id: 'global-practices',
      title: 'Thực hành tốt trên thế giới',
      description: 'Học hỏi từ các mô hình phát triển bền vững thành công của doanh nghiệp toàn cầu',
      href: '/global_best_practice',
      icon: '🌍',
      bgColor: 'vn-red-light',
      iconColor: 'vn-red',
      hoverBg: 'vn-red',
    },
    {
      id: 'vietnam-practices',
      title: 'Thực hành tốt tại Việt Nam',
      description: 'Khám phá các điển hình ESG xuất sắc trong doanh nghiệp và cộng đồng Việt Nam',
      href: '/VN_best_practice',
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
          <h2 className="font-bold text-vn-green mb-4 font-montserrat" style={{ fontSize: '40px', fontWeight: 700 }}>
            Thư viện Nội dung
          </h2>
          <p className="text-vn-dark font-montserrat text-lg max-w-3xl">
            Truy cập kho tài liệu phong phú về chính sách, nghiên cứu và thực hành bền vững
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contentCards.map((card) => {
            // Determine icon based on card ID
            let iconContent;
            if (card.id === 'policy') {
              iconContent = <span className="text-4xl">📋</span>; // Notepad
            } else if (card.id === 'reports') {
              iconContent = <span className="text-4xl">📊</span>; // Chart
            } else if (card.id === 'global-practices') {
              iconContent = <span className="text-4xl">🌍</span>; // Globe
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
                  <div className="mb-4 w-16 h-16 bg-gray-100 flex items-center justify-center transition-transform duration-500">
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
