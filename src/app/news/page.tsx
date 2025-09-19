'use client';

import Link from 'next/link';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NewsItem {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  viewCount: number;
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
      const response = await fetch(`/api/content?type=NEWS&page=${page}&limit=${itemsPerPage}`);
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
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

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
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Về trang chủ
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
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
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <span className="text-gray-500 font-medium flex-shrink-0 mt-1">
                            {(currentPage - 1) * itemsPerPage + index + 1}.
                          </span>
                          <div className="flex-1 min-w-0">
                            <h2 className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors">
                              {item.title}
                            </h2>
                            {item.description && (
                              <p className="text-sm text-gray-600 italic mt-1 line-clamp-2">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Meta info */}
                        <div className="flex items-center space-x-4 text-sm text-gray-500 ml-4 flex-shrink-0">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(item.createdAt)}
                          </div>
                          <div className="text-gray-400">
                            {item.viewCount} lượt xem
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