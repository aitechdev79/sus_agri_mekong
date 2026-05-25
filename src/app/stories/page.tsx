import Link from 'next/link';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { formatVietnamDate } from '@/lib/vietnam-time';
import { getPublishedDate } from '@/lib/content-dates';
import { pickLocalizedText, withLocalePrefix } from '@/lib/content-locale';
import { getPublicStoriesPage } from '@/lib/public-content-list';

export const revalidate = 60;

interface PageProps {
  params?: Promise<{ locale?: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function pageHref(page: number, locale: string) {
  const path = withLocalePrefix('/stories', locale);
  return page === 1 ? path : `${path}?page=${page}`;
}

export default async function StoriesPage({ params, searchParams }: PageProps) {
  const routeParams = await params;
  const queryParams = await searchParams;
  const locale = routeParams?.locale === 'en' ? 'en' : 'vi';
  const isEn = locale === 'en';
  const currentPage = Math.max(1, Number(getParam(queryParams?.page) || '1') || 1);
  const itemsPerPage = 5;
  const contentDetailPrefix = withLocalePrefix('/content', locale);

  const { contents: storyItems, pagination } = await getPublicStoriesPage(currentPage, itemsPerPage).catch((error) => {
    console.error('Failed to preload stories page:', error);
    return { contents: [], pagination: { page: 1, limit: itemsPerPage, total: 0, pages: 1 } };
  });

  const pageNumbers = Array.from({ length: pagination.pages }, (_, index) => index + 1).slice(
    Math.max(0, pagination.page - 3),
    Math.max(5, pagination.page + 2)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />

      <main className="container mx-auto px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{isEn ? 'Stories' : 'Điển hình'}</h1>
          </header>

          <div className="rounded-lg bg-white shadow-sm">
            <ul className="divide-y divide-gray-200">
              {storyItems.map((item, index) => {
                const localizedTitle = pickLocalizedText(locale, item.title, item.titleEn);
                const localizedDescription = pickLocalizedText(locale, item.description, item.descriptionEn);

                return (
                  <li key={item.id}>
                    <Link href={`${contentDetailPrefix}/${item.id}`} className="block px-6 py-4 transition-colors hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex min-w-0 flex-1 items-start space-x-3">
                          <span className="mt-1 flex-shrink-0 font-medium text-gray-500">{(pagination.page - 1) * itemsPerPage + index + 1}.</span>
                          <div className="min-w-0 flex-1">
                            <h2 className="text-lg font-medium text-gray-900 transition-colors hover:text-blue-600">{localizedTitle}</h2>
                            {localizedDescription && <p className="mt-1 line-clamp-2 text-sm italic text-gray-600">{localizedDescription}</p>}
                          </div>
                        </div>

                        <div className="ml-4 flex flex-shrink-0 items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4" />
                            {formatVietnamDate(getPublishedDate(item), locale)}
                          </div>
                          <div className="text-gray-400">
                            {item.viewCount} {isEn ? 'views' : 'lượt xem'}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {storyItems.length === 0 && (
              <div className="py-12 text-center text-gray-500">{isEn ? 'No stories available' : 'Không có điển hình nào'}</div>
            )}
          </div>

          {pagination.pages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-2">
                <Link href={pageHref(Math.max(1, pagination.page - 1), locale)} className={`rounded border p-2 ${pagination.page === 1 ? 'pointer-events-none text-gray-400' : 'hover:bg-gray-100'}`}>
                  <ChevronLeft className="h-5 w-5" />
                </Link>
                {pageNumbers.map((page) => (
                  <Link key={page} href={pageHref(page, locale)} className={`rounded border px-3 py-1 ${page === pagination.page ? 'border-blue-600 bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                    {page}
                  </Link>
                ))}
                <Link href={pageHref(Math.min(pagination.pages, pagination.page + 1), locale)} className={`rounded border p-2 ${pagination.page === pagination.pages ? 'pointer-events-none text-gray-400' : 'hover:bg-gray-100'}`}>
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
