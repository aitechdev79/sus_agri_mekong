'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import NavigationBar from '@/components/NavigationBar';
import { usePublicCategories } from '@/hooks/use-public-categories';
import { formatVietnamDate } from '@/lib/vietnam-time';

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
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const { categoryLabels } = usePublicCategories();

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
    return formatVietnamDate(dateString);
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
          className={`rounded border px-3 py-1 ${page === currentPage ? 'border-blue-700 bg-blue-700 text-white' : 'hover:bg-gray-100'}`}
        >
          {page}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) buttons.push(<span key="dots-2" className="px-2">...</span>);
      buttons.push(
        <button key="last" onClick={() => goToPage(totalPages)} className="rounded border px-3 py-1 hover:bg-gray-100">
          Cuối
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #1e40af, #1e3a8a)' }}>
      <NavigationBar />

      <main className="container mx-auto px-6 py-20">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2 font-montserrat">
            TIN TỨC
          </h1>
          <p className="text-lg text-white/90 font-montserrat max-w-3xl">
            Danh sách các tin tức và cập nhật nổi bật từ nền tảng
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(itemsPerPage)].map((_, i) => (
              <div key={i} className="h-32 bg-white/20 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : newsItems.length > 0 ? (
          <div className="space-y-4">
            {newsItems.map((item) => (
              <Link key={item.id} href={`/news/${item.id}`} className="block group">
                <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col md:flex-row">
                  <div className="relative h-32 md:h-32 md:w-48 flex-shrink-0">
                    {item.thumbnailUrl || item.imageUrl ? (
                      <Image
                        src={item.thumbnailUrl || item.imageUrl || ''}
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

                  <div className="p-4 flex-1">
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span className="font-montserrat">{formatDate(item.createdAt)}</span>
                    </div>

                    <h2 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors font-montserrat line-clamp-2">
                      {item.title}
                    </h2>

                    {item.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 font-montserrat">
                        {item.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{item.viewCount} lượt xem</span>
                      </div>
                      {item.category && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          {getCategoryLabel(item.category)}
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
