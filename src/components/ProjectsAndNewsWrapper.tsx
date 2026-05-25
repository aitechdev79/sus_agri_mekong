'use client';

import EventsSection from '@/components/EventsSection';
import HoatDongSection from '@/components/HoatDongSection';

interface ProjectsAndNewsWrapperProps {
  initialEvents?: Parameters<typeof EventsSection>[0]['initialItems'];
}

export default function ProjectsAndNewsWrapper({ initialEvents = [] }: ProjectsAndNewsWrapperProps) {
  return (
    <section className="relative overflow-hidden w-full">
      <div className="relative z-10">
        <EventsSection initialItems={initialEvents} />
        <HoatDongSection />
      </div>
    </section>
  );
}
