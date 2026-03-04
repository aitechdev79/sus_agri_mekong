'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, FileText, Search } from 'lucide-react';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { ContentListResponse } from '@/types/content';

interface ReportDocument {
  id: string;
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  imageUrl?: string | null;
  fileUrl?: string | null;
}

export default function ReportsPage() {
  const [documents, setDocuments] = useState<ReportDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);

      try {
        const params = new URLSearchParams({
          type: 'DOCUMENT',
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
        });

        if (searchTerm) {
          params.append('search', searchTerm);
        }

        const response = await fetch(`/api/content?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch documents');
        }

        const data: ContentListResponse<ReportDocument> = await response.json();
        setDocuments(data.contents);
        setTotalPages(data.pagination.pages || 1);
        setTotalDocuments(data.pagination.total || 0);
      } catch (error) {
        console.error('Failed to load report documents:', error);
        setDocuments([]);
        setTotalPages(1);
        setTotalDocuments(0);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [currentPage, searchTerm]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCurrentPage(1);
    setSearchTerm(searchInput.trim());
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let page = startPage; page <= endPage; page += 1) {
      buttons.push(
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={`h-10 min-w-10 rounded-md border px-3 text-sm font-semibold transition-colors ${
            page === currentPage
              ? 'border-indigo-700 bg-indigo-700 text-white'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {page}
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
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 py-20 text-white">
          <div className="absolute inset-0 opacity-10">
            <Image
              src="/vecteezy_topo_34242655.svg"
              alt="Background pattern"
              fill
              className="object-cover"
              priority={false}
            />
          </div>

          <div className="container relative z-10 mx-auto max-w-6xl px-6">
            <div className="max-w-4xl">
              <h1 className="font-montserrat text-4xl font-bold md:text-5xl">
                Thư viện Nghiên cứu & Báo cáo
              </h1>
              <p className="mt-6 max-w-3xl font-montserrat text-lg leading-relaxed text-indigo-100 md:text-xl">
                Tổng hợp các tài liệu nghiên cứu, báo cáo và ấn phẩm chuyên sâu để bạn tra cứu nhanh
                theo từng nội dung đã được xuất bản trên hệ thống.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white py-12">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-montserrat text-3xl font-bold text-gray-900">
                  Tài liệu
                </h2>
                {!loading && (
                  <p className="mt-2 font-montserrat text-sm text-gray-500">
                    Tìm thấy {totalDocuments} tài liệu
                    {searchTerm ? ` cho "${searchTerm}"` : ''}
                  </p>
                )}
              </div>

              <form onSubmit={handleSearchSubmit} className="w-full md:w-[380px]">
                <div className="flex items-center justify-end gap-2">
                  <div className="relative w-full">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(event) => setSearchInput(event.target.value)}
                      placeholder="Tìm kiếm tài liệu..."
                      className="w-full rounded-md border border-gray-300 py-2.5 pl-10 pr-4 font-montserrat text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-4 py-2.5 font-montserrat text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    Tìm
                  </button>
                </div>
              </form>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {Array.from({ length: itemsPerPage }).map((_, index) => (
                  <div
                    key={index}
                    className="h-52 animate-pulse rounded-2xl border border-gray-200 bg-gray-100"
                  />
                ))}
              </div>
            ) : documents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
                <h3 className="font-montserrat text-xl font-bold text-gray-700">
                  Chưa có tài liệu nào
                </h3>
                <p className="mt-2 font-montserrat text-sm text-gray-500">
                  Khi có nội dung loại Tài liệu được xuất bản, danh sách sẽ hiển thị tại đây.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  {documents.map((document) => {
                    const href = document.fileUrl || `/content/${document.id}`;
                    const previewImage = document.thumbnailUrl || document.imageUrl;

                    return (
                      <Link
                        key={document.id}
                        href={href}
                        target={document.fileUrl ? '_blank' : undefined}
                        rel={document.fileUrl ? 'noreferrer' : undefined}
                        className="group flex h-full min-h-[360px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                      >
                        <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                          {previewImage ? (
                            <Image
                              src={previewImage}
                              alt={document.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                              <FileText className="h-12 w-12 text-slate-400" />
                            </div>
                          )}
                        </div>

                        <div className="flex flex-1 flex-col p-5">
                          <h3 className="line-clamp-2 font-montserrat text-lg font-bold text-gray-900 transition-colors group-hover:text-indigo-700">
                            {document.title}
                          </h3>
                          <p className="mt-3 line-clamp-3 font-montserrat text-sm leading-6 text-gray-600">
                            {document.description?.trim() || 'Tài liệu đang được cập nhật mô tả ngắn.'}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="mt-10 flex justify-center">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`flex h-10 w-10 items-center justify-center rounded-md border ${
                          currentPage === 1
                            ? 'cursor-not-allowed border-gray-200 text-gray-300'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      {renderPaginationButtons()}

                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`flex h-10 w-10 items-center justify-center rounded-md border ${
                          currentPage === totalPages
                            ? 'cursor-not-allowed border-gray-200 text-gray-300'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

