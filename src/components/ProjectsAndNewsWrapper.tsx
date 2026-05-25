'use client';

import EventsSection from '@/components/EventsSection';
import HoatDongSection from '@/components/HoatDongSection';

interface ProjectsAndNewsWrapperProps {
  initialEvents?: Parameters<typeof EventsSection>[0]['initialItems'];
  initialProjectActivities?: Parameters<typeof HoatDongSection>[0]['initialItems'];
}

export default function ProjectsAndNewsWrapper({
  initialEvents = [],
  initialProjectActivities = [],
}: ProjectsAndNewsWrapperProps) {
  return (
    <section className="relative overflow-hidden w-full">
      <div className="relative z-10">
        <EventsSection initialItems={initialEvents} />
        <HoatDongSection initialItems={initialProjectActivities} />
      </div>
    </section>
  );
}
