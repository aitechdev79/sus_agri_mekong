'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Eye, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePublicCategories } from '@/hooks/use-public-categories';
import { pickLocalizedText } from '@/lib/content-locale';
import { formatVietnamDate } from '@/lib/vietnam-time';

interface NewsItem {
  id: string;
  title: string;
  titleEn?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
  thumbnailUrl?: string;
  imageUrl?: string;
  viewCount: number;
  createdAt: string;
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

export default function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = useState('vi');
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const { categoryLabels } = usePublicCategories();
  const isEn = locale === 'en';

  useEffect(() => {
    params.then((p) => setLocale(p.locale));
  }, [params]);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/content?type=NEWS,ARTICLE&page=${currentPage}&limit=${itemsPerPage}`);
        if (!response.ok) return;
        const data: PaginatedResponse = await response.json();
        setNewsItems(data.contents);
        setTotalPages(data.pagination.pages);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [currentPage]);

  const formatDate = (dateString: string) => {
    return formatVietnamDate(dateString, isEn ? 'en' : 'vi');
  };

  const getCategoryLabel = (category?: string) => {
    if (!category) return '';
    return categoryLabels[category] || category;
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    if (startPage > 1) {
      buttons.push(<button key="1" onClick={() => goToPage(1)} className="rounded border px-3 py-1 hover:bg-gray-100">1</button>);
      if (startPage > 2) buttons.push(<span key="dots-1" className="px-2">...</span>);
    }

    for (let page = startPage; page <= endPage; page += 1) {
      buttons.push(
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={`rounded border px-3 py-1 ${page === currentPage ? 'border-green-700 bg-green-700 text-white' : 'hover:bg-gray-100'}`}
        >
          {page}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) buttons.push(<span key="dots-2" className="px-2">...</span>);
      buttons.push(
        <button key="last" onClick={() => goToPage(totalPages)} className="rounded border px-3 py-1 hover:bg-gray-100">
          {isEn ? 'Last' : 'Cuối'}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="min-h-screen bg-white">
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
            {isEn ? 'Back to home' : 'Về trang chủ'}
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 font-montserrat" style={{ color: '#3C3C3B' }}>
            {isEn ? 'News' : 'Tin tức'}
          </h1>
          <p className="text-lg font-montserrat max-w-3xl" style={{ color: '#6B7280' }}>
            {isEn ? 'Browse the latest stories and updates from the platform' : 'Danh sách các tin tức và cập nhật nổi bật từ nền tảng'}
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(itemsPerPage)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : newsItems.length > 0 ? (
          <div className="space-y-6">
            {newsItems.map((item) => {
              const title = pickLocalizedText(locale, item.title, item.titleEn);
              const description = pickLocalizedText(locale, item.description, item.descriptionEn);

              return (
                <Link key={item.id} href={`/${locale}/news/${item.id}`} className="block group">
                  <article className="bg-white overflow-hidden transition-all duration-300 flex flex-col md:flex-row relative" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
                    <div className="relative h-40 md:h-40 md:w-56 flex-shrink-0 overflow-hidden">
                      {item.thumbnailUrl || item.imageUrl ? (
                        <Image
                          src={item.thumbnailUrl || item.imageUrl || ''}
                          alt={title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <Calendar className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex-1 relative" style={{ minHeight: '120px' }}>
                      <div className="absolute bottom-0 left-0 w-full h-0.5" style={{ backgroundColor: '#E8F5E9' }} />
                      <div
                        className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 ease-out"
                        style={{ backgroundColor: '#0A7029' }}
                      />

                      <div className="flex items-center text-sm mb-2" style={{ color: '#9CA3AF' }}>
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className="font-montserrat font-medium">{formatDate(item.createdAt)}</span>
                      </div>

                      <h2 className="text-lg md:text-xl font-bold mb-2 font-montserrat line-clamp-2" style={{ color: '#3C3C3B' }}>
                        {title}
                      </h2>

                      {description && (
                        <p className="text-sm md:text-base line-clamp-2 mb-3 font-montserrat" style={{ color: '#6B7280' }}>
                          {description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-sm" style={{ color: '#9CA3AF' }}>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{item.viewCount} {isEn ? 'views' : 'lượt xem'}</span>
                        </div>
                        {item.category && (
                          <span className="px-3 py-1 text-xs font-semibold font-montserrat" style={{ backgroundColor: '#E8F5E9', color: '#0A7029' }}>
                            {getCategoryLabel(item.category)}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-white p-12 text-center" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
            <p className="text-lg font-montserrat" style={{ color: '#6B7280' }}>
              {isEn ? 'No news has been published yet' : 'Chưa có tin tức nào được đăng'}
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`rounded border p-2 ${currentPage === 1 ? 'cursor-not-allowed text-gray-400' : 'hover:bg-gray-100'}`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {renderPaginationButtons()}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`rounded border p-2 ${currentPage === totalPages ? 'cursor-not-allowed text-gray-400' : 'hover:bg-gray-100'}`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
