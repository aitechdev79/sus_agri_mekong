'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { getBestImageUrl } from '@/lib/image-utils';
import MiniEventCalendar from '@/components/MiniEventCalendar';

interface NewsItem {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  createdAt: string;
  viewCount: number;
  category?: string;
}

export default function NewsSection() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`/api/content/news?_t=${Date.now()}`);
        if (response.ok) {
          const data = await response.json();
          setNewsItems(data);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Sort and get featured events
  const sortedEvents = [...newsItems].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const featuredEvents = sortedEvents.slice(0, 3);

  // Prepare events for calendar
  const calendarEvents = newsItems.map(item => ({
    id: item.id,
    title: item.title,
    date: new Date(item.createdAt),
    type: (item.category?.toLowerCase().includes('đào tạo') || item.category?.toLowerCase().includes('training')) ? 'training' as const : 'event' as const,
  }));

  if (loading) {
    return (
      <section className="py-16 w-full">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2, 3].map((i) => (
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

  if (newsItems.length === 0) {
    return null;
  }

  return (
    <section className="py-16 w-full">
      <div className="container mx-auto px-6 max-w-6xl relative">
        {/* Teal background with 75% transparency - fits content */}
        <div
          className="absolute inset-0 rounded-2xl -mx-6 -my-8"
          style={{
            backgroundColor: 'rgba(4, 120, 87, 0.25)',
            zIndex: -1
          }}
        ></div>
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-vn-gold mb-2 md:text-4xl font-montserrat text-left">
              Tin Tức & Sự Kiện
            </h2>
            <p className="text-lg text-white font-montserrat text-left max-w-3xl" style={{ opacity: 0.9 }}>
              Cập nhật những tin tức và sự kiện mới nhất của chúng tôi.
            </p>
          </div>
          <Link
            href="/news"
            className="hidden md:inline-flex items-center gap-2 bg-vn-gold text-vn-dark font-bold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
            style={{
              boxShadow: '0 4px 12px rgba(255, 184, 28, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FFD84D'; // Lighten gold by 10%
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFB81C'; // Original vn-gold
            }}
          >
            Xem tất cả
            <span className="text-xl">→</span>
          </Link>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Left Column - Featured Events (70%) */}
          <div className="lg:col-span-2 space-y-3">
            {featuredEvents.map((item) => (
              <Link
                key={item.id}
                href={`/content/${item.id}`}
                className="block group"
              >
                <article className="bg-white rounded-lg overflow-hidden border-2 border-transparent hover:border-vn-gold transition-all duration-300 hover:-translate-y-1 flex flex-col md:flex-row h-full hover:shadow-[0_8px_24px_rgba(10,112,41,0.15)]">
                  {/* Image */}
                  <div className="relative h-32 md:h-auto md:w-32 flex-shrink-0 overflow-hidden">
                    <div className="absolute inset-0 bg-vn-green opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
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
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                          <Calendar className="w-8 h-8 text-blue-400" />
                        </div>
                      );
                    })()}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1">
                    {/* Date */}
                    <div className="flex items-center text-xs mb-1" style={{ color: 'rgba(60, 60, 59, 0.6)' }}>
                      <Calendar className="w-3 h-3 mr-1" />
                      <span className="font-montserrat">
                        {(() => {
                          const date = new Date(item.createdAt);
                          const day = date.getDate().toString().padStart(2, '0');
                          const month = (date.getMonth() + 1).toString().padStart(2, '0');
                          const year = date.getFullYear();
                          return `${day}/${month}/${year}`;
                        })()}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-vn-dark mb-1 group-hover:text-vn-green transition-colors duration-300 font-montserrat line-clamp-2">
                      {item.title}
                    </h3>

                    {/* Description */}
                    {item.description && (
                      <p className="text-sm line-clamp-1 font-montserrat" style={{ color: 'rgba(60, 60, 59, 0.7)' }}>
                        {item.description}
                      </p>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Right Column - Mini Calendar (30%) */}
          <div className="lg:col-span-1 flex flex-col">
            <div className="flex-1">
              <MiniEventCalendar events={calendarEvents} />
            </div>
          </div>
        </div>

        {/* Mobile View All Button */}
        <div className="mt-6 md:hidden text-center">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 bg-vn-gold text-vn-dark font-bold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
            style={{
              boxShadow: '0 4px 12px rgba(255, 184, 28, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FFD84D'; // Lighten gold by 10%
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFB81C'; // Original vn-gold
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