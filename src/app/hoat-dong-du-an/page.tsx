'use client';

import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ProjectActivityItem {
  id: string;
  title: string;
  undertitle?: string | null;
  description?: string | null;
  projectUrl?: string | null;
  thumbnailUrl?: string | null;
  imageUrl?: string | null;
}

interface PaginatedResponse {
  contents: ProjectActivityItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function HoatDongDuAnPage() {
  const [items, setItems] = useState<ProjectActivityItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/content/hoat-dong-du-an?page=${currentPage}&limit=${itemsPerPage}`);
        if (!response.ok) return;

        const data: PaginatedResponse = await response.json();
        setItems(data.contents);
        setTotalPages(data.pagination.pages);
      } catch (error) {
        console.error('Failed to load hoat-dong-du-an page:', error);
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
          className="rounded border px-3 py-1 hover:bg-gray-100"
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
          className={`rounded border px-3 py-1 ${
            page === currentPage ? 'border-green-600 bg-green-600 text-white' : 'hover:bg-gray-100'
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
          className="rounded border px-3 py-1 hover:bg-gray-100"
        >
          Trang cuối
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="relative z-50">
        <NavigationBar />
      </div>

      <main className="pt-16">
        <section className="bg-vn-rice-white py-16">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="mb-10">
              <h1 className="text-3xl font-bold font-montserrat text-gray-800 md:text-4xl">
                Hoạt động dự án
              </h1>
              <p className="mt-3 max-w-3xl text-lg font-montserrat leading-relaxed text-gray-600">
                Tìm hiểu thêm về các dự án đã và đang thực hiện của chúng tôi với các đối tác quốc tế.
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-3">
                {[...Array(itemsPerPage)].map((_, index) => (
                  <div key={index} className="animate-pulse bg-white p-5">
                    <div className="mb-4 bg-gray-200" style={{ aspectRatio: '16/9' }} />
                    <div className="mb-2 h-6 bg-gray-200" />
                    <div className="mb-2 h-4 w-1/3 bg-gray-100" />
                    <div className="h-4 w-5/6 bg-gray-100" />
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="bg-white p-12 text-center text-gray-500 shadow-sm">
                Chưa có hoạt động dự án.
              </div>
            ) : (
              <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-3">
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
                      className="group mx-auto flex h-full w-full max-w-md flex-col bg-white p-5 md:mx-0 md:max-w-none"
                      aria-label={`${item.title} - ${item.description || ''}`}
                    >
                      {imageSrc && (
                        <div className="relative mb-4 overflow-hidden" style={{ aspectRatio: '16/9' }}>
                          <Image
                            src={imageSrc}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                      )}

                      <div className="relative flex flex-1 flex-col pb-4" style={{ minHeight: '160px' }}>
                        <div className="absolute bottom-0 left-0 h-0.5 w-full" style={{ backgroundColor: '#E8F5E9' }}></div>
                        <div
                          className="absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-500 ease-out group-hover:w-full"
                          style={{ backgroundColor: '#0A7029' }}
                        ></div>

                        <h2 className="mb-2 text-lg font-bold font-montserrat md:text-xl" style={{ color: '#3C3C3B' }}>
                          {item.title}
                        </h2>
                        {item.undertitle && (
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>
                            {item.undertitle}
                          </p>
                        )}
                        {item.description && (
                          <p
                            className="flex-1 text-sm font-montserrat md:text-base"
                            style={{
                              color: '#6B7280',
                              display: '-webkit-box',
                              WebkitLineClamp: 5,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {item.description}
                          </p>
                        )}
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
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
