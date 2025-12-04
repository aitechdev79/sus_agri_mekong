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
      backgroundImage: '/chinhsachquydinh.jpg',
    },
    {
      id: 'reports',
      title: 'Nghiên cứu và Báo cáo',
      description: 'Khám phá các nghiên cứu, báo cáo và phân tích chuyên sâu về phát triển bền vững',
      href: '/reports',
      backgroundImage: '/nghiencuubaocao.jpg',
    },
    {
      id: 'global-practices',
      title: 'Thực hành tốt trên thế giới',
      description: 'Học hỏi từ các mô hình phát triển bền vững thành công của doanh nghiệp toàn cầu',
      href: '/esg#global-practices',
      backgroundImage: '/global_practices.jpg',
      gradient: 'from-blue-600/80 to-indigo-600/80',
    },
    {
      id: 'vietnam-practices',
      title: 'Thực hành tốt tại Việt Nam',
      description: 'Khám phá các điển hình ESG xuất sắc trong doanh nghiệp và cộng đồng Việt Nam',
      href: '/esg#vietnam-practices',
      backgroundImage: '/vietnam_practices.jpg',
      gradient: 'from-green-600/80 to-emerald-600/80',
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
              className="group relative rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 aspect-[3/4]"
              aria-label={`${card.title} - ${card.description}`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                {card.id === 'global-practices' || card.id === 'vietnam-practices' ? (
                  // For new cards with gradient overlay
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300">
                      {/* Fallback background if images don't exist */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl opacity-20">
                          {card.id === 'global-practices' ? '🌍' : '🇻🇳'}
                        </span>
                      </div>
                    </div>
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} group-hover:opacity-90 transition-opacity duration-300`}></div>
                  </>
                ) : (
                  // For existing cards matching ToolsGrid
                  <>
                    <Image
                      src={card.backgroundImage}
                      alt={`${card.title} background`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 25vw"
                      priority={false}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 to-transparent"></div>
                  </>
                )}
              </div>

              {/* Content - Centered for new cards, bottom-aligned for existing */}
              <div className={`relative z-10 h-full flex flex-col p-6 ${
                card.id === 'global-practices' || card.id === 'vietnam-practices'
                  ? 'justify-center items-center text-center'
                  : 'justify-end'
              }`}>
                {/* Icon for new cards */}
                {(card.id === 'global-practices' || card.id === 'vietnam-practices') && (
                  <div className="mb-4 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <span className="text-3xl">
                      {card.id === 'global-practices' ? '🌍' : '🇻🇳'}
                    </span>
                  </div>
                )}

                <h3 className={`text-lg md:text-xl font-bold text-white mb-3 transition-all duration-300 font-montserrat ${
                  card.id === 'global-practices' || card.id === 'vietnam-practices'
                    ? 'text-center'
                    : 'md:mb-0 md:group-hover:mb-3'
                }`}>
                  {card.title}
                </h3>

                <p className={`text-white/90 text-sm md:text-base font-montserrat leading-relaxed transition-all duration-300 ${
                  card.id === 'global-practices' || card.id === 'vietnam-practices'
                    ? 'text-center'
                    : 'md:max-h-0 md:overflow-hidden md:opacity-0 md:group-hover:max-h-32 md:group-hover:opacity-100'
                }`}>
                  {card.description}
                </p>

                {/* Decorative arrow for new cards */}
                {(card.id === 'global-practices' || card.id === 'vietnam-practices') && (
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white font-montserrat font-semibold flex items-center gap-2">
                      Khám phá →
                    </span>
                  </div>
                )}
              </div>

              {/* Hover overlay for new cards */}
              {(card.id === 'global-practices' || card.id === 'vietnam-practices') && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
