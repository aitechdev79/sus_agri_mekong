'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { getBestImageUrl } from '@/lib/image-utils';

interface NewsItem {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  createdAt: string;
  viewCount: number;
}

export default function NewsSection() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`/api/content/news?_t=${Date.now()}`);
        if (response.ok) {
          const data = await response.json();
          setNewsItems(data); // Show all available news items
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % newsItems.length);
  }, [newsItems.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + newsItems.length) % newsItems.length);
  }, [newsItems.length]);

  // Auto-advance carousel
  useEffect(() => {
    if (newsItems.length <= 1) return;

    const interval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, [newsItems.length, nextSlide]);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8 mx-auto"></div>
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-gray-200 rounded-lg h-80"></div>
              <div className="flex justify-center mt-4 space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-2 h-2 bg-gray-300 rounded-full"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (newsItems.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-12">
          <Link
            href="/news"
            className="inline-block group"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4 md:text-4xl hover:text-blue-600 transition-colors font-montserrat text-left">
              Tin Tức
            </h2>
          </Link>
          <p className="text-lg text-gray-600 font-montserrat text-left max-w-3xl">
            Cập nhật những tin tức và xu hướng mới nhất về nông nghiệp bền vững từ khắp nơi trên thế giới.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-lg">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {newsItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/content/${item.id}`}
                  className="w-full flex-shrink-0 group cursor-pointer"
                >
                  <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Image */}
                    <div className="relative h-64 md:h-80 overflow-hidden">
                      {(() => {
                        // Only use manually uploaded images (thumbnailUrl)
                        let imageUrl = null;

                        // Only check thumbnailUrl (manually uploaded images)
                        if (item.thumbnailUrl) {
                          if (item.thumbnailUrl.includes('/uploads/')) {
                            imageUrl = getBestImageUrl(item.thumbnailUrl, null);
                          } else if (item.thumbnailUrl.startsWith('data:image/')) {
                            // Use data URL directly for uploaded images
                            imageUrl = item.thumbnailUrl;
                          }
                        }

                        return imageUrl ? (
                          imageUrl.startsWith('data:image/') ? (
                            // Use regular img tag for data URLs to avoid Next.js Image optimization issues
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={imageUrl}
                              alt={item.title}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                console.error('Uploaded image failed to load:', imageUrl, e);
                              }}
                            />
                          ) : (
                            // Use Next.js Image for uploaded file URLs
                            <Image
                              src={imageUrl}
                              alt={item.title}
                              fill
                              className="object-contain"
                              onError={(e) => {
                                console.error('Uploaded image failed to load:', imageUrl, e);
                              }}
                            />
                          )
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                            <div className="text-center">
                              <svg className="w-12 h-12 text-green-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="text-green-600 text-sm font-medium">Tin tức</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Date */}
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="font-montserrat">
                          {(() => {
                            const date = new Date(item.createdAt);
                            const day = date.getDate().toString().padStart(2, '0');
                            const month = (date.getMonth() + 1).toString().padStart(2, '0');
                            const year = date.getFullYear();
                            return `${day}/${month}/${year}`;
                          })()}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors font-montserrat">
                        {item.title}
                      </h3>

                      {/* Description */}
                      {item.description && (
                        <p className="text-gray-600 mb-4 line-clamp-2 font-montserrat">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          {newsItems.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 z-10"
                aria-label="Previous news item"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 z-10"
                aria-label="Next news item"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {newsItems.length > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {newsItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-blue-600 scale-110'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to news item ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}