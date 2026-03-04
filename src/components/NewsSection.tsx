'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Calendar, Presentation } from 'lucide-react';
import { getBestImageUrl } from '@/lib/image-utils';
import MiniEventCalendar from '@/components/MiniEventCalendar';

interface EventItem {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  eventStartAt: string;
  eventEndAt?: string | null;
  eventTimezone?: string | null;
  eventLocation?: string | null;
  isAllDay?: boolean;
  viewCount: number;
  category?: string;
}

function formatEventDate(item: EventItem) {
  const date = new Date(item.eventStartAt);

  if (item.isAllDay) {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function NewsSection() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`/api/content/events?_t=${Date.now()}`);
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const now = new Date();
  const upcomingEvents = events
    .filter((item) => new Date(item.eventStartAt).getTime() >= now.getTime())
    .sort((a, b) => new Date(a.eventStartAt).getTime() - new Date(b.eventStartAt).getTime());
  const pastEvents = events
    .filter((item) => new Date(item.eventStartAt).getTime() < now.getTime())
    .sort((a, b) => new Date(b.eventStartAt).getTime() - new Date(a.eventStartAt).getTime());
  const featuredEvents = upcomingEvents.length >= 2
    ? upcomingEvents.slice(0, 2)
    : [...upcomingEvents, ...pastEvents.slice(0, 2 - upcomingEvents.length)];

  const calendarEvents = events.map((item) => ({
    id: item.id,
    title: item.title,
    date: new Date(item.eventStartAt),
    isPast: new Date(item.eventStartAt).getTime() < now.getTime(),
  }));

  if (loading) {
    return (
      <section className="py-16 w-full">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white/20 rounded-lg h-32"></div>
                ))}
              </div>
              <div className="bg-white/20 rounded-lg h-96"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return null;
  }

  return (
    <section className="py-16 w-full bg-white relative">
      <div className="absolute inset-0 opacity-5">
        <Image
          src="/vecteezy_topo_34242655.svg"
          alt="Background pattern"
          fill
          className="object-cover"
          priority={false}
        />
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2 md:text-4xl font-montserrat text-left" style={{ color: '#3C3C3B' }}>
              Sự Kiện
            </h2>
            <p className="text-lg font-montserrat text-left max-w-3xl" style={{ color: '#6B7280' }}>
              Theo dõi các sự kiện sắp diễn ra và những hoạt động đã tổ chức gần đây.
            </p>
          </div>
          <Link
            href="/tat-ca-su-kien"
            className="hidden md:inline-flex items-center gap-2 rounded-xl border border-[#FFC107] bg-transparent px-6 py-3 font-bold transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            style={{
              color: '#3C3C3B',
              boxShadow: '0 4px 12px rgba(255, 193, 7, 0.15)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 193, 7, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 193, 7, 0.15)';
            }}
          >
            Xem tất cả sự kiện
            <span className="text-xl">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            {featuredEvents.map((item, index) => {
              const isUpcoming = new Date(item.eventStartAt).getTime() >= now.getTime();

              return (
                <Link
                  key={item.id}
                  href={`/content/${item.id}`}
                  className="group block overflow-hidden bg-white transition-all duration-500"
                  style={{
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  <div className="flex flex-row items-center px-6 py-4 transition-transform duration-500 group-hover:scale-105" style={{ minHeight: '120px' }}>
                    <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 mr-6 bg-gray-100 overflow-hidden">
                      {(() => {
                        let imageUrl = null;
                        if (item.thumbnailUrl) {
                          if (item.thumbnailUrl.includes('/uploads/')) {
                            imageUrl = getBestImageUrl(item.thumbnailUrl, null);
                          } else if (item.thumbnailUrl.startsWith('data:image/')) {
                            imageUrl = item.thumbnailUrl;
                          }
                        }

                        return imageUrl ? (
                          imageUrl.startsWith('data:image/') ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Image
                              src={imageUrl}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          )
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                            <Presentation className="w-10 h-10 text-blue-500" />
                          </div>
                        );
                      })()}
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex items-center gap-3 text-sm mb-2">
                        <div className="flex items-center" style={{ color: '#9CA3AF' }}>
                          <Calendar className="w-4 h-4 mr-1" />
                          <span className="font-montserrat font-medium">
                            {formatEventDate(item)}
                          </span>
                        </div>
                        {isUpcoming && index === 0 && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold font-montserrat" style={{ backgroundColor: '#0A7029', color: 'white' }}>
                            Sắp diễn ra
                          </span>
                        )}
                        {!isUpcoming && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold font-montserrat" style={{ backgroundColor: '#F97316', color: 'white' }}>
                            Đã diễn ra
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg md:text-xl font-bold mb-2 font-montserrat line-clamp-2" style={{ color: '#3C3C3B' }}>
                        {item.title}
                      </h3>

                      {item.description && (
                        <p className="text-sm md:text-base line-clamp-2 font-montserrat" style={{ color: '#6B7280' }}>
                          {item.description}
                        </p>
                      )}
                      {item.eventLocation && (
                        <p className="mt-2 text-sm font-montserrat" style={{ color: '#6B7280' }}>
                          {item.eventLocation}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="lg:col-span-1 lg:sticky lg:top-6">
            <div className="rounded-2xl overflow-hidden bg-white" style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)' }}>
              <MiniEventCalendar events={calendarEvents} />
            </div>
          </div>
        </div>

        <div className="mt-8 md:hidden text-center">
          <Link
            href="/tat-ca-su-kien"
            className="inline-flex items-center gap-2 rounded-xl border border-[#FFC107] bg-transparent px-6 py-3 font-bold transition-all duration-300 hover:scale-105"
            style={{
              color: '#3C3C3B',
              boxShadow: '0 4px 12px rgba(255, 193, 7, 0.15)'
            }}
          >
            Xem tất cả sự kiện
            <span className="text-xl">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
