'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface DienHinhItem {
  id: string;
  title: string;
  description?: string | null;
  projectUrl?: string | null;
  thumbnailUrl?: string | null;
  imageUrl?: string | null;
}

export default function DienHinhSection() {
  const [items, setItems] = useState<DienHinhItem[]>([]);
  const [loading, setLoading] = useState(true);

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
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4 md:text-4xl font-montserrat text-left" style={{ color: '#3C3C3B' }}>
            Thuc hanh dien hinh - Lan toa gia tri
          </h2>
          <p className="text-lg font-montserrat text-left max-w-3xl" style={{ color: '#6B7280' }}>
            Kham pha nhung cau chuyen thanh cong va mo hinh, sang kien dien hinh trong phat trien ben vung tai Viet Nam
          </p>
        </div>

        {loading && items.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-end">
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
          <div className="text-sm text-gray-500">Chua co noi dung dien hinh.</div>
        )}

        {items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-end">
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
                  className="group block flex flex-col"
                  aria-label={`${item.title} - ${item.description || ''}`}
                >
                  <div className="relative overflow-hidden mb-4 bg-gray-100" style={{ aspectRatio: '16/9' }}>
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                        Khong co anh
                      </div>
                    )}
                  </div>

                  <div className="pb-4 relative flex-1 flex flex-col" style={{ minHeight: '120px' }}>
                    <div className="absolute bottom-0 left-0 w-full h-0.5" style={{ backgroundColor: '#E8F5E9' }}></div>
                    <div
                      className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 ease-out"
                      style={{ backgroundColor: '#0A7029' }}
                    ></div>

                    <h3 className="text-lg md:text-xl font-bold mb-2 font-montserrat" style={{ color: '#3C3C3B' }}>
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm md:text-base font-montserrat flex-1" style={{ color: '#6B7280' }}>
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
