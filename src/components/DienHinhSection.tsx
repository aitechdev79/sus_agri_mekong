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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {activities.map((activity) => (
            <Link
              key={activity.id}
              href={activity.href}
              className="group relative rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 aspect-[2/3] border-2 border-transparent hover:border-vn-green"
              aria-label={`${activity.title} - ${activity.description}`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={activity.backgroundImage}
                  alt={`${activity.title} background`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                {/* Vietnamese green gradient overlay from transparent to rgba(10, 112, 41, 0.8) */}
                <div
                  className="absolute inset-x-0 bottom-0 h-1/2"
                  style={{
                    background: 'linear-gradient(to top, rgba(10, 112, 41, 0.8), transparent)'
                  }}
                ></div>
              </div>

              {/* Green Accent Bar */}
              <div className="absolute top-0 left-0 w-full h-2 bg-vn-green z-[2]"></div>

              {/* Content - Left Aligned at Bottom */}
              <div className="relative z-10 h-full flex flex-col justify-end p-6">
                <h3 className="text-lg md:text-xl font-bold text-vn-gold group-hover:text-vn-gold mb-3 md:mb-0 md:group-hover:mb-3 transition-all duration-300 font-montserrat">
                  {activity.title}
                </h3>
                <p className="text-white/90 text-sm md:text-base font-montserrat md:max-h-0 md:overflow-hidden md:opacity-0 md:group-hover:max-h-32 md:group-hover:opacity-100 transition-all duration-300">
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