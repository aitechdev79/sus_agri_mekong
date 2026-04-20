'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getLocaleFromPathname, pickLocalizedText, withLocalePrefix } from '@/lib/content-locale';

interface HomeContentGridItem {
  id: string;
  title: string;
  titleEn?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
  projectUrl?: string | null;
  thumbnailUrl?: string | null;
  imageUrl?: string | null;
  hasContent?: boolean;
}

interface HomeContentGridSectionProps {
  titleVi: string;
  titleEn: string;
  descriptionVi: string;
  descriptionEn: string;
  fetchUrl: string;
  viewAllHref: string;
  emptyVi: string;
  emptyEn: string;
  maxItems?: number;
}

export default function HomeContentGridSection({
  titleVi,
  titleEn,
  descriptionVi,
  descriptionEn,
  fetchUrl,
  viewAllHref,
  emptyVi,
  emptyEn,
  maxItems = 3
}: HomeContentGridSectionProps) {
  const [items, setItems] = useState<HomeContentGridItem[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isEn = locale === 'en';

  useEffect(() => {
    let isMounted = true;

    const fetchItems = async () => {
      try {
        const url = new URL(fetchUrl, window.location.origin);
        url.searchParams.set('limit', String(maxItems));
        url.searchParams.set('_t', String(Date.now()));

        const response = await fetch(url.toString(), {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        if (!response.ok) return;
        const data = await response.json();

        if (isMounted) {
          setItems(Array.isArray(data) ? data.slice(0, maxItems) : []);
        }
      } catch (error) {
        console.error(`Failed to load items from ${fetchUrl}:`, error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchItems();

    return () => {
      isMounted = false;
    };
  }, [fetchUrl, maxItems]);

  return (
    <section className="py-16 bg-vn-rice-white">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-4 md:text-4xl font-montserrat text-left tracking-tight" style={{ color: '#3C3C3B' }}>
              {isEn ? titleEn : titleVi}
            </h2>
            <p className="text-lg font-montserrat text-left max-w-3xl leading-relaxed" style={{ color: '#6B7280' }}>
              {isEn ? descriptionEn : descriptionVi}
            </p>
          </div>

          <Link
            href={withLocalePrefix(viewAllHref, locale)}
            className="inline-flex items-center gap-2 self-start rounded-xl border px-6 py-3 font-bold transition-all duration-300 hover:-translate-y-1 hover:scale-105"
            style={{ backgroundColor: 'transparent', borderColor: '#FFC107', color: '#C28A00' }}
          >
            {isEn ? 'View all' : 'Xem tất cả'}
            <span className="text-xl">→</span>
          </Link>
        </div>

        {loading && items.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
            {[...Array(maxItems)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 mb-4" style={{ aspectRatio: '16/9' }} />
                <div className="h-4 bg-gray-200 mb-2" />
                <div className="h-3 bg-gray-100 w-5/6" />
              </div>
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="text-sm text-gray-500">{isEn ? emptyEn : emptyVi}</div>
        )}

        {items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
            {items.map((item) => {
              const imageSrc = item.thumbnailUrl || item.imageUrl || '';
              const title = pickLocalizedText(locale, item.title, item.titleEn);
              const description = pickLocalizedText(locale, item.description, item.descriptionEn);
              const isExternal = Boolean(item.projectUrl && !item.hasContent);
              const href = isExternal ? item.projectUrl! : withLocalePrefix(`/content/${item.id}`, locale);

              return (
                <Link
                  key={item.id}
                  href={href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="group block flex flex-col"
                  aria-label={`${title} - ${description || ''}`}
                >
                  <div className="relative overflow-hidden mb-4 bg-gray-100" style={{ aspectRatio: '16/9' }}>
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                        {isEn ? 'No image' : 'Không có ảnh'}
                      </div>
                    )}
                  </div>

                  <div className="relative flex h-[180px] flex-col pb-4 md:h-[200px]">
                    <div className="absolute bottom-0 left-0 w-full h-0.5" style={{ backgroundColor: '#E8F5E9' }} />
                    <div className="absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-500 ease-out group-hover:w-full" style={{ backgroundColor: '#0A7029' }} />

                    <h3 className="text-lg md:text-xl font-bold mb-2 font-montserrat" style={{ color: '#3C3C3B' }}>
                      {title}
                    </h3>
                    {description && (
                      <p className="line-clamp-4 flex-1 text-sm md:text-base font-montserrat" style={{ color: '#6B7280' }}>
                        {description}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
