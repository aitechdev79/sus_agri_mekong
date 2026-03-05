'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { getLocaleFromPathname, pickLocalizedText, withLocalePrefix } from '@/lib/content-locale';

interface DienHinhItem {
  id: string;
  title: string;
  titleEn?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
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
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isEn = locale === 'en';
  const contentDetailPrefix = withLocalePrefix('/content', locale);

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
        <button key="1" onClick={() => goToPage(1)} className="rounded border px-3 py-1 hover:bg-gray-100">
          1
        </button>
      );
      if (startPage > 2) buttons.push(<span key="dots-1" className="px-2">...</span>);
    }

    for (let page = startPage; page <= endPage; page += 1) {
      buttons.push(
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={`rounded border px-3 py-1 ${page === currentPage ? 'border-green-600 bg-green-600 text-white' : 'hover:bg-gray-100'}`}
        >
          {page}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) buttons.push(<span key="dots-2" className="px-2">...</span>);
      buttons.push(
        <button key="last" onClick={() => goToPage(totalPages)} className="rounded border px-3 py-1 hover:bg-gray-100">
          {isEn ? 'Last' : 'Trang cuối'}
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
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{isEn ? 'Best Practice Stories' : 'Thực hành điển hình'}</h1>
          <p className="mt-3 max-w-3xl text-lg text-gray-600">
            {isEn
              ? 'Explore all featured stories, models and initiatives.'
              : 'Khám phá toàn bộ các câu chuyện, mô hình và sáng kiến điển hình.'}
          </p>
        </header>

        {loading ? (
          <div className="space-y-6">
            {[...Array(itemsPerPage)].map((_, index) => (
              <div key={index} className="animate-pulse bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row">
                  <div className="bg-gray-200 md:w-1/4" style={{ aspectRatio: '16/9' }} />
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-gray-200" />
                    <div className="h-4 bg-gray-100" />
                    <div className="h-4 w-5/6 bg-gray-100" />
                    <div className="h-4 w-2/3 bg-gray-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white p-12 text-center text-gray-500 shadow-sm">
            {isEn ? 'No story content yet.' : 'Chưa có nội dung điển hình.'}
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item) => {
              const imageSrc = item.thumbnailUrl || item.imageUrl || '';
              const localizedTitle = pickLocalizedText(locale, item.title, item.titleEn);
              const localizedDescription = pickLocalizedText(locale, item.description, item.descriptionEn);

              return (
                <Link key={item.id} href={`${contentDetailPrefix}/${item.id}`} className="group block overflow-hidden bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex flex-col gap-5 md:flex-row">
                    <div className="relative overflow-hidden bg-gray-100 md:w-1/4" style={{ aspectRatio: '16/9' }}>
                      {imageSrc ? (
                        <Image
                          src={imageSrc}
                          alt={localizedTitle}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 25vw"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">{isEn ? 'No image' : 'Không có ảnh'}</div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h2 className="mb-3 line-clamp-2 text-xl font-bold text-gray-900">{localizedTitle}</h2>
                        {localizedDescription && <p className="line-clamp-4 text-sm leading-relaxed text-gray-600 md:line-clamp-5">{localizedDescription}</p>}
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 text-sm text-gray-500">
                        <span>{new Date(item.createdAt).toLocaleDateString(isEn ? 'en-US' : 'vi-VN')}</span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {item.viewCount.toLocaleString(isEn ? 'en-US' : 'vi-VN')}
                        </span>
                      </div>
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

      <Footer />
    </div>
  );
}
