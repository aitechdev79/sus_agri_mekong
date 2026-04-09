'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Eye, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePublicCategories } from '@/hooks/use-public-categories';
import { pickLocalizedText } from '@/lib/content-locale';

interface NewsItem {
  id: string;
  title: string;
  titleEn?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
  thumbnailUrl?: string;
  viewCount: number;
  createdAt: string;
  category?: string;
}

export default function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = useState('vi');
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { categoryLabels } = usePublicCategories();
  const isEn = locale === 'en';

  useEffect(() => {
    params.then((p) => setLocale(p.locale));
  }, [params]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/content/news');
      if (response.ok) {
        const data = await response.json();
        setNewsItems(data);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isEn ? 'en-US' : 'vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getCategoryLabel = (category?: string) => {
    if (!category) return '';
    return categoryLabels[category] || category;
  };

  const sortedNews = [...newsItems].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  let carouselItems = sortedNews.slice(0, 3);

  if (carouselItems.length < 3 && carouselItems.length > 0) {
    while (carouselItems.length < 3) {
      carouselItems = [...carouselItems, ...sortedNews];
    }
    carouselItems = carouselItems.slice(0, 3);
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  useEffect(() => {
    if (carouselItems.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [carouselItems.length]);

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b" style={{ borderColor: '#E8F5E9' }}>
        <div className="container mx-auto px-6 py-4">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center font-montserrat font-semibold transition-colors"
            style={{ color: '#0A7029' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#065a1f';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#0A7029';
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isEn ? 'Back to home' : 'Về trang chủ'}
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div>
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 font-montserrat" style={{ color: '#3C3C3B' }}>
              {isEn ? 'Featured News' : 'Tin tức nổi bật'}
            </h1>
            <p className="text-lg font-montserrat" style={{ color: '#6B7280' }}>
              {isEn ? 'Latest updates, stories and highlights from the platform' : 'Cập nhật những tin mới, câu chuyện và điểm nhấn nổi bật từ nền tảng'}
            </p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : carouselItems.length > 0 ? (
            <div className="relative">
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {carouselItems.map((item, index) => {
                    const title = pickLocalizedText(locale, item.title, item.titleEn);
                    const description = pickLocalizedText(locale, item.description, item.descriptionEn);

                    return (
                      <div key={`${item.id}-${index}`} className="w-full flex-shrink-0 px-2">
                        <Link href={`/${locale}/news/${item.id}`} className="block group">
                          <div className="bg-white overflow-hidden transition-all duration-300" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
                            <div className="relative h-64 md:h-96 overflow-hidden">
                              {item.thumbnailUrl ? (
                                <Image
                                  src={item.thumbnailUrl}
                                  alt={title}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-500">{isEn ? 'No image' : 'Không có hình ảnh'}</span>
                                </div>
                              )}
                              <div className="absolute top-4 left-4 px-4 py-2 font-bold shadow-lg font-montserrat" style={{ backgroundColor: '#0A7029', color: 'white' }}>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  <span>{formatDate(item.createdAt)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="p-6 relative" style={{ minHeight: '160px' }}>
                              <div className="absolute bottom-0 left-0 w-full h-0.5" style={{ backgroundColor: '#E8F5E9' }} />
                              <div
                                className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 ease-out"
                                style={{ backgroundColor: '#0A7029' }}
                              />

                              <h2 className="text-xl md:text-2xl font-bold mb-3 font-montserrat line-clamp-2" style={{ color: '#3C3C3B' }}>
                                {title}
                              </h2>
                              {description && (
                                <p className="leading-relaxed line-clamp-3 mb-4 font-montserrat" style={{ color: '#6B7280' }}>
                                  {description}
                                </p>
                              )}
                              <div className="flex items-center gap-4 text-sm" style={{ color: '#9CA3AF' }}>
                                <div className="flex items-center gap-1">
                                  <Eye className="w-4 h-4" />
                                  <span>{item.viewCount} {isEn ? 'views' : 'lượt xem'}</span>
                                </div>
                                {item.category && (
                                  <span className="px-3 py-1 text-xs font-semibold font-montserrat" style={{ backgroundColor: '#E8F5E9', color: '#0A7029' }}>
                                    {getCategoryLabel(item.category)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>

              {carouselItems.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 p-3 rounded-full shadow-lg transition-all duration-300 z-10 group"
                    style={{ backgroundColor: '#0A7029', color: 'white' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#065a1f';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#0A7029';
                    }}
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 p-3 rounded-full shadow-lg transition-all duration-300 z-10 group"
                    style={{ backgroundColor: '#0A7029', color: 'white' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#065a1f';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#0A7029';
                    }}
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </button>
                </>
              )}

              {carouselItems.length > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {carouselItems.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className="w-3 h-3 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: index === currentSlide ? '#0A7029' : '#E8F5E9',
                        width: index === currentSlide ? '32px' : '12px'
                      }}
                      onMouseEnter={(e) => {
                        if (index !== currentSlide) {
                          e.currentTarget.style.backgroundColor = '#C8E6C9';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (index !== currentSlide) {
                          e.currentTarget.style.backgroundColor = '#E8F5E9';
                        }
                      }}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-12 text-center" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
              <p className="text-lg font-montserrat" style={{ color: '#6B7280' }}>
                {isEn ? 'No news has been published yet' : 'Chưa có tin tức nào được đăng'}
              </p>
            </div>
          )}
        </div>

        <div className="mt-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2 md:text-4xl font-montserrat" style={{ color: '#3C3C3B' }}>
              {isEn ? 'Latest News' : 'Tin tức mới nhất'}
            </h2>
            <p className="text-lg font-montserrat max-w-3xl" style={{ color: '#6B7280' }}>
              {isEn ? 'Highlighted stories and recent updates' : 'Danh sách các tin tức và cập nhật nổi bật'}
            </p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : newsItems.length > 0 ? (
            <div className="space-y-6">
              {newsItems.slice(0, 5).map((item) => {
                const title = pickLocalizedText(locale, item.title, item.titleEn);
                const description = pickLocalizedText(locale, item.description, item.descriptionEn);

                return (
                  <Link key={item.id} href={`/${locale}/news/${item.id}`} className="block group">
                    <article className="bg-white overflow-hidden transition-all duration-300 flex flex-col md:flex-row relative" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
                      <div className="relative h-40 md:h-40 md:w-56 flex-shrink-0 overflow-hidden">
                        {item.thumbnailUrl ? (
                          <Image
                            src={item.thumbnailUrl}
                            alt={title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <Calendar className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      <div className="p-6 flex-1 relative" style={{ minHeight: '120px' }}>
                        <div className="absolute bottom-0 left-0 w-full h-0.5" style={{ backgroundColor: '#E8F5E9' }} />
                        <div
                          className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 ease-out"
                          style={{ backgroundColor: '#0A7029' }}
                        />

                        <div className="flex items-center text-sm mb-2" style={{ color: '#9CA3AF' }}>
                          <Calendar className="w-4 h-4 mr-1" />
                          <span className="font-montserrat font-medium">{formatDate(item.createdAt)}</span>
                        </div>

                        <h3 className="text-lg md:text-xl font-bold mb-2 font-montserrat line-clamp-2" style={{ color: '#3C3C3B' }}>
                          {title}
                        </h3>

                        {description && (
                          <p className="text-sm md:text-base line-clamp-2 mb-3 font-montserrat" style={{ color: '#6B7280' }}>
                            {description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-sm" style={{ color: '#9CA3AF' }}>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{item.viewCount} {isEn ? 'views' : 'lượt xem'}</span>
                          </div>
                          {item.category && (
                            <span className="px-3 py-1 text-xs font-semibold font-montserrat" style={{ backgroundColor: '#E8F5E9', color: '#0A7029' }}>
                              {getCategoryLabel(item.category)}
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="bg-white p-12 text-center" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
              <p className="text-lg font-montserrat" style={{ color: '#6B7280' }}>
                {isEn ? 'No news has been published yet' : 'Chưa có tin tức nào được đăng'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
