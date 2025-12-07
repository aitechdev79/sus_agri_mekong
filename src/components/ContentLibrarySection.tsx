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
      href: '/global_best_practice',
      icon: '🌍',
    },
    {
      id: 'vietnam-practices',
      title: 'Thực hành tốt tại Việt Nam',
      description: 'Khám phá các điển hình ESG xuất sắc trong doanh nghiệp và cộng đồng Việt Nam',
      href: '/VN_best_practice',
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
              <div className="mb-4 text-5xl h-[80px] flex items-center justify-center">
                {card.id === 'vietnam-practices' ? (
                  <Image
                    src="/VN map icon.png"
                    alt="Vietnam map"
                    width={60}
                    height={60}
                    className="group-hover:scale-110 transition-transform duration-300"
                  />
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
