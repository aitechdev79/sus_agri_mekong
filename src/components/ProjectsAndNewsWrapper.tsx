'use client';

import Image from 'next/image';
import NewsSection from '@/components/NewsSection';
import HoatDongSection from '@/components/HoatDongSection';

export default function ProjectsAndNewsWrapper() {
  return (
    <section className="relative overflow-hidden w-full">
      {/* Content */}
      <div className="relative z-10">
        <NewsSection />
        <HoatDongSection />
      </div>
    </section>
  );
}
