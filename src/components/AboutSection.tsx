'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Stats {
  userCount: number;
  contentCount: number;
  viewCount: number;
}

export default function AboutSection() {
  const [stats, setStats] = useState<Stats>({ userCount: 0, contentCount: 0, viewCount: 0 });

  useEffect(() => {
    // Fetch stats from API (placeholder for now)
    setStats({
      userCount: 1000,
      contentCount: 250,
      viewCount: 50000
    });
  }, []);

  return (
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Text Content */}
          <div className="flex flex-col justify-center">
            <h2 className="mb-6 text-3xl font-bold text-gray-800 md:text-4xl font-montserrat">
              Tầm nhìn, sứ mạng
            </h2>
            <p className="mb-6 text-lg text-gray-600 leading-relaxed font-montserrat">
              Tạo ra một không gian để các nông dân, chuyên gia và tổ chức chia sẻ kiến thức, kinh nghiệm và thực hành tốt nhất trong chuỗi giá trị tôm và lúa. Hãy cùng xây dựng một cộng đồng học tập bền vững.
            </p>

            {/* Stats */}
            <div className="mb-8 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 font-montserrat">{stats.userCount}+</div>
                <div className="text-sm text-gray-600 font-montserrat">Người dùng</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 font-montserrat">{stats.contentCount}+</div>
                <div className="text-sm text-gray-600 font-montserrat">Tài liệu</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 font-montserrat">{stats.viewCount}+</div>
                <div className="text-sm text-gray-600 font-montserrat">Lượt xem</div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mb-8">
              <Link
                href="/about-us"
                className="inline-block font-montserrat font-bold text-sm text-white bg-green-600 hover:bg-green-700 transition-all duration-300 px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                aria-label="Khám phá về chúng tôi"
              >
                Khám phá
              </Link>
            </div>

            {/* Business Members Section */}
            <div>
              <h3 className="mb-6 text-3xl font-bold text-gray-800 md:text-4xl font-montserrat">
                Doanh nghiệp thành viên
              </h3>
              <p className="mb-6 text-lg text-gray-600 leading-relaxed font-montserrat">
                Các doanh nghiệp đóng góp kiến thức chuyên môn, kinh nghiệm thực tiễn và nguồn lực để phát triển cộng đồng. Tham gia nền tảng giúp doanh nghiệp kết nối với nông dân, mở rộng thị trường và xây dựng uy tín thương hiệu bền vững.
              </p>

              {/* Member Logos */}
              <div className="mb-6 flex items-center space-x-6">
                <div className="relative h-18 w-30">
                  <Image
                    src="/01-Greenfeed.png"
                    alt="Greenfeed Logo"
                    fill
                    className="object-contain"
                    sizes="120px"
                  />
                </div>
                <div className="relative h-18 w-30">
                  <Image
                    src="/02-CP.jpg"
                    alt="CP Logo"
                    fill
                    className="object-contain"
                    sizes="120px"
                  />
                </div>
                <div className="relative h-18 w-30">
                  <Image
                    src="/03-binhdien.jpg"
                    alt="Binh Dien Logo"
                    fill
                    className="object-contain"
                    sizes="120px"
                  />
                </div>
              </div>
              <Link
                href="/members"
                className="inline-block font-montserrat font-bold text-sm text-white bg-green-600 hover:bg-green-700 transition-all duration-300 px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                aria-label="Xem danh sách thành viên"
              >
                Thành viên
              </Link>
            </div>

          </div>

          {/* Image */}
          <div className="flex items-center justify-start">
            <div className="relative h-80 w-full max-w-md">
              <Image
                src="/supply_chain_art.png"
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