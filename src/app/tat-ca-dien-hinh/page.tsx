'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';

interface DienHinhItem {
  id: string;
  title: string;
  description?: string | null;
  projectUrl?: string | null;
  thumbnailUrl?: string | null;
  imageUrl?: string | null;
  viewCount: number;
  createdAt: string;
}

interface PaginatedResponse {
  contents: DienHinhItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function TatCaDienHinhPage() {
  const [items, setItems] = useState<DienHinhItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/content/dien-hinh?page=${currentPage}&limit=${itemsPerPage}`);
        if (!response.ok) return;

        const data: PaginatedResponse = await response.json();
        setItems(data.contents);
        setTotalPages(data.pagination.pages);
      } catch (error) {
        console.error('Failed to load dien-hinh page:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [currentPage]);

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
        buttons.push(<span key="dots-1" className="px-2">...</span>);
      }
    }

    for (let page = startPage; page <= endPage; page += 1) {
      buttons.push(
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={`px-3 py-1 rounded border ${
            page === currentPage ? 'bg-green-600 text-white border-green-600' : 'hover:bg-gray-100'
          }`}
        >
          {page}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="dots-2" className="px-2">...</span>);
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

      <main className="container mx-auto max-w-6xl px-6 py-20">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Thực hành điển hình
          </h1>
          <p className="mt-3 max-w-3xl text-lg text-gray-600">
            Khám phá toàn bộ các câu chuyện, mô hình và sáng kiến điển hình đang được giới thiệu trên trang chủ.
          </p>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(itemsPerPage)].map((_, index) => (
              <div key={index} className="animate-pulse rounded-2xl bg-white p-4 shadow-sm">
                <div className="mb-4 bg-gray-200" style={{ aspectRatio: '16/9' }} />
                <div className="mb-2 h-5 bg-gray-200" />
                <div className="h-4 w-5/6 bg-gray-100" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center text-gray-500 shadow-sm">
            Chưa có nội dung điển hình.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => {
              const imageSrc = item.thumbnailUrl || item.imageUrl || '';
              const href = item.projectUrl || `/content/${item.id}`;
              const isExternal = Boolean(item.projectUrl);

              return (
                <Link
                  key={item.id}
                  href={href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative bg-gray-100" style={{ aspectRatio: '16/9' }}>
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                        Không có ảnh
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="mb-3 line-clamp-2 text-xl font-bold text-gray-900">
                      {item.title}
                    </h2>
                    {item.description && (
                      <p className="mb-4 line-clamp-4 flex-1 text-sm leading-relaxed text-gray-600">
                        {item.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-sm text-gray-500">
                      <span>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {item.viewCount.toLocaleString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`rounded border p-2 ${
                  currentPage === 1 ? 'cursor-not-allowed text-gray-400' : 'hover:bg-gray-100'
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {renderPaginationButtons()}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`rounded border p-2 ${
                  currentPage === totalPages ? 'cursor-not-allowed text-gray-400' : 'hover:bg-gray-100'
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
