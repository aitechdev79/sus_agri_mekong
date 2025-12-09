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
  const featuredEvents = sortedEvents.slice(0, 2);

  // Carousel state for additional news
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselNews = [
    {
      id: 'carousel-1',
      title: 'Phát triển Nông nghiệp Bền vững tại Đồng bằng Sông Cửu Long',
      description: 'Khám phá các giải pháp canh tác thông minh và thân thiện với môi trường',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'carousel-2',
      title: 'Chương trình Hỗ trợ Nông dân Chuyển đổi Sản xuất Xanh',
      description: 'Áp dụng công nghệ mới giúp tăng năng suất và giảm phát thải',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'carousel-3',
      title: 'Bảo vệ Đa dạng Sinh học tại Vùng Đồng bằng Sông Cửu Long',
      description: 'Các sáng kiến bảo tồn hệ sinh thái và phát triển bền vững',
      createdAt: new Date().toISOString(),
    },
  ];

  // Prepare events for calendar - only 'event' type with green color
  const calendarEvents = newsItems.map(item => ({
    id: item.id,
    title: item.title,
    date: new Date(item.createdAt),
    type: 'event' as const,
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
    <section className="py-16 w-full bg-white relative">
      {/* Subtle topographic pattern overlay */}
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
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2 md:text-4xl font-montserrat text-left" style={{ color: '#3C3C3B' }}>
              Tin Tức & Sự Kiện
            </h2>
            <p className="text-lg font-montserrat text-left max-w-3xl" style={{ color: '#6B7280' }}>
              Cập nhật những tin tức và sự kiện mới nhất của chúng tôi.
            </p>
          </div>
          <Link
            href="/news"
            className="hidden md:inline-flex items-center gap-2 font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            style={{
              backgroundColor: '#FFC107',
              color: '#3C3C3B',
              boxShadow: '0 4px 12px rgba(255, 193, 7, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 193, 7, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 193, 7, 0.3)';
            }}
          >
            Xem tất cả
            <span className="text-xl">→</span>
          </Link>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column - Featured Events (70%) */}
          <div className="lg:col-span-2 space-y-6">
            {featuredEvents.map((item, index) => (
              <Link
                key={item.id}
                href={`/content/${item.id}`}
                className="block group"
              >
                <article className="bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 flex flex-col md:flex-row h-full"
                  style={{
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  {/* Image */}
                  <div className="relative h-48 md:h-auto md:w-48 flex-shrink-0 overflow-hidden">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10" style={{ backgroundColor: '#FFC107' }}></div>
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
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <Image
                            src={imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <Calendar className="w-12 h-12 text-gray-400" />
                        </div>
                      );
                    })()}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Date and Tag */}
                    <div className="flex items-center justify-between text-sm mb-3">
                      <div className="flex items-center" style={{ color: '#9CA3AF' }}>
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="font-montserrat font-medium">
                          {(() => {
                            const date = new Date(item.createdAt);
                            const day = date.getDate().toString().padStart(2, '0');
                            const month = (date.getMonth() + 1).toString().padStart(2, '0');
                            const year = date.getFullYear();
                            return `${day}/${month}/${year}`;
                          })()}
                        </span>
                      </div>
                      {index === 0 && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold font-montserrat" style={{ backgroundColor: '#0A7029', color: 'white' }}>
                          Sắp diễn ra
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-3 font-montserrat line-clamp-2 transition-colors duration-300" style={{ color: '#3C3C3B' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#FFC107';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#3C3C3B';
                      }}
                    >
                      {item.title}
                    </h3>

                    {/* Description */}
                    {item.description && (
                      <p className="text-base line-clamp-2 font-montserrat" style={{ color: '#6B7280' }}>
                        {item.description}
                      </p>
                    )}
                  </div>
                </article>
              </Link>
            ))}

            {/* Carousel Section */}
            <div className="bg-white rounded-2xl overflow-hidden transition-all duration-300" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
              <div className="p-6">
                {/* Carousel Content */}
                <div className="mb-4">
                  <div className="flex items-center text-sm mb-3" style={{ color: '#9CA3AF' }}>
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="font-montserrat font-medium">
                      {(() => {
                        const date = new Date(carouselNews[carouselIndex].createdAt);
                        const day = date.getDate().toString().padStart(2, '0');
                        const month = (date.getMonth() + 1).toString().padStart(2, '0');
                        const year = date.getFullYear();
                        return `${day}/${month}/${year}`;
                      })()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 font-montserrat" style={{ color: '#3C3C3B' }}>
                    {carouselNews[carouselIndex].title}
                  </h3>
                  <p className="text-sm font-montserrat" style={{ color: '#6B7280' }}>
                    {carouselNews[carouselIndex].description}
                  </p>
                </div>

                {/* Carousel Dots */}
                <div className="flex items-center justify-center gap-2">
                  {carouselNews.map((_, dotIndex) => (
                    <button
                      key={dotIndex}
                      onClick={() => setCarouselIndex(dotIndex)}
                      className="transition-all duration-300 rounded-full"
                      style={{
                        width: carouselIndex === dotIndex ? '24px' : '8px',
                        height: '8px',
                        backgroundColor: carouselIndex === dotIndex ? '#FFC107' : '#D1D5DB',
                      }}
                      aria-label={`Go to slide ${dotIndex + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Mini Calendar (30%) - Floating widget */}
          <div className="lg:col-span-1 lg:sticky lg:top-6">
            <div className="rounded-2xl overflow-hidden bg-white" style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)' }}>
              <MiniEventCalendar events={calendarEvents} />
            </div>
          </div>
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 md:hidden text-center">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: '#FFC107',
              color: '#3C3C3B',
              boxShadow: '0 4px 12px rgba(255, 193, 7, 0.3)'
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