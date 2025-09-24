'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { getBestImageUrl } from '@/lib/image-utils';

interface StoryItem {
  id: string;
  title: string;
  description?: string;
  content: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  viewCount: number;
  createdAt: string;
  author: {
    name: string;
    organization?: string;
  };
}

export default function StorySection() {
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  // Auto-advance carousel
  useEffect(() => {
    if (stories.length <= 1) return;

    const interval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, [stories.length, nextSlide]);


  if (loading) {
    return (
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="bg-gray-200 rounded-lg h-48"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
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
            href="/library?type=STORY"
            className="inline-block group"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4 md:text-4xl hover:text-green-600 transition-colors font-montserrat text-left">
              Câu Chuyện Thành Công
            </h2>
          </Link>
          <p className="text-lg text-gray-600 font-montserrat text-left max-w-3xl">
            Khám phá những câu chuyện thành công từ các nông dân và doanh nghiệp trong chuỗi giá trị tôm và lúa bền vững.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden rounded-lg">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100/3)}%)` }}
            >
              {stories.map((story) => (
                <Link
                  key={story.id}
                  href={`/content/${story.id}`}
                  className="w-1/3 flex-shrink-0 group cursor-pointer px-2"
                >
                    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                      {/* Image */}
                      <div className="relative h-64 md:h-80 overflow-hidden">
                        {(() => {
                          // Only use manually uploaded images (thumbnailUrl)
                          let imageUrl = null;

                          // Only check thumbnailUrl (manually uploaded images)
                          if (story.thumbnailUrl) {
                            if (story.thumbnailUrl.includes('/uploads/')) {
                              imageUrl = getBestImageUrl(story.thumbnailUrl, null);
                            } else if (story.thumbnailUrl.startsWith('data:image/')) {
                              // Use data URL directly for uploaded images
                              imageUrl = story.thumbnailUrl;
                            }
                          }

                          return imageUrl ? (
                            imageUrl.startsWith('data:image/') ? (
                              // Use regular img tag for data URLs to avoid Next.js Image optimization issues
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={imageUrl}
                                alt={story.title}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  console.error('Uploaded image failed to load:', imageUrl, e);
                                }}
                              />
                            ) : (
                              // Use Next.js Image for uploaded file URLs
                              <Image
                                src={imageUrl}
                                alt={story.title}
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
                                <BookOpen className="w-12 h-12 text-green-400 mx-auto mb-2" />
                                <span className="text-green-600 text-sm font-medium">Câu chuyện</span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        {/* Date */}
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <span className="font-montserrat">
                            {(() => {
                              const date = new Date(story.createdAt);
                              const day = date.getDate().toString().padStart(2, '0');
                              const month = (date.getMonth() + 1).toString().padStart(2, '0');
                              const year = date.getFullYear();
                              return `${day}/${month}/${year}`;
                            })()}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors font-montserrat">
                          {story.title}
                        </h3>

                        {/* Description */}
                        {story.description && (
                          <p className="text-gray-600 mb-4 line-clamp-2 font-montserrat">
                            {story.description}
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
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 z-10"
                aria-label="Previous story"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
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