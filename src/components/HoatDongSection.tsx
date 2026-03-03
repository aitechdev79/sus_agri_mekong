'use client';

import Link from 'next/link';
import Image from 'next/image';
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

export default function HoatDongSection() {
  const [items, setItems] = useState<ProjectActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchItems = async () => {
      try {
        const response = await fetch('/api/sections/home/hoat-dong-du-an');
        if (!response.ok) return;
        const data = await response.json();
        if (isMounted) {
          setItems(data || []);
        }
      } catch (error) {
        console.error('Failed to load hoat-dong-du-an items:', error);
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
    <section className="py-20 w-full bg-vn-rice-white">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-16 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black mb-6 md:text-5xl font-montserrat text-left tracking-tight" style={{ color: '#3C3C3B' }}>
              Hoat dong du an
            </h2>
            <p className="text-xl font-montserrat text-left max-w-3xl leading-relaxed" style={{ color: '#6B7280' }}>
              Tim hieu them ve cac du an da va dang thuc hien cua chung toi voi cac doi tac quoc te.
            </p>
          </div>
          <Link
            href="/hoat-dong-du-an"
            className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 font-bold transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            style={{
              backgroundColor: 'transparent',
              borderColor: '#FFC107',
              color: '#3C3C3B',
              boxShadow: '0 4px 12px rgba(255, 193, 7, 0.12)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 193, 7, 0.18)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 193, 7, 0.12)';
            }}
          >
            Xem tat ca
            <span className="text-xl">→</span>
          </Link>
        </div>

        {loading && items.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
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
          <div className="text-sm text-gray-500">Chua co hoat dong du an.</div>
        )}

        {items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
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
                  className="group block flex flex-col w-full h-full max-w-md mx-auto md:max-w-none md:mx-0"
                  aria-label={`${item.title} - ${item.description || ''}`}
                >
                  {imageSrc && (
                    <div className="relative overflow-hidden mb-4" style={{ aspectRatio: '16/9' }}>
                      <Image
                        src={imageSrc}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}

                  <div className="pb-4 relative flex-1 flex flex-col" style={{ minHeight: '160px' }}>
                    <div className="absolute bottom-0 left-0 w-full h-0.5" style={{ backgroundColor: '#E8F5E9' }}></div>
                    <div
                      className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 ease-out"
                      style={{ backgroundColor: '#0A7029' }}
                    ></div>

                    <h3 className="text-lg md:text-xl font-bold mb-2 font-montserrat" style={{ color: '#3C3C3B' }}>
                      {item.title}
                    </h3>
                    {item.undertitle && (
                      <p className="text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: '#6B7280' }}>
                        {item.undertitle}
                      </p>
                    )}
                    {item.description && (
                      <p
                        className="text-sm md:text-base font-montserrat flex-1"
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
      </div>
    </section>
  );
}
