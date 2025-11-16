'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { getBestImageUrl } from '@/lib/image-utils';

interface StoryItem {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  createdAt: string;
  viewCount: number;
}

export default function DienHinhSection() {
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [resetTimer, setResetTimer] = useState(0);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch(`/api/content/stories?_t=${Date.now()}`);
        if (response.ok) {
          const data = await response.json();
          setStories(data);
        }
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      // For 3-item display, max index is length - 3
      const maxIndex = Math.max(0, stories.length - 3);
      return prev >= maxIndex ? 0 : prev + 1;
    });
  }, [stories.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, stories.length - 3);
      return prev <= 0 ? maxIndex : prev - 1;
    });
  }, [stories.length]);

  const handleNextSlide = useCallback(() => {
    nextSlide();
    setResetTimer(prev => prev + 1); // Reset timer
  }, [nextSlide]);

  const handlePrevSlide = useCallback(() => {
    prevSlide();
    setResetTimer(prev => prev + 1); // Reset timer
  }, [prevSlide]);

  // Auto-advance carousel
  useEffect(() => {
    if (stories.length <= 1) return;

    const interval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, [stories.length, nextSlide, resetTimer]);

  if (loading) {
    return (
      <section className="py-16 bg-green-50">
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

  if (stories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-green-50">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-12">
          <Link
            href="/dien-hinh"
            className="inline-block group"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4 md:text-4xl hover:text-green-600 transition-colors font-montserrat text-left">
              Thực hành điển hình - Lan toả giá trị
            </h2>
          </Link>
          <p className="text-lg text-gray-600 font-montserrat text-left max-w-3xl">
            Khám phá những câu chuyện thành công và mô hình hay sáng kiến điển hình trong phát triển bền vững tại Việt Nam
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden rounded-lg">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100/3)}%)` }}
            >
              {stories.map((item) => (
                <Link
                  key={item.id}
                  href={`/content/${item.id}`}
                  className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 group cursor-pointer px-2"
                >
                  <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                    {/* Image */}
                    <div className="relative h-80 overflow-hidden block flex-shrink-0">
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
                              className="w-full h-full object-cover block"
                              style={{ display: 'block', margin: 0, padding: 0 }}
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
                              className="object-cover block"
                              style={{ display: 'block', margin: 0, padding: 0 }}
                              onError={(e) => {
                                console.error('Uploaded image failed to load:', imageUrl, e);
                              }}
                            />
                          )
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                            <div className="text-center">
                              <svg className="w-12 h-12 text-green-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                              <span className="text-green-600 text-sm font-medium">Điển hình</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-grow flex flex-col">
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
                      <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors font-montserrat">
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
          {stories.length > 1 && (
            <>
              <button
                onClick={handlePrevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 z-10"
                aria-label="Previous story"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 z-10"
                aria-label="Next story"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {stories.length > 3 && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: Math.max(1, stories.length - 2) }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-green-600 scale-110'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to position ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}