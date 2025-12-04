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

  // Sort events by date and separate featured from list
  const sortedEvents = [...newsItems].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const featuredEvent = sortedEvents[0];
  const upcomingEvents = sortedEvents.slice(1, 5);

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
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-32 bg-white/20 animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : newsItems.length > 0 ? (
              <div className="space-y-6">
                {/* Featured Event */}
                {featuredEvent && (
                  <Link href={`/content/${featuredEvent.id}`} className="block group">
                    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                      <div className="relative h-64 md:h-80">
                        {featuredEvent.thumbnailUrl || featuredEvent.imageUrl ? (
                          <Image
                            src={featuredEvent.thumbnailUrl || featuredEvent.imageUrl || ''}
                            alt={featuredEvent.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">Không có hình ảnh</span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h2 className="text-xl md:text-2xl font-bold text-blue-800 mb-3 font-montserrat group-hover:text-blue-600 transition-colors">
                          {featuredEvent.title}
                        </h2>
                        {featuredEvent.description && (
                          <p className="text-gray-700 leading-relaxed">
                            {featuredEvent.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                )}

                {/* Event List */}
                {upcomingEvents.length > 0 && (
                  <div className="bg-white rounded-lg p-6 shadow-lg space-y-4">
                    {upcomingEvents.map((item) => (
                      <Link
                        key={item.id}
                        href={`/content/${item.id}`}
                        className="flex gap-4 group hover:bg-gray-50 p-3 rounded-lg transition-colors"
                      >
                        <div className="relative w-24 h-24 flex-shrink-0 rounded overflow-hidden">
                          {item.thumbnailUrl || item.imageUrl ? (
                            <Image
                              src={item.thumbnailUrl || item.imageUrl || ''}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-xs text-gray-400">No image</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {item.title}
                          </h3>
                          {item.description && (
                            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </Link>
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