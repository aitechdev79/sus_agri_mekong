'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Stats {
  publishedReports: number;
  trackedPolicies: number;
  members: number;
  supportedInitiatives: number;
}

export default function AboutSection() {
  const [stats, setStats] = useState<Stats>({
    publishedReports: 0,
    trackedPolicies: 0,
    members: 0,
    supportedInitiatives: 0
  });

  useEffect(() => {
    // Fetch stats from API (placeholder for now)
    setStats({
      publishedReports: 10,
      trackedPolicies: 20,
      members: 5000,
      supportedInitiatives: 15
    });
  }, []);

  const infoCards = [
    {
      id: 'cam-ket',
      title: 'Cam kết của chúng tôi',
      description: 'Cam kết cung cấp thông tin minh bạch và đáng tin cậy để xây dựng tương lai bền vững',
      href: '/commitment',
      image: '/camket.jpeg',
    },
    {
      id: 'vcci',
      title: 'Về VCCI',
      description: 'Tìm hiểu về Phòng Thương mại và Công nghiệp Việt Nam và vai trò trong phát triển doanh nghiệp',
      href: '/about-vcci',
      image: '/VCCI_blue.jpeg',
    },
    {
      id: 'doi-tac',
      title: 'Đối tác chiến lược',
      description: 'Kết nối với các đối tác và tổ chức hợp tác để thúc đẩy phát triển bền vững',
      href: '/partners',
      image: '/doitac_chienluoc.jpeg',
    },
  ];

  return (
    <section className="py-16 bg-vn-gold-light">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 mb-16">
          {/* Text Content */}
          <div className="flex flex-col justify-center">
            <p className="mb-6 text-lg text-vn-dark leading-relaxed font-montserrat">
              Cổng thông tin là sáng kiến của VCCI-HCM, được hình thành với sứ mệnh cung cấp nguồn dữ liệu, thông tin minh bạch, chính xác và đáng tin cậy, đặt nền móng cho tương lai phát triển bền vững của Việt Nam
            </p>

            {/* Stats */}
            <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-md p-4 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-vn-green"></div>
                <div className="text-3xl font-bold text-vn-gold font-montserrat mb-2">{stats.publishedReports}</div>
                <div className="text-xs text-vn-dark font-montserrat">Số báo cáo được xuất bản</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-vn-green"></div>
                <div className="text-3xl font-bold text-vn-gold font-montserrat mb-2">{stats.trackedPolicies}</div>
                <div className="text-xs text-vn-dark font-montserrat">Số chính sách đã theo dõi</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-vn-green"></div>
                <div className="text-3xl font-bold text-vn-gold font-montserrat mb-2">{stats.members}</div>
                <div className="text-xs text-vn-dark font-montserrat">Số thành viên tham gia</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-vn-green"></div>
                <div className="text-3xl font-bold text-vn-gold font-montserrat mb-2">{stats.supportedInitiatives}</div>
                <div className="text-xs text-vn-dark font-montserrat">Số sáng kiến được hỗ trợ</div>
              </div>
            </div>

            {/* CTA Button */}
            <div>
              <Link
                href="/vision-mission"
                className="inline-block font-montserrat font-bold text-sm text-white bg-vn-green hover:bg-vn-green-dark transition-all duration-300 px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                aria-label="Khám phá về chúng tôi"
              >
                Khám phá
              </Link>
            </div>

          </div>

          {/* Image */}
          <div className="flex items-center justify-start">
            <div className="relative h-80 w-full max-w-md">
              <Image
                src="/art_members.png"
                alt="Minh họa chuỗi cung ứng bền vững"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>

        {/* Info Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {infoCards.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              className="group relative rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 aspect-[3/2]"
              aria-label={`${card.title} - ${card.description}`}
            >
              {/* Background Image */}
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />

              {/* Dark Overlay for better text contrast */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300 z-[1]" />

              {/* Content - Left Aligned at Bottom */}
              <div className="relative z-10 h-full flex flex-col justify-end p-6">
                <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-0 md:group-hover:mb-3 transition-all duration-300 font-montserrat">
                  {card.title}
                </h3>
                <p className="text-white text-sm md:text-base font-montserrat md:max-h-0 md:overflow-hidden md:opacity-0 md:group-hover:max-h-32 md:group-hover:opacity-100 transition-all duration-300">
                  {card.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}