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

  return (
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Text Content */}
          <div className="flex flex-col justify-center">
            <p className="mb-6 text-lg text-gray-600 leading-relaxed font-montserrat">
              Cổng thông tin là sáng kiến của VCCI-HCM, được hình thành với sứ mệnh cung cấp nguồn dữ liệu, thông tin minh bạch, chính xác và đáng tin cậy, đặt nền móng cho tương lai phát triển bền vững của Việt Nam
            </p>

            {/* Stats */}
            <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 font-montserrat">{stats.publishedReports}</div>
                <div className="text-sm text-gray-600 font-montserrat">Số báo cáo được xuất bản</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 font-montserrat">{stats.trackedPolicies}</div>
                <div className="text-sm text-gray-600 font-montserrat">Số chính sách đã theo dõi</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 font-montserrat">{stats.members}</div>
                <div className="text-sm text-gray-600 font-montserrat">Số thành viên tham gia</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 font-montserrat">{stats.supportedInitiatives}</div>
                <div className="text-sm text-gray-600 font-montserrat">Số sáng kiến được hỗ trợ</div>
              </div>
            </div>

            {/* CTA Button */}
            <div>
              <Link
                href="/about-us"
                className="inline-block font-montserrat font-bold text-sm text-white bg-green-600 hover:bg-green-700 transition-all duration-300 px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105"
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
      </div>
    </section>
  );
}