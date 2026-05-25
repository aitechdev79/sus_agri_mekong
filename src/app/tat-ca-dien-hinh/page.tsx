import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { pickLocalizedText, withLocalePrefix } from '@/lib/content-locale';
import { formatVietnamDate } from '@/lib/vietnam-time';
import { getPublishedDate } from '@/lib/content-dates';
import { getPublicFeaturedStoriesPage } from '@/lib/public-content-list';

export const revalidate = 60;

interface PageProps {
  params?: Promise<{ locale?: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function pageHref(page: number, locale: string) {
  const path = withLocalePrefix('/tat-ca-dien-hinh', locale);
  return page === 1 ? path : `${path}?page=${page}`;
}

export default async function TatCaDienHinhPage({ params, searchParams }: PageProps) {
  const routeParams = await params;
  const queryParams = await searchParams;
  const locale = routeParams?.locale === 'en' ? 'en' : 'vi';
  const isEn = locale === 'en';
  const currentPage = Math.max(1, Number(getParam(queryParams?.page) || '1') || 1);
  const itemsPerPage = 10;
  const contentDetailPrefix = withLocalePrefix('/content', locale);

  const { contents: items, pagination } = await getPublicFeaturedStoriesPage(currentPage, itemsPerPage).catch((error) => {
    console.error('Failed to preload featured stories page:', error);
    return { contents: [], pagination: { page: 1, limit: itemsPerPage, total: 0, pages: 1 } };
  });

  const pageNumbers = Array.from({ length: pagination.pages }, (_, index) => index + 1).slice(
    Math.max(0, pagination.page - 3),
    Math.max(5, pagination.page + 2)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />

      <main className="container mx-auto max-w-6xl px-6 py-20">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{isEn ? 'Best Practice Stories' : 'Thực hành điển hình'}</h1>
          <p className="mt-3 max-w-3xl text-lg text-gray-600">
            {isEn ? 'Explore all featured stories, models and initiatives.' : 'Khám phá toàn bộ các câu chuyện, mô hình và sáng kiến điển hình.'}
          </p>
        </header>

        {items.length === 0 ? (
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
                        <Image src={imageSrc} alt={localizedTitle} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 25vw" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">{isEn ? 'No image' : 'Không có ảnh'}</div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h2 className="mb-3 line-clamp-2 text-xl font-bold text-gray-900">{localizedTitle}</h2>
                        {localizedDescription && <p className="line-clamp-4 text-sm leading-relaxed text-gray-600 md:line-clamp-5">{localizedDescription}</p>}
                      </div>

                      <div className="mt-5 flex items-center justify-between pt-4 text-sm text-gray-500">
                        <span>{formatVietnamDate(getPublishedDate(item), locale)}</span>
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

        {pagination.pages > 1 && (
          <div className="mt-10 flex justify-center">
            <div className="flex items-center space-x-2">
              <Link href={pageHref(Math.max(1, pagination.page - 1), locale)} className={`rounded border p-2 ${pagination.page === 1 ? 'pointer-events-none text-gray-400' : 'hover:bg-gray-100'}`}>
                <ChevronLeft className="h-5 w-5" />
              </Link>
              {pageNumbers.map((page) => (
                <Link key={page} href={pageHref(page, locale)} className={`rounded border px-3 py-1 ${page === pagination.page ? 'border-green-600 bg-green-600 text-white' : 'hover:bg-gray-100'}`}>
                  {page}
                </Link>
              ))}
              <Link href={pageHref(Math.min(pagination.pages, pagination.page + 1), locale)} className={`rounded border p-2 ${pagination.page === pagination.pages ? 'pointer-events-none text-gray-400' : 'hover:bg-gray-100'}`}>
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
