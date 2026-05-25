import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ChevronLeft, ChevronRight, Eye, ArrowLeft } from 'lucide-react';
import NavigationBar from '@/components/NavigationBar';
import { formatVietnamDate } from '@/lib/vietnam-time';
import { getPublishedDate } from '@/lib/content-dates';
import { pickLocalizedText, withLocalePrefix } from '@/lib/content-locale';
import { getPublicNewsPage } from '@/lib/public-content-list';

export const revalidate = 60;

interface PageProps {
  params?: Promise<{ locale?: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function pageHref(page: number, locale: string) {
  const path = withLocalePrefix('/news', locale);
  return page === 1 ? path : `${path}?page=${page}`;
}

export default async function NewsPage({ params, searchParams }: PageProps) {
  const routeParams = await params;
  const queryParams = await searchParams;
  const locale = routeParams?.locale === 'en' ? 'en' : 'vi';
  const isEn = locale === 'en';
  const currentPage = Math.max(1, Number(getParam(queryParams?.page) || '1') || 1);
  const itemsPerPage = 10;

  const { contents: newsItems, pagination } = await getPublicNewsPage(currentPage, itemsPerPage).catch((error) => {
    console.error('Failed to preload news page:', error);
    return { contents: [], pagination: { page: 1, limit: itemsPerPage, total: 0, pages: 1 } };
  });

  const pageNumbers = Array.from({ length: pagination.pages }, (_, index) => index + 1).slice(
    Math.max(0, pagination.page - 3),
    Math.max(5, pagination.page + 2)
  );

  return (
    <div className="min-h-screen bg-white">
      {routeParams?.locale ? (
        <header className="border-b bg-white" style={{ borderColor: '#E8F5E9' }}>
          <div className="container mx-auto px-6 py-4">
            <Link href={`/${locale}`} className="inline-flex items-center font-montserrat font-semibold transition-colors" style={{ color: '#0A7029' }}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {isEn ? 'Back to home' : 'Về trang chủ'}
            </Link>
          </div>
        </header>
      ) : (
        <NavigationBar />
      )}

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="mb-2 font-montserrat text-3xl font-bold md:text-4xl" style={{ color: '#3C3C3B' }}>
            {isEn ? 'News' : 'Tin tức'}
          </h1>
          <p className="max-w-3xl font-montserrat text-lg" style={{ color: '#6B7280' }}>
            {isEn ? 'Browse the latest stories and updates from the platform' : 'Danh sách các tin tức và cập nhật nổi bật từ nền tảng'}
          </p>
        </div>

        {newsItems.length > 0 ? (
          <div className="space-y-6">
            {newsItems.map((item) => {
              const title = pickLocalizedText(locale, item.title, item.titleEn);
              const description = pickLocalizedText(locale, item.description, item.descriptionEn);
              const imageSrc = item.thumbnailUrl || item.imageUrl || '';

              return (
                <Link key={item.id} href={`${withLocalePrefix('/news', locale)}/${item.id}`} className="group block">
                  <article className="relative flex flex-col overflow-hidden bg-white transition-all duration-300 md:flex-row" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
                    <div className="relative h-40 flex-shrink-0 overflow-hidden md:h-40 md:w-56">
                      {imageSrc ? (
                        <Image src={imageSrc} alt={title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100">
                          <Calendar className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="relative flex-1 p-6" style={{ minHeight: '120px' }}>
                      <div className="absolute bottom-0 left-0 h-0.5 w-full" style={{ backgroundColor: '#E8F5E9' }} />
                      <div className="absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-500 ease-out group-hover:w-full" style={{ backgroundColor: '#0A7029' }} />

                      <div className="mb-2 flex items-center text-sm" style={{ color: '#9CA3AF' }}>
                        <Calendar className="mr-1 h-4 w-4" />
                        <span className="font-montserrat font-medium">{formatVietnamDate(getPublishedDate(item), locale)}</span>
                      </div>

                      <h2 className="mb-2 line-clamp-2 font-montserrat text-lg font-bold md:text-xl" style={{ color: '#3C3C3B' }}>
                        {title}
                      </h2>

                      {description && (
                        <p className="mb-3 line-clamp-2 font-montserrat text-sm md:text-base" style={{ color: '#6B7280' }}>
                          {description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-sm" style={{ color: '#9CA3AF' }}>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{item.viewCount} {isEn ? 'views' : 'lượt xem'}</span>
                        </div>
                        {item.category && (
                          <span className="px-3 py-1 text-xs font-semibold font-montserrat" style={{ backgroundColor: '#E8F5E9', color: '#0A7029' }}>
                            {item.category}
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
            <p className="font-montserrat text-lg" style={{ color: '#6B7280' }}>
              {isEn ? 'No news has been published yet' : 'Chưa có tin tức nào được đăng'}
            </p>
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="mt-10 flex justify-center">
            <div className="flex items-center space-x-2">
              <Link href={pageHref(Math.max(1, pagination.page - 1), locale)} className={`rounded border p-2 ${pagination.page === 1 ? 'pointer-events-none text-gray-400' : 'hover:bg-gray-100'}`}>
                <ChevronLeft className="h-5 w-5" />
              </Link>
              {pageNumbers.map((page) => (
                <Link key={page} href={pageHref(page, locale)} className={`rounded border px-3 py-1 ${page === pagination.page ? 'border-green-700 bg-green-700 text-white' : 'hover:bg-gray-100'}`}>
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
    </div>
  );
}
