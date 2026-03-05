'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { getLocaleFromPathname, pickLocalizedText, withLocalePrefix } from '@/lib/content-locale';

interface CommunityItem {
  id: string;
  title: string;
  titleEn?: string | null;
  description?: string;
  descriptionEn?: string | null;
  type: string;
  thumbnailUrl?: string;
  createdAt: string;
}

export default function CommunityCarousel() {
  const [communityItems, setCommunityItems] = useState<CommunityItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isEn = locale === 'en';

  useEffect(() => {
    const fetchCommunityContent = async () => {
      try {
        const response = await fetch('/api/content/community');
        if (response.ok) setCommunityItems(await response.json());
      } catch (error) {
        console.error('Error fetching community content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityContent();
  }, []);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % communityItems.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + communityItems.length) % communityItems.length);

  if (loading) {
    return (
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8 mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-64" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (communityItems.length === 0) return null;

  return (
    <section className="py-16 bg-blue-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 md:text-4xl">
            {isEn ? 'Community of Practice' : 'Cộng Đồng Thực Hành'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isEn
              ? 'Explore success stories and practical experiences from the community.'
              : 'Khám phá các câu chuyện thành công và kinh nghiệm thực tế từ cộng đồng'}
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {communityItems.map((item, index) => (
                <div key={item.id} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
                    {communityItems.slice(index, index + 3).map((carouselItem) => {
                      const title = pickLocalizedText(locale, carouselItem.title, carouselItem.titleEn);
                      const description = pickLocalizedText(locale, carouselItem.description, carouselItem.descriptionEn);

                      return (
                        <div key={carouselItem.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="relative h-48">
                            {carouselItem.thumbnailUrl ? (
                              <Image src={carouselItem.thumbnailUrl} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500">{isEn ? 'No image' : 'Không có hình ảnh'}</span>
                              </div>
                            )}
                            <div className="absolute top-4 left-4">
                              <span className="px-2 py-1 bg-white bg-opacity-90 text-xs font-medium rounded">{carouselItem.type}</span>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{title}</h3>
                            {description && <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>}
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500 font-montserrat">
                                {new Date(carouselItem.createdAt).toLocaleDateString(isEn ? 'en-US' : 'vi-VN')}
                              </span>
                              <Link href={withLocalePrefix(`/content/${carouselItem.id}`, locale)} className="text-blue-600 hover:text-blue-700 text-sm font-medium font-montserrat">
                                {isEn ? 'Read more' : 'Đọc thêm'}
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {communityItems.length > 3 && (
            <>
              <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow" aria-label={isEn ? 'Previous slide' : 'Slide trước'}>
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow" aria-label={isEn ? 'Next slide' : 'Slide tiếp theo'}>
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            </>
          )}
        </div>

        <div className="text-center mt-12">
          <Link href={withLocalePrefix('/community', locale)} className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors font-montserrat">
            {isEn ? 'View all communities' : 'Xem tất cả cộng đồng'}
          </Link>
        </div>
      </div>
    </section>
  );
}
