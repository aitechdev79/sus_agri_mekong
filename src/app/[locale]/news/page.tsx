'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Eye, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import EventCalendar from '@/components/EventCalendar';

interface NewsItem {
  id: string;
  title: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  thumbnailUrl?: string;
  viewCount: number;
  createdAt: string;
  category?: string;
}

export default function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = useState('vi');
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    params.then(p => setLocale(p.locale));
  }, [params]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/content/news');
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Sort events by date and prepare carousel items
  const sortedEvents = [...newsItems].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Create at least 3 items for carousel by duplicating if needed
  let carouselItems = sortedEvents.slice(0, 3);
  if (carouselItems.length < 3 && carouselItems.length > 0) {
    // Duplicate items to reach 3
    while (carouselItems.length < 3) {
      carouselItems = [...carouselItems, ...sortedEvents];
    }
    carouselItems = carouselItems.slice(0, 3);
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    if (carouselItems.length > 1) {
      const interval = setInterval(() => {
        nextSlide();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [carouselItems.length, currentSlide]);

  // Prepare events for calendar
  const calendarEvents = newsItems.map(item => ({
    id: item.id,
    title: item.title,
    date: new Date(item.createdAt),
    type: (item.category?.toLowerCase().includes('đào tạo') || item.category?.toLowerCase().includes('training')) ? 'training' as const : 'event' as const,
  }));

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b" style={{ borderColor: '#E8F5E9' }}>
        <div className="container mx-auto px-6 py-4">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center font-montserrat font-semibold transition-colors"
            style={{ color: '#0A7029' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#065a1f';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#0A7029';
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Về trang chủ
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upcoming Events */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 font-montserrat" style={{ color: '#3C3C3B' }}>
                Sự Kiện Sắp Diễn Ra
              </h1>
              <p className="text-lg font-montserrat" style={{ color: '#6B7280' }}>
                Cập nhật những sự kiện mới nhất và sắp diễn ra
              </p>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-96 bg-gray-100 animate-pulse"></div>
                ))}
              </div>
            ) : carouselItems.length > 0 ? (
              <div className="relative">
                {/* Carousel Container */}
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {carouselItems.map((item, index) => (
                      <div key={`${item.id}-${index}`} className="w-full flex-shrink-0 px-2">
                        <Link href={`/${locale}/news/${item.id}`} className="block group">
                          <div className="bg-white overflow-hidden transition-all duration-300" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
                            {/* Image Container - Sharp corners with zoom effect */}
                            <div className="relative h-64 md:h-96 overflow-hidden">
                              {item.thumbnailUrl ? (
                                <Image
                                  src={item.thumbnailUrl}
                                  alt={item.title}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-500">Không có hình ảnh</span>
                                </div>
                              )}
                              {/* Date Badge - Green theme */}
                              <div className="absolute top-4 left-4 px-4 py-2 font-bold shadow-lg font-montserrat" style={{ backgroundColor: '#0A7029', color: 'white' }}>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  <span>{formatDate(item.createdAt)}</span>
                                </div>
                              </div>
                            </div>
                            {/* Text Content with Animated Border */}
                            <div className="p-6 relative" style={{ minHeight: '160px' }}>
                              {/* Base light-green border */}
                              <div className="absolute bottom-0 left-0 w-full h-0.5" style={{ backgroundColor: '#E8F5E9' }}></div>

                              {/* Animated dark-green border */}
                              <div
                                className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 ease-out"
                                style={{ backgroundColor: '#0A7029' }}
                              ></div>

                              <h2 className="text-xl md:text-2xl font-bold mb-3 font-montserrat line-clamp-2" style={{ color: '#3C3C3B' }}>
                                {item.title}
                              </h2>
                              {item.description && (
                                <p className="leading-relaxed line-clamp-3 mb-4 font-montserrat" style={{ color: '#6B7280' }}>
                                  {item.description}
                                </p>
                              )}
                              <div className="flex items-center gap-4 text-sm" style={{ color: '#9CA3AF' }}>
                                <div className="flex items-center gap-1">
                                  <Eye className="w-4 h-4" />
                                  <span>{item.viewCount} lượt xem</span>
                                </div>
                                {item.category && (
                                  <span className="px-3 py-1 text-xs font-semibold font-montserrat" style={{ backgroundColor: '#E8F5E9', color: '#0A7029' }}>
                                    {item.category}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Buttons */}
                {carouselItems.length > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 p-3 rounded-full shadow-lg transition-all duration-300 z-10 group"
                      style={{ backgroundColor: '#0A7029', color: 'white' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#065a1f';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#0A7029';
                      }}
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 p-3 rounded-full shadow-lg transition-all duration-300 z-10 group"
                      style={{ backgroundColor: '#0A7029', color: 'white' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#065a1f';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#0A7029';
                      }}
                      aria-label="Next slide"
                    >
                      <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </button>
                  </>
                )}

                {/* Carousel Indicators */}
                {carouselItems.length > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    {carouselItems.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className="w-3 h-3 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: index === currentSlide ? '#0A7029' : '#E8F5E9',
                          width: index === currentSlide ? '32px' : '12px'
                        }}
                        onMouseEnter={(e) => {
                          if (index !== currentSlide) {
                            e.currentTarget.style.backgroundColor = '#C8E6C9';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (index !== currentSlide) {
                            e.currentTarget.style.backgroundColor = '#E8F5E9';
                          }
                        }}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white p-12 text-center" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
                <p className="text-lg font-montserrat" style={{ color: '#6B7280' }}>Chưa có sự kiện nào được đăng</p>
              </div>
            )}
          </div>

          {/* Right Column - Calendar */}
          <div className="lg:col-span-1">
            <div className="mb-6 invisible">
              <h2 className="text-2xl md:text-3xl font-bold">Placeholder</h2>
            </div>
            <EventCalendar events={calendarEvents} />
          </div>
        </div>

        {/* Tin Sự Kiện Section */}
        <div className="mt-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2 md:text-4xl font-montserrat" style={{ color: '#3C3C3B' }}>
              Tin Sự Kiện
            </h2>
            <p className="text-lg font-montserrat max-w-3xl" style={{ color: '#6B7280' }}>
              Danh sách các tin tức và sự kiện nổi bật
            </p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-100 animate-pulse"></div>
              ))}
            </div>
          ) : newsItems.length > 0 ? (
            <div className="space-y-6">
              {newsItems.slice(0, 5).map((item) => (
                <Link
                  key={item.id}
                  href={`/${locale}/news/${item.id}`}
                  className="block group"
                >
                  <article className="bg-white overflow-hidden transition-all duration-300 flex flex-col md:flex-row relative" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
                    {/* Image - Sharp corners with zoom effect */}
                    <div className="relative h-40 md:h-40 md:w-56 flex-shrink-0 overflow-hidden">
                      {item.thumbnailUrl ? (
                        <Image
                          src={item.thumbnailUrl}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <Calendar className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Content with Animated Border */}
                    <div className="p-6 flex-1 relative" style={{ minHeight: '120px' }}>
                      {/* Base light-green border */}
                      <div className="absolute bottom-0 left-0 w-full h-0.5" style={{ backgroundColor: '#E8F5E9' }}></div>

                      {/* Animated dark-green border */}
                      <div
                        className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 ease-out"
                        style={{ backgroundColor: '#0A7029' }}
                      ></div>

                      {/* Date */}
                      <div className="flex items-center text-sm mb-2" style={{ color: '#9CA3AF' }}>
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className="font-montserrat font-medium">
                          {formatDate(item.createdAt)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg md:text-xl font-bold mb-2 font-montserrat line-clamp-2" style={{ color: '#3C3C3B' }}>
                        {item.title}
                      </h3>

                      {/* Description */}
                      {item.description && (
                        <p className="text-sm md:text-base line-clamp-2 mb-3 font-montserrat" style={{ color: '#6B7280' }}>
                          {item.description}
                        </p>
                      )}

                      {/* View Count and Category */}
                      <div className="flex items-center gap-4 text-sm" style={{ color: '#9CA3AF' }}>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{item.viewCount} lượt xem</span>
                        </div>
                        {item.category && (
                          <span className="px-3 py-1 text-xs font-semibold font-montserrat" style={{ backgroundColor: '#E8F5E9', color: '#0A7029' }}>
                            {item.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
              <p className="text-lg font-montserrat" style={{ color: '#6B7280' }}>Chưa có tin tức nào được đăng</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
