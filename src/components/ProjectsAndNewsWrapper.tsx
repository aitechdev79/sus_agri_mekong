'use client';

import Image from 'next/image';
import NewsSection from '@/components/NewsSection';
import HoatDongSection from '@/components/HoatDongSection';

export default function ProjectsAndNewsWrapper() {
  return (
    <section className="relative overflow-hidden w-full">
      {/* Background SVG - Extended curvy background */}
      <div className="absolute inset-0 w-full h-full opacity-30">
        <Image
          src="/waving-blue-color-gradient-6543611.svg"
          alt="Waving gradient background"
          fill
          className="object-cover w-full h-full"
          priority={false}
          sizes="100vw"
        />
      </div>

      {/* Green background extending from above */}
      <div className="absolute inset-0 w-full h-full bg-vn-green -z-10"></div>

      {/* Content */}
      <div className="relative z-10">
        <NewsSection />
        <HoatDongSection />
      </div>
    </section>
  );
}
