import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { pickLocalizedText, withLocalePrefix } from '@/lib/content-locale';
import { getPublicProjectActivitiesPage } from '@/lib/public-content-list';

export const revalidate = 60;

interface PageProps {
  params?: Promise<{ locale?: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function pageHref(page: number, locale: string) {
  const path = withLocalePrefix('/hoat-dong-du-an', locale);
  return page === 1 ? path : `${path}?page=${page}`;
}

export default async function HoatDongDuAnPage({ params, searchParams }: PageProps) {
  const routeParams = await params;
  const queryParams = await searchParams;
  const locale = routeParams?.locale === 'en' ? 'en' : 'vi';
  const isEn = locale === 'en';
  const currentPage = Math.max(1, Number(getParam(queryParams?.page) || '1') || 1);
  const itemsPerPage = 6;

  const { contents: items, pagination } = await getPublicProjectActivitiesPage(currentPage, itemsPerPage).catch((error) => {
    console.error('Failed to preload project activities page:', error);
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
        <section className="bg-vn-rice-white py-16">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="mb-10">
              <h1 className="font-montserrat text-3xl font-bold text-gray-800 md:text-4xl">
                {isEn ? 'Project Activities' : 'Hoạt động dự án'}
              </h1>
              <p className="mt-3 max-w-3xl font-montserrat text-lg leading-relaxed text-gray-600">
                {isEn
                  ? 'Explore projects we have implemented and are currently delivering with international partners.'
                  : 'Tìm hiểu thêm về các dự án đã và đang thực hiện của chúng tôi với các đối tác quốc tế.'}
              </p>
            </div>

            {items.length === 0 ? (
              <div className="bg-white p-12 text-center text-gray-500 shadow-sm">
                {isEn ? 'No project activities yet.' : 'Chưa có hoạt động dự án.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-3">
                {items.map((item) => {
                  const title = pickLocalizedText(locale, item.title, item.titleEn);
                  const description = pickLocalizedText(locale, item.description, item.descriptionEn);
                  const imageSrc = item.thumbnailUrl || item.imageUrl || '';
                  const href = item.projectUrl || `${withLocalePrefix('/content', locale)}/${item.id}`;

                  return (
                    <Link
                      key={item.id}
                      href={href}
                      target={item.projectUrl ? '_blank' : undefined}
                      rel={item.projectUrl ? 'noopener noreferrer' : undefined}
                      className="group relative mx-auto flex h-full w-full max-w-md flex-col overflow-hidden border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-[#FFB81C] hover:shadow-xl md:mx-0 md:max-w-none"
                      aria-label={`${title} - ${description || ''}`}
                    >
                      <div className="absolute left-0 top-0 h-1 w-full bg-[#FFB81C]" />
                      {imageSrc && (
                        <div className="relative mb-4 mt-1 overflow-hidden" style={{ aspectRatio: '16/9' }}>
                          <Image src={imageSrc} alt={title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(max-width: 768px) 100vw, 33vw" />
                        </div>
                      )}

                      <div className="relative flex flex-1 flex-col pb-4" style={{ minHeight: '160px' }}>
                        <div className="absolute bottom-0 left-0 h-0.5 w-full" style={{ backgroundColor: '#E8F5E9' }} />
                        <div className="absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-500 ease-out group-hover:w-full" style={{ backgroundColor: '#0A7029' }} />

                        <h2 className="mb-2 font-montserrat text-lg font-bold md:text-xl" style={{ color: '#3C3C3B' }}>
                          {title}
                        </h2>
                        {item.undertitle && (
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>
                            {item.undertitle}
                          </p>
                        )}
                        {description && (
                          <p className="flex-1 font-montserrat text-sm md:text-base" style={{ color: '#6B7280', display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {description}
                          </p>
                        )}
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
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
