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
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-vn-green mb-4 md:text-4xl font-montserrat">
            Thư viện Nội dung
          </h2>
          <p className="text-vn-dark font-montserrat text-lg max-w-3xl mx-auto">
            Truy cập kho tài liệu phong phú về chính sách, nghiên cứu và thực hành bền vững
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contentCards.map((card) => {
            const bgColorMap: Record<string, string> = {
              'vn-green-light': '#E8F5E9',
              'vn-gold-light': '#FFF8E1',
              'vn-red-light': 'rgba(218, 41, 28, 0.1)',
            };
            const iconColorMap: Record<string, string> = {
              'vn-green': '#0A7029',
              'vn-gold': '#FFB81C',
              'vn-red': '#DA291C',
            };
            const hoverBgMap: Record<string, string> = {
              'vn-green': '#0A7029',
              'vn-gold': '#FFB81C',
              'vn-red': '#DA291C',
            };

            return (
              <Link
                key={card.id}
                href={card.href}
                className={`flex flex-col items-center text-center rounded-lg p-6 hover:shadow-lg transition-all duration-300 group ${
                  card.specialBorder ? 'border-[3px]' : ''
                }`}
                style={{
                  backgroundColor: bgColorMap[card.bgColor],
                  borderColor: card.specialBorder ? '#FFB81C' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = hoverBgMap[card.hoverBg];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = bgColorMap[card.bgColor];
                }}
                aria-label={`${card.title} - ${card.description}`}
              >
                {/* Icon */}
                <div
                  className="mb-4 text-5xl h-[80px] flex items-center justify-center transition-colors duration-300"
                  style={{ color: iconColorMap[card.iconColor] }}
                >
                  {card.id === 'vietnam-practices' ? (
                    <Image
                      src="/VN map icon.png"
                      alt="Vietnam map"
                      width={60}
                      height={60}
                      className="group-hover:scale-110 transition-transform duration-300 group-hover:brightness-0 group-hover:invert"
                    />
                  ) : (
                    <span className="group-hover:scale-110 transition-transform duration-300 inline-block">
                      {card.icon}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-bold text-vn-dark mb-3 font-montserrat group-hover:text-white transition-colors">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-vn-dark text-sm md:text-base font-montserrat leading-relaxed group-hover:text-white transition-colors">
                  {card.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
