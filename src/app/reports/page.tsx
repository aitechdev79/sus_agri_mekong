import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, FileText, Search } from 'lucide-react';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { pickLocalizedText, withLocalePrefix } from '@/lib/content-locale';
import { getPublicReportsPage } from '@/lib/public-content-list';

export const revalidate = 60;

interface PageProps {
  params?: Promise<{ locale?: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function pageHref(page: number, searchTerm: string, locale: string) {
  const path = withLocalePrefix('/reports', locale);
  const params = new URLSearchParams();
  if (page > 1) params.set('page', String(page));
  if (searchTerm) params.set('search', searchTerm);
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

export default async function ReportsPage({ params, searchParams }: PageProps) {
  const routeParams = await params;
  const queryParams = await searchParams;
  const locale = routeParams?.locale === 'en' ? 'en' : 'vi';
  const isEn = locale === 'en';
  const contentDetailPrefix = withLocalePrefix('/content', locale);
  const currentPage = Math.max(1, Number(getParam(queryParams?.page) || '1') || 1);
  const searchTerm = (getParam(queryParams?.search) || '').trim();
  const itemsPerPage = 6;

  const { contents: documents, pagination } = await getPublicReportsPage(currentPage, itemsPerPage, searchTerm).catch((error) => {
    console.error('Failed to preload report documents:', error);
    return { contents: [], pagination: { page: 1, limit: itemsPerPage, total: 0, pages: 1 } };
  });

  const pageNumbers = Array.from({ length: pagination.pages }, (_, index) => index + 1).slice(
    Math.max(0, pagination.page - 3),
    Math.max(5, pagination.page + 2)
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="relative z-50">
        <NavigationBar />
      </div>

      <main className="pt-16">
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 py-20 text-white">
          <div className="absolute inset-0 opacity-10">
            <Image src="/vecteezy_topo_34242655.svg" alt="Background pattern" fill className="object-cover" priority={false} />
          </div>
          <div className="container relative z-10 mx-auto max-w-6xl px-6">
            <div className="max-w-4xl">
              <h1 className="font-montserrat text-4xl font-bold md:text-5xl">
                {isEn ? 'Research & Reports Library' : 'Thư viện Nghiên cứu & Báo cáo'}
              </h1>
              <p className="mt-6 max-w-3xl font-montserrat text-lg leading-relaxed text-indigo-100 md:text-xl">
                {isEn
                  ? 'A curated collection of research documents, reports, and publications for quick reference.'
                  : 'Tổng hợp các tài liệu nghiên cứu, báo cáo và ấn phẩm chuyên sâu để tra cứu nhanh.'}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white py-12">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-montserrat text-3xl font-bold text-gray-900">{isEn ? 'Documents' : 'Tài liệu'}</h2>
                <p className="mt-2 font-montserrat text-sm text-gray-500">
                  {isEn ? `Found ${pagination.total} documents` : `Tìm thấy ${pagination.total} tài liệu`}
                  {searchTerm ? (isEn ? ` for "${searchTerm}"` : ` cho "${searchTerm}"`) : ''}
                </p>
              </div>

              <form action={withLocalePrefix('/reports', locale)} className="w-full md:w-[380px]">
                <div className="flex items-center justify-end gap-2">
                  <div className="relative w-full">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="search"
                      defaultValue={searchTerm}
                      placeholder={isEn ? 'Search documents...' : 'Tìm kiếm tài liệu...'}
                      className="w-full rounded-md border border-gray-300 py-2.5 pl-10 pr-4 font-montserrat text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2.5 font-montserrat text-sm font-semibold text-white hover:bg-indigo-700">
                    {isEn ? 'Search' : 'Tìm'}
                  </button>
                </div>
              </form>
            </div>

            {documents.length === 0 ? (
              <div className="border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
                <h3 className="font-montserrat text-xl font-bold text-gray-700">{isEn ? 'No documents yet' : 'Chưa có tài liệu nào'}</h3>
                <p className="mt-2 font-montserrat text-sm text-gray-500">
                  {isEn ? 'Published document contents will appear here.' : 'Khi có nội dung loại Tài liệu được xuất bản, danh sách sẽ hiển thị tại đây.'}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  {documents.map((document) => {
                    const href = document.fileUrl || `${contentDetailPrefix}/${document.id}`;
                    const previewImage = document.thumbnailUrl || document.imageUrl;
                    const localizedTitle = pickLocalizedText(locale, document.title, document.titleEn);
                    const localizedDescription = pickLocalizedText(locale, document.description, document.descriptionEn);

                    return (
                      <Link
                        key={document.id}
                        href={href}
                        target={document.fileUrl ? '_blank' : undefined}
                        rel={document.fileUrl ? 'noreferrer' : undefined}
                        className="group flex h-full min-h-[360px] flex-col overflow-hidden border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                      >
                        <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                          {previewImage ? (
                            <Image src={previewImage} alt={localizedTitle} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                              <FileText className="h-12 w-12 text-slate-400" />
                            </div>
                          )}
                        </div>

                        <div className="flex flex-1 flex-col p-5">
                          <h3 className="line-clamp-2 font-montserrat text-lg font-bold text-gray-900 transition-colors group-hover:text-indigo-700">
                            {localizedTitle}
                          </h3>
                          <p className="mt-3 line-clamp-3 font-montserrat text-sm leading-6 text-gray-600">
                            {localizedDescription?.trim() || (isEn ? 'Short description is being updated.' : 'Tài liệu đang được cập nhật mô tả ngắn.')}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {pagination.pages > 1 && (
                  <div className="mt-10 flex justify-center">
                    <div className="flex items-center gap-2">
                      <Link href={pageHref(Math.max(1, pagination.page - 1), searchTerm, locale)} className={`flex h-10 w-10 items-center justify-center rounded-md border ${pagination.page === 1 ? 'pointer-events-none border-gray-200 text-gray-300' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                        <ChevronLeft className="h-5 w-5" />
                      </Link>

                      {pageNumbers.map((page) => (
                        <Link key={page} href={pageHref(page, searchTerm, locale)} className={`flex h-10 min-w-10 items-center justify-center rounded-md border px-3 text-sm font-semibold transition-colors ${page === pagination.page ? 'border-indigo-700 bg-indigo-700 text-white' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}>
                          {page}
                        </Link>
                      ))}

                      <Link href={pageHref(Math.min(pagination.pages, pagination.page + 1), searchTerm, locale)} className={`flex h-10 w-10 items-center justify-center rounded-md border ${pagination.page === pagination.pages ? 'pointer-events-none border-gray-200 text-gray-300' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                        <ChevronRight className="h-5 w-5" />
                      </Link>
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
