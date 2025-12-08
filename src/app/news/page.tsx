'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import NavigationBar from '@/components/NavigationBar';
import EventCalendar from '@/components/EventCalendar';

interface NewsItem {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  viewCount: number;
  thumbnailUrl?: string;
  imageUrl?: string;
  category?: string;
}

interface PaginatedResponse {
  contents: NewsItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5; // 5 items per page for better pagination demonstration

  useEffect(() => {
    fetchNews(currentPage);
  }, [currentPage]);

  const fetchNews = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/content?type=NEWS,ARTICLE&page=${page}&limit=${itemsPerPage}`);
      if (response.ok) {
        const data: PaginatedResponse = await response.json();
        setNewsItems(data.contents);
        setTotalPages(data.pagination.pages);
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

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5; // Maximum number of page buttons to show

    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);

    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    // First page
    if (startPage > 1) {
      buttons.push(
        <button
          key="1"
          onClick={() => goToPage(1)}
          className="px-3 py-1 rounded border hover:bg-gray-100"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(<span key="dots1" className="px-2">...</span>);
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-1 rounded border ${
            i === currentPage
              ? 'bg-blue-600 text-white border-blue-600'
              : 'hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="dots2" className="px-2">...</span>);
      }
      buttons.push(
        <button
          key="last"
          onClick={() => goToPage(totalPages)}
          className="px-3 py-1 rounded border hover:bg-gray-100"
        >
          Trang cuối
        </button>
      );
    }

    return buttons;
  };

  // Carousel state for upcoming events
  const [currentSlide, setCurrentSlide] = useState(0);

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
      <NavigationBar />

      <main className="container mx-auto px-6 py-20">
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
                        <Link href={`/content/${item.id}`} className="block group">
                          <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow mx-2">
                            <div className="relative h-64 md:h-96">
                              {item.thumbnailUrl || item.imageUrl ? (
                                <Image
                                  src={item.thumbnailUrl || item.imageUrl || ''}
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
            <EventCalendar events={calendarEvents} />
          </div>
        </div>
      </main>
    </div>
  );
}