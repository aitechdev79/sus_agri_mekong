'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function DienHinhSection() {
  const activities = [
    {
      id: 'minh-phu',
      title: 'Công ty Minh Phú',
      description: 'Cải thiện công cụ làm việc cho nữ giám sát ở Tập đoàn Thủy sản Minh Phú',
      href: '/congtyMinhphu',
      backgroundImage: '/Minhphu thumb.jpg',
    },
    {
      id: 'tai-ky',
      title: 'Công ty Tài Ký',
      description: 'Khi một giờ nghỉ trở thành giá trị cho toàn bộ doanh nghiệp',
      href: '/congtyTaiky',
      backgroundImage: '/Taiky thumb.jpg',
    },
    {
      id: 'vinh-hien',
      title: 'Công ty Vinh Hiển',
      description: 'Nâng tầm hạt gạo Việt Nam - Hành trình của niềm tin và sự chuyển mình',
      href: '/congtyVinhhien',
      backgroundImage: '/Vinhhien thumb.jpg',
    },
  ];

  return (
    <section className="py-16 bg-vn-rice-white">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-vn-green mb-4 md:text-4xl font-montserrat text-left">
            Thực hành điển hình - Lan toả giá trị
          </h2>
          <p className="text-lg text-vn-dark font-montserrat text-left max-w-3xl">
            Khám phá những câu chuyện thành công và mô hình hay sáng kiến điển hình trong phát triển bền vững tại Việt Nam
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-end">
          {activities.map((activity) => (
            <Link
              key={activity.id}
              href={activity.href}
              className="group block flex flex-col"
              aria-label={`${activity.title} - ${activity.description}`}
            >
              {/* Image Container - No rounded corners, no overlay - 80% height */}
              <div className="relative overflow-hidden mb-4" style={{ aspectRatio: '4/2.4' }}>
                <Image
                  src={activity.backgroundImage}
                  alt={activity.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              {/* Text Content Below - Black text with animated border-bottom - Fixed height */}
              <div className="pb-4 relative flex-1 flex flex-col" style={{ minHeight: '120px' }}>
                {/* Base light-green border */}
                <div className="absolute bottom-0 left-0 w-full h-0.5" style={{ backgroundColor: '#E8F5E9' }}></div>

                {/* Animated dark-green border that sweeps left to right */}
                <div
                  className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 ease-out"
                  style={{ backgroundColor: '#0A7029' }}
                ></div>

                <h3 className="text-lg md:text-xl font-bold mb-2 font-montserrat" style={{ color: '#3C3C3B' }}>
                  {activity.title}
                </h3>
                <p className="text-sm md:text-base font-montserrat flex-1" style={{ color: '#6B7280' }}>
                  {activity.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}