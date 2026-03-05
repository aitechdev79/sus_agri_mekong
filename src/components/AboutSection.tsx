'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getLocaleFromPathname, withLocalePrefix } from '@/lib/content-locale';

interface Stats {
  publishedReports: number;
  trackedPolicies: number;
  members: number;
  supportedInitiatives: number;
}

export default function AboutSection() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isEn = locale === 'en';

  const [stats, setStats] = useState<Stats>({
    publishedReports: 0,
    trackedPolicies: 0,
    members: 0,
    supportedInitiatives: 0
  });

  useEffect(() => {
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
      title: isEn ? 'Vision, Mission & Goals' : 'Tầm nhìn, sứ mệnh, mục tiêu',
      description: isEn
        ? 'Commitment to transparent and reliable information for a sustainable future.'
        : 'Cam kết cung cấp thông tin minh bạch và đáng tin cậy để xây dựng tương lai bền vững',
      href: withLocalePrefix('/commitment', locale),
      image: '/nong dan duoc mua.jpg'
    },
    {
      id: 'vcci',
      title: isEn ? 'About VCCI' : 'Về VCCI',
      description: isEn
        ? 'Learn about VCCI and its role in sustainable business development.'
        : 'Tìm hiểu về Phòng Thương mại và Công nghiệp Việt Nam và vai trò trong phát triển doanh nghiệp',
      href: withLocalePrefix('/about-vcci', locale),
      image: '/VCCI_blue.jpeg'
    },
    {
      id: 'doi-tac',
      title: isEn ? 'Strategic Partners' : 'Đối tác chiến lược',
      description: isEn
        ? 'Connect with partner organizations to accelerate sustainable development.'
        : 'Kết nối với các đối tác và tổ chức hợp tác để thúc đẩy phát triển bền vững',
      href: withLocalePrefix('/partners', locale),
      image: '/doitac_chienluoc2.jpg'
    }
  ];

  return (
    <section className="py-16 bg-vn-gold-light">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 mb-16">
          <div className="flex flex-col justify-center">
            <p className="mb-6 text-lg text-vn-dark leading-relaxed font-montserrat">
              {isEn
                ? 'This portal is an initiative by VCCI-HCM to provide transparent, accurate, and trusted information for sustainable development in Viet Nam.'
                : 'Cổng thông tin là sáng kiến của VCCI-HCM, được hình thành với sứ mệnh cung cấp nguồn dữ liệu, thông tin minh bạch, chính xác và đáng tin cậy, đặt nền móng cho tương lai phát triển bền vững của Việt Nam'}
            </p>

            <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-md p-4 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-vn-green" />
                <div className="text-3xl font-bold text-vn-gold font-montserrat mb-2">{stats.publishedReports}</div>
                <div className="text-xs text-vn-dark font-montserrat">{isEn ? 'Published reports' : 'Số báo cáo được xuất bản'}</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-vn-green" />
                <div className="text-3xl font-bold text-vn-gold font-montserrat mb-2">{stats.trackedPolicies}</div>
                <div className="text-xs text-vn-dark font-montserrat">{isEn ? 'Tracked policies' : 'Số chính sách đã theo dõi'}</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-vn-green" />
                <div className="text-3xl font-bold text-vn-gold font-montserrat mb-2">{stats.members}</div>
                <div className="text-xs text-vn-dark font-montserrat">{isEn ? 'Community members' : 'Số thành viên tham gia'}</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-vn-green" />
                <div className="text-3xl font-bold text-vn-gold font-montserrat mb-2">{stats.supportedInitiatives}</div>
                <div className="text-xs text-vn-dark font-montserrat">{isEn ? 'Supported initiatives' : 'Số sáng kiến được hỗ trợ'}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-start">
            <div className="relative h-80 w-full max-w-md">
              <Image src="/art_members.png" alt={isEn ? 'Sustainable value chain' : 'Minh họa chuỗi cung ứng bền vững'} fill className="object-contain" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
          {infoCards.map((card) => (
            <Link key={card.id} href={card.href} className="group flex h-full flex-col self-start" aria-label={`${card.title} - ${card.description}`}>
              <div className="relative aspect-[4/3] overflow-hidden mb-4">
                <Image src={card.image} alt={card.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>

              <div className="pb-4 relative flex-1 flex flex-col" style={{ minHeight: '120px' }}>
                <div className="absolute bottom-0 left-0 w-full h-0.5" style={{ backgroundColor: '#E8F5E9' }} />
                <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 ease-out" style={{ backgroundColor: '#0A7029' }} />
                <h3 className="text-lg md:text-xl font-bold mb-2 font-montserrat" style={{ color: '#3C3C3B' }}>{card.title}</h3>
                <p className="text-sm md:text-base font-montserrat flex-1" style={{ color: '#6B7280' }}>{card.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
