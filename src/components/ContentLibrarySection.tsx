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
          <h2 className="font-bold text-vn-green mb-4 font-montserrat" style={{ fontSize: '40px', fontWeight: 700 }}>
            Thư viện Nội dung
          </h2>
          <p className="text-vn-dark font-montserrat text-lg max-w-3xl mx-auto">
            Truy cập kho tài liệu phong phú về chính sách, nghiên cứu và thực hành bền vững
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contentCards.map((card) => {
            // Box 1: Policy - Green theme
            if (card.id === 'policy') {
              return (
                <Link
                  key={card.id}
                  href={card.href}
                  className="content-card card-policy relative flex flex-col items-center text-center rounded-lg p-6 transition-all duration-300 group border-t-4 border-vn-green overflow-hidden"
                  style={{
                    backgroundColor: '#E8F5E9',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(10, 112, 41, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                  }}
                  aria-label={`${card.title} - ${card.description}`}
                >
                  {/* Icon Container */}
                  <div className="mb-4 w-16 h-16 bg-vn-green rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl brightness-0 invert">{card.icon}</span>
                  </div>
                  {/* Title */}
                  <h3 className="text-lg md:text-xl font-bold text-vn-green mb-3 font-montserrat">
                    {card.title}
                  </h3>
                  {/* Description */}
                  <p className="text-vn-dark text-sm md:text-base font-montserrat leading-relaxed">
                    {card.description}
                  </p>
                </Link>
              );
            }

            // Box 2: Reports - Gold theme
            if (card.id === 'reports') {
              return (
                <Link
                  key={card.id}
                  href={card.href}
                  className="content-card relative flex flex-col items-center text-center rounded-lg p-6 transition-all duration-300 group border-t-4 border-vn-gold overflow-hidden"
                  style={{
                    backgroundColor: '#FFF8E1',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                  }}
                  aria-label={`${card.title} - ${card.description}`}
                >
                  {/* Icon Container */}
                  <div className="mb-4 w-16 h-16 bg-vn-gold rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl text-vn-dark">{card.icon}</span>
                  </div>
                  {/* Title */}
                  <h3 className="text-lg md:text-xl font-bold text-vn-gold mb-3 font-montserrat">
                    {card.title}
                  </h3>
                  {/* Description */}
                  <p className="text-vn-dark text-sm md:text-base font-montserrat leading-relaxed">
                    {card.description}
                  </p>
                </Link>
              );
            }

            // Box 3: Global Practices - Red theme
            if (card.id === 'global-practices') {
              return (
                <Link
                  key={card.id}
                  href={card.href}
                  className="content-card relative flex flex-col items-center text-center rounded-lg p-6 transition-all duration-300 group border-t-4 border-vn-red overflow-hidden"
                  style={{
                    backgroundColor: 'rgba(218, 41, 28, 0.08)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                  }}
                  aria-label={`${card.title} - ${card.description}`}
                >
                  {/* Icon Container */}
                  <div className="mb-4 w-16 h-16 bg-vn-red rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl brightness-0 invert">{card.icon}</span>
                  </div>
                  {/* Title */}
                  <h3 className="text-lg md:text-xl font-bold text-vn-red mb-3 font-montserrat">
                    {card.title}
                  </h3>
                  {/* Description */}
                  <p className="text-vn-dark text-sm md:text-base font-montserrat leading-relaxed">
                    {card.description}
                  </p>
                </Link>
              );
            }

            // Box 4: Vietnam Practices - Special styling
            if (card.id === 'vietnam-practices') {
              return (
                <Link
                  key={card.id}
                  href={card.href}
                  className="card-vietnam relative flex flex-col items-center text-center rounded-lg p-6 transition-all duration-300 group border-3 border-t-4 overflow-hidden"
                  style={{
                    backgroundColor: 'white',
                    border: '3px solid #FFB81C',
                    borderTop: '4px solid #0A7029',
                    boxShadow: '0 4px 16px rgba(10, 112, 41, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                    e.currentTarget.style.borderColor = '#DA291C';
                    e.currentTarget.style.borderTop = '4px solid #0A7029';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.borderColor = '#FFB81C';
                    e.currentTarget.style.borderTop = '4px solid #0A7029';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(10, 112, 41, 0.1)';
                  }}
                  aria-label={`${card.title} - ${card.description}`}
                >
                  {/* Icon Container */}
                  <div className="mb-4 w-16 h-16 bg-vn-green rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src="/VN map icon.png"
                      alt="Vietnam map"
                      width={48}
                      height={48}
                      className="brightness-0 invert"
                    />
                  </div>
                  {/* Title */}
                  <h3 className="text-lg md:text-xl font-bold text-vn-green mb-3 font-montserrat">
                    {card.title}
                  </h3>
                  {/* Description */}
                  <p className="text-vn-dark text-sm md:text-base font-montserrat leading-relaxed">
                    {card.description}
                  </p>
                </Link>
              );
            }

            return null;
          })}
        </div>
      </div>
    </section>
  );
}
