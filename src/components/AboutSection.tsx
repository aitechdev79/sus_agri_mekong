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
              Chúng tôi làm gì?
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

          </div>

          {/* Image */}
          <div className="flex items-center justify-start">
            <div className="relative h-80 w-full max-w-md">
              <Image
                src="/about_us/supply_chain_art.png"
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