'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HoatDongSection() {
  const activities = [
    {
      id: 'rice-sustainability',
      title: 'Công ty Minh Phú',
      description: 'Cải thiện công cụ làm việc cho nữ giám sát ở Tập đoàn Thủy sản Minh Phú',
      href: '/activities/rice-sustainability',
      backgroundImage: '/duan_lua_benvung.jpg',
    },
    {
      id: 'shrimp-aquaculture',
      title: 'Chương trình Nuôi Tôm Sinh thái Bền vững',
      description: 'Xây dựng chuỗi giá trị nuôi tôm bền vững từ giống đến sản phẩm cuối, ứng dụng công nghệ cao và thân thiện với môi trường.',
      href: '/activities/shrimp-aquaculture',
      backgroundImage: '/tom_baclieu.jpg',
    },
  ];

  return (
    <section className="py-20 bg-teal-800 relative overflow-hidden w-full" style={{ backgroundColor: '#1F4E4E' }}>
      {/* Background SVG - Full Width */}
      <div className="absolute inset-0 w-full h-full opacity-50">
        <Image
          src="/waving-blue-color-gradient-6543611.svg"
          alt="Waving gradient background"
          fill
          className="object-cover w-full h-full"
          priority={false}
          sizes="100vw"
        />
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="mb-16">
          <h2 className="text-4xl font-black text-white mb-6 md:text-5xl font-montserrat text-left tracking-tight">
            Hoạt động dự án
          </h2>
          <p className="text-xl text-teal-100 font-montserrat text-left max-w-3xl leading-relaxed">
            Tìm hiểu thêm về dự án đã và đang thực hiện của chúng tôi.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Empty space for first column on desktop */}
          <div className="hidden md:block"></div>

          {activities.map((activity) => (
            <Link
              key={activity.id}
              href={activity.href}
              className="group relative rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 aspect-[2/3]"
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
                {/* Lighter gradient only at bottom for text readability */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>

              {/* Content - Left Aligned at Bottom */}
              <div className="relative z-10 h-full flex flex-col justify-end p-6">
                <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-0 md:group-hover:mb-3 transition-all duration-300 font-montserrat">
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