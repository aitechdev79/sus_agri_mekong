'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Leaf, Waves } from 'lucide-react';

export default function HoatDongSection() {
  const activities = [
    {
      id: 'rice-sustainability',
      title: 'Dự án Lúa Bền vững Đồng bằng Sông Cửu Long',
      description: 'Phát triển mô hình canh tác lúa thân thiện môi trường, tiết kiệm nước và tăng năng suất tại các tỉnh đồng bằng sông Cửu Long.',
      href: '/activities/rice-sustainability',
      icon: Leaf,
      color: 'bg-green-500',
      backgroundImage: '/tools/rice.png',
    },
    {
      id: 'shrimp-aquaculture',
      title: 'Chương trình Nuôi Tôm Sinh thái Bền vững',
      description: 'Xây dựng chuỗi giá trị nuôi tôm bền vững từ giống đến sản phẩm cuối, ứng dụng công nghệ cao và thân thiện với môi trường.',
      href: '/activities/shrimp-aquaculture',
      icon: Waves,
      color: 'bg-blue-500',
      backgroundImage: '/tools/shrimp.png',
    },
  ];

  return (
    <section className="py-20 bg-teal-800" style={{ backgroundColor: '#1F4E4E' }}>
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-16">
          <h2 className="text-4xl font-black text-white mb-6 md:text-5xl font-montserrat text-left tracking-tight">
            Hoạt Động
          </h2>
          <p className="text-xl text-teal-100 font-montserrat text-left max-w-3xl leading-relaxed">
            Khám phá các dự án phát triển bền vững do chúng tôi thực hiện tại đồng bằng sông Cửu Long.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {activities.map((activity) => (
            <Link
              key={activity.id}
              href={activity.href}
              className="group relative bg-white rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 border-2 border-teal-200 hover:border-teal-300"
              aria-label={`${activity.title} - ${activity.description}`}
              style={{ boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)' }}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={activity.backgroundImage}
                  alt={`${activity.title} background`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-white bg-opacity-15"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center text-center p-10">
                <div className={`${activity.color} rounded-full p-6 mb-8 group-hover:scale-125 transition-all duration-300 shadow-xl`}>
                  <activity.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-6 font-montserrat tracking-tight leading-tight">
                  {activity.title}
                </h3>
                <p className="text-gray-700 flex-grow font-montserrat leading-relaxed text-lg font-bold">
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