'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import NavigationBar from '@/components/NavigationBar';

interface NewsItem {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  viewCount: number;
  thumbnailUrl?: string;
  imageUrl?: string;
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

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />

      <main className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Tin Tức
            </h1>
          </header>

          {/* News List */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 animate-pulse rounded"></div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm">
              <ul className="divide-y divide-gray-200">
                {newsItems.map((item, index) => (
                  <li key={item.id}>
                    <Link
                      href={`/content/${item.id}`}
                      className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {/* Number */}
                        <span className="text-gray-500 font-medium flex-shrink-0">
                          {(currentPage - 1) * itemsPerPage + index + 1}.
                        </span>

                        {/* Thumbnail Image */}
                        <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                          {item.thumbnailUrl || item.imageUrl ? (
                            <Image
                              src={item.thumbnailUrl || item.imageUrl || ''}
                              alt={item.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 80px, 96px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <Calendar className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h2 className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                            {item.title}
                          </h2>
                          {item.description && (
                            <p className="text-sm text-gray-600 italic mt-1 line-clamp-1 md:line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>

                        {/* Meta info - Date and Views in same cell */}
                        <div className="flex-shrink-0 text-right">
                          <div className="flex items-center text-sm text-gray-500 mb-1">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span className="hidden md:inline">{formatDate(item.createdAt)}</span>
                            <span className="md:hidden">{formatDate(item.createdAt).substring(0, 5)}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-400 justify-end">
                            <Eye className="w-4 h-4 mr-1" />
                            <span>{item.viewCount}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>

              {newsItems.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  Không có tin tức nào
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded border ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {renderPaginationButtons()}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded border ${
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}