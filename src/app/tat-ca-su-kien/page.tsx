import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import NavigationBar from '@/components/NavigationBar';
import MiniEventCalendar from '@/components/MiniEventCalendar';
import Footer from '@/components/Footer';
import { pickLocalizedText, withLocalePrefix } from '@/lib/content-locale';
import { formatVietnamDateTime } from '@/lib/vietnam-time';
import { getPublicEventsPage } from '@/lib/public-content-list';

export const revalidate = 60;

interface PageProps {
  params?: Promise<{ locale?: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getPageHref(page: number, locale: string) {
  const path = withLocalePrefix('/tat-ca-su-kien', locale);
  return page === 1 ? path : `${path}?page=${page}`;
}

function formatEventStart(date: Date | string | null | undefined, locale: string) {
  if (!date) return locale === 'en' ? 'Not scheduled yet' : 'Chưa cập nhật thời gian';
  return formatVietnamDateTime(date, locale);
}

function parseEventDate(value: Date | string | null | undefined) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export default async function TatCaSuKienPage({ params, searchParams }: PageProps) {
  const routeParams = await params;
  const queryParams = await searchParams;
  const currentPage = Math.max(1, Number(getParam(queryParams?.page) || '1') || 1);
  const locale = routeParams?.locale === 'en' ? 'en' : 'vi';
  const isEn = locale === 'en';
  const itemsPerPage = 10;
  const contentDetailPrefix = withLocalePrefix('/content', locale);

  const { contents: items, pagination } = await getPublicEventsPage(currentPage, itemsPerPage).catch((error) => {
    console.error('Failed to preload tat-ca-su-kien page:', error);
    return { contents: [], pagination: { page: 1, limit: itemsPerPage, total: 0, pages: 1 } };
  });

  const calendarEvents = items
    .map((item) => {
      const eventStartAt = parseEventDate(item.eventStartAt);
      if (!eventStartAt) return null;

      return {
        id: item.id,
        title: pickLocalizedText(locale, item.title, item.titleEn),
        date: eventStartAt.toISOString(),
        isPast: eventStartAt.getTime() < Date.now(),
      };
    })
    .filter((item): item is { id: string; title: string; date: string; isPast: boolean } => Boolean(item));

  const pageNumbers = Array.from({ length: pagination.pages }, (_, index) => index + 1).slice(
    Math.max(0, pagination.page - 3),
    Math.max(5, pagination.page + 2)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />

      <main className="container mx-auto max-w-6xl px-6 py-20">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{isEn ? 'All Events' : 'Tất cả sự kiện'}</h1>
          <p className="mt-3 max-w-3xl text-lg text-gray-600">
            {isEn ? 'Track all ongoing and upcoming events on the platform.' : 'Theo dõi đầy đủ các sự kiện đang diễn ra và sắp diễn ra trên hệ thống.'}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div>
            {items.length === 0 ? (
              <div className="bg-white p-12 text-center text-gray-500 shadow-sm">{isEn ? 'No events yet.' : 'Chưa có sự kiện nào.'}</div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => {
                  const imageSrc = item.thumbnailUrl || item.imageUrl || '';
                  const localizedTitle = pickLocalizedText(locale, item.title, item.titleEn);
                  const eventStartAt = parseEventDate(item.eventStartAt);
                  const eventStartTime = eventStartAt?.getTime() ?? Number.NaN;
                  const hasValidEventStart = Number.isFinite(eventStartTime);
                  const isUpcoming = hasValidEventStart ? eventStartTime >= Date.now() : false;

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

                        <div className="flex flex-1 flex-col justify-center">
                          {hasValidEventStart && (
                            <div className="mb-3">
                              <span className="inline-flex rounded-full px-3 py-1 text-xs font-bold font-montserrat text-white" style={{ backgroundColor: isUpcoming ? '#0A7029' : '#F97316' }}>
                                {isUpcoming ? (isEn ? 'Upcoming' : 'Sắp diễn ra') : (isEn ? 'Completed' : 'Đã diễn ra')}
                              </span>
                            </div>
                          )}
                          <h2 className="mb-4 line-clamp-2 text-xl font-bold text-gray-900">{localizedTitle}</h2>

                          <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex items-start gap-2">
                              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                              <span>{item.eventLocation || (isEn ? 'Location pending' : 'Chưa cập nhật địa điểm')}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0" />
                              <span>{formatEventStart(eventStartAt, locale)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className="overflow-hidden bg-[#FFF8DC]" style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)' }}>
              <MiniEventCalendar events={calendarEvents} />
            </div>
          </aside>
        </div>

        {pagination.pages > 1 && (
          <div className="mt-10 flex justify-center">
            <div className="flex items-center space-x-2">
              <Link href={getPageHref(Math.max(1, pagination.page - 1), locale)} className={`rounded border p-2 ${pagination.page === 1 ? 'pointer-events-none text-gray-400' : 'hover:bg-gray-100'}`}>
                <ChevronLeft className="h-5 w-5" />
              </Link>

              {pageNumbers.map((page) => (
                <Link key={page} href={getPageHref(page, locale)} className={`rounded border px-3 py-1 ${page === pagination.page ? 'border-green-600 bg-green-600 text-white' : 'hover:bg-gray-100'}`}>
                  {page}
                </Link>
              ))}

              <Link href={getPageHref(Math.min(pagination.pages, pagination.page + 1), locale)} className={`rounded border p-2 ${pagination.page === pagination.pages ? 'pointer-events-none text-gray-400' : 'hover:bg-gray-100'}`}>
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
