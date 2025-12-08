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
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #1e40af, #1e3a8a)' }}>
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center text-white hover:text-yellow-300 transition-colors"
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
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 font-montserrat">
                SỰ KIỆN SẮP DIỄN RA
              </h1>
              <button className="text-yellow-400 hover:text-yellow-300">
                <span className="text-2xl">»</span>
              </button>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-96 bg-white/20 animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : carouselItems.length > 0 ? (
              <div className="relative">
                {/* Carousel Container */}
                <div className="overflow-hidden rounded-lg">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {carouselItems.map((item, index) => (
                      <div key={`${item.id}-${index}`} className="w-full flex-shrink-0">
                        <Link href={`/${locale}/news/${item.id}`} className="block group">
                          <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow mx-2">
                            <div className="relative h-64 md:h-96">
                              {item.thumbnailUrl ? (
                                <Image
                                  src={item.thumbnailUrl}
                                  alt={item.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-500">Không có hình ảnh</span>
                                </div>
                              )}
                              {/* Date Badge */}
                              <div className="absolute top-4 left-4 bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-bold shadow-lg">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  <span>{formatDate(item.createdAt)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="p-6">
                              <h2 className="text-xl md:text-2xl font-bold text-blue-800 mb-3 font-montserrat group-hover:text-blue-600 transition-colors line-clamp-2">
                                {item.title}
                              </h2>
                              {item.description && (
                                <p className="text-gray-700 leading-relaxed line-clamp-3 mb-4">
                                  {item.description}
                                </p>
                              )}
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Eye className="w-4 h-4" />
                                  <span>{item.viewCount} lượt xem</span>
                                </div>
                                {item.category && (
                                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
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
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-yellow-400 hover:bg-yellow-500 text-blue-900 p-3 rounded-full shadow-lg transition-all duration-300 z-10 group"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-yellow-400 hover:bg-yellow-500 text-blue-900 p-3 rounded-full shadow-lg transition-all duration-300 z-10 group"
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
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentSlide
                            ? 'bg-yellow-400 w-8'
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-12 text-center">
                <p className="text-gray-500 text-lg">Chưa có sự kiện nào được đăng</p>
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
            <h2 className="text-3xl font-bold text-yellow-400 mb-2 md:text-4xl font-montserrat">
              Tin Sự Kiện
            </h2>
            <p className="text-lg text-white/90 font-montserrat max-w-3xl">
              Danh sách các tin tức và sự kiện nổi bật
            </p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-white/20 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : newsItems.length > 0 ? (
            <div className="space-y-4">
              {newsItems.slice(0, 5).map((item) => (
                <Link
                  key={item.id}
                  href={`/${locale}/news/${item.id}`}
                  className="block group"
                >
                  <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="relative h-32 md:h-32 md:w-48 flex-shrink-0">
                      {item.thumbnailUrl ? (
                        <Image
                          src={item.thumbnailUrl}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                          <Calendar className="w-8 h-8 text-blue-400" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1">
                      {/* Date */}
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span className="font-montserrat">
                          {formatDate(item.createdAt)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors font-montserrat line-clamp-2">
                        {item.title}
                      </h3>

                      {/* Description */}
                      {item.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 font-montserrat">
                          {item.description}
                        </p>
                      )}

                      {/* View Count and Category */}
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{item.viewCount} lượt xem</span>
                        </div>
                        {item.category && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
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
            <div className="bg-white rounded-lg p-12 text-center">
              <p className="text-gray-500 text-lg">Chưa có tin tức nào được đăng</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
