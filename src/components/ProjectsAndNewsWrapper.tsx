'use client';

import EventsSection from '@/components/EventsSection';
import HoatDongSection from '@/components/HoatDongSection';

export default function ProjectsAndNewsWrapper() {
  return (
    <section className="relative overflow-hidden w-full">
      <div className="relative z-10">
        <EventsSection />
        <HoatDongSection />
      </div>
    </section>
  );
}
