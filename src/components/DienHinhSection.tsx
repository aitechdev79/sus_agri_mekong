'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getLocaleFromPathname, pickLocalizedText } from '@/lib/content-locale';

interface DienHinhItem {
  id: string;
  title: string;
  titleEn?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
  thumbnailUrl?: string | null;
  imageUrl?: string | null;
}

export default function DienHinhSection() {
  const [items, setItems] = useState<DienHinhItem[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const localizedContentPrefix = locale === 'en' || locale === 'vi' ? `/${locale}` : '';
  const allStoriesHref = `${localizedContentPrefix}/tat-ca-dien-hinh`;

  useEffect(() => {
    let isMounted = true;

    const fetchItems = async () => {
      try {
        const response = await fetch('/api/sections/home/dien-hinh');
        if (!response.ok) return;
        const data = await response.json();
        if (isMounted) {
          setItems(data || []);
        }
      } catch (error) {
        console.error('Failed to load dien-hinh items:', error);
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
  }, []);

  return (
    <section className="py-16 bg-vn-rice-white">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-4 md:text-4xl font-montserrat text-left" style={{ color: '#3C3C3B' }}>
              Thực hành điển hình - Lan tỏa giá trị
            </h2>
            <p className="text-lg font-montserrat text-left max-w-3xl" style={{ color: '#6B7280' }}>
              Khám phá những câu chuyện thành công và mô hình, sáng kiến điển hình trong phát triển bền vững tại Việt Nam
            </p>
          </div>

          <Link
            href={allStoriesHref}
            className="inline-flex items-center gap-2 self-start rounded-xl border px-6 py-3 font-bold transition-all duration-300 hover:-translate-y-1 hover:scale-105"
            style={{
              backgroundColor: 'transparent',
              borderColor: '#FFC107',
              color: '#C28A00',
            }}
          >
            Xem tất cả
            <span className="text-xl">→</span>
          </Link>
        </div>

        {loading && items.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 mb-4" style={{ aspectRatio: '16/9' }} />
                <div className="h-4 bg-gray-200 mb-2" />
                <div className="h-3 bg-gray-100 w-5/6" />
              </div>
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="text-sm text-gray-500">Chưa có nội dung điển hình.</div>
        )}

        {items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
            {items.map((item) => {
              const imageSrc = item.thumbnailUrl || item.imageUrl || '';
              const title = pickLocalizedText(locale, item.title, item.titleEn);
              const description = pickLocalizedText(locale, item.description, item.descriptionEn);
              const href = `${localizedContentPrefix}/content/${item.id}`;

              return (
                <Link
                  key={item.id}
                  href={href}
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
                        Không có ảnh
                      </div>
                    )}
                  </div>

                  <div className="relative flex h-[180px] flex-col pb-4 md:h-[200px]">
                    <div className="absolute bottom-0 left-0 w-full h-0.5" style={{ backgroundColor: '#E8F5E9' }}></div>
                    <div
                      className="absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-500 ease-out group-hover:w-full"
                      style={{ backgroundColor: '#0A7029' }}
                    ></div>

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
