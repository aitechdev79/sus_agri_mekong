'use client';

import Link from 'next/link';

export default function ContentLibrarySection() {
  const contentCards = [
    {
      id: 'policy',
      title: 'Chính sách và quy định',
      description: 'Cập nhật các chính sách, quy định và văn bản pháp luật liên quan đến doanh nghiệp',
      href: '/policy',
      icon: '📋',
    },
    {
      id: 'reports',
      title: 'Nghiên cứu và Báo cáo',
      description: 'Khám phá các nghiên cứu, báo cáo và phân tích chuyên sâu về phát triển bền vững',
      href: '/reports',
      icon: '📊',
    },
    {
      id: 'global-practices',
      title: 'Thực hành tốt trên thế giới',
      description: 'Học hỏi từ các mô hình phát triển bền vững thành công của doanh nghiệp toàn cầu',
      href: '/esg#global-practices',
      icon: '🌍',
    },
    {
      id: 'vietnam-practices',
      title: 'Thực hành tốt tại Việt Nam',
      description: 'Khám phá các điển hình ESG xuất sắc trong doanh nghiệp và cộng đồng Việt Nam',
      href: '/esg#vietnam-practices',
      icon: '🇻🇳',
    },
  ];

  return (
    <section className="py-16 w-full">
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 md:text-4xl font-montserrat">
            Thư viện Nội dung
          </h2>
          <p className="text-gray-600 font-montserrat text-lg max-w-3xl mx-auto">
            Truy cập kho tài liệu phong phú về chính sách, nghiên cứu và thực hành bền vững
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contentCards.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              className="flex flex-col items-center text-center bg-white border-4 border-gray-300 rounded-lg p-6 hover:border-green-600 hover:shadow-lg transition-all duration-300 group"
              aria-label={`${card.title} - ${card.description}`}
            >
              {/* Icon */}
              <div className="mb-4 text-5xl">
                {card.id === 'vietnam-practices' ? (
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 100 150"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="group-hover:scale-110 transition-transform duration-300"
                  >
                    <path
                      d="M50 10 L60 15 L65 25 L70 35 L75 50 L78 65 L75 80 L70 95 L65 110 L60 125 L55 135 L50 140 L45 135 L40 125 L35 110 L30 95 L25 80 L22 65 L25 50 L30 35 L35 25 L40 15 Z"
                      fill="#10B981"
                      stroke="#047857"
                      strokeWidth="2"
                    />
                  </svg>
                ) : (
                  card.icon
                )}
              </div>

              {/* Title */}
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 font-montserrat group-hover:text-green-600 transition-colors">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm md:text-base font-montserrat leading-relaxed">
                {card.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
