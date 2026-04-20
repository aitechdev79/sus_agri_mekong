'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getLocaleFromPathname, withLocalePrefix } from '@/lib/content-locale';
import { HOME_STATS_DEFAULTS, HOME_STATS_FIELDS } from '@/lib/home-stats';

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
    ...HOME_STATS_DEFAULTS
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch('/api/home-stats');
        const data = await response.json();
        if (response.ok && data?.stats) {
          setStats({ ...HOME_STATS_DEFAULTS, ...data.stats });
        }
      } catch (error) {
        console.error('Home stats fetch error:', error);
      }
    };

    void loadStats();
  }, []);

  const infoCards = [
    {
      id: 'cam-ket',
      title: isEn ? 'Vision, Mission & Goals' : 'Tầm nhìn, sứ mệnh, mục tiêu',
      description: isEn
        ? 'Commitment to transparent and reliable information for a sustainable future.'
        : 'Cung cấp dữ liệu, thông tin minh bạch và đáng tin cậy đặt nền móng cho tương lai phát triển bền vững của Việt Nam.',
      href: withLocalePrefix('/vision-mission', locale),
      image: '/tam-nhin-su-menh-muc-tieu.png'
    },
    {
      id: 'vcci',
      title: isEn ? 'About VCCI' : 'Về VCCI',
      description: isEn
        ? 'Learn about VCCI and its role in sustainable business development.'
        : 'Tìm hiểu về Phòng Thương mại và Công nghiệp Việt Nam và vai trò trong phát triển doanh nghiệp',
      href: withLocalePrefix('/about-vcci', locale),
      image: '/logo-vcci.png'
    },
    {
      id: 'doi-tac',
      title: isEn ? 'Strategic Partners' : 'Đối tác chiến lược',
      description: isEn
        ? 'Connect with partner organizations to accelerate sustainable development.'
        : 'Kết nối với các đối tác và tổ chức hợp tác để thúc đẩy phát triển bền vững',
      href: withLocalePrefix('/partners', locale),
      image: '/doi-tac-chien-luoc.jpg'
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
              {HOME_STATS_FIELDS.map((field) => (
                <div key={field.key} className="bg-white rounded-lg shadow-md p-4 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-vn-green" />
                  <div className="text-3xl font-bold text-vn-gold font-montserrat mb-2">
                    {stats[field.key].toLocaleString(locale === 'en' ? 'en-US' : 'vi-VN')}
                  </div>
                  <div className="text-xs text-vn-dark font-montserrat">{isEn ? field.labelEn : field.labelVi}</div>
                </div>
              ))}
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
              <div className={`relative aspect-[4/3] overflow-hidden mb-4 ${card.id === 'vcci' ? 'bg-[#EEECE1] p-8' : ''}`}>
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className={`${card.id === 'vcci' ? 'object-contain p-6 group-hover:scale-105' : 'object-cover group-hover:scale-110'} transition-transform duration-500`}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
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
