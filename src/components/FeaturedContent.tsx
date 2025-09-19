'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface FeaturedItem {
  id: string;
  title: string;
  description?: string;
  type: string;
  thumbnailUrl?: string;
  viewCount: number;
  fileUrl?: string;
}

export default function FeaturedContent() {
  const [featuredContent, setFeaturedContent] = useState<FeaturedItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedContent = async () => {
      try {
        const response = await fetch('/api/content/featured');
        if (response.ok) {
          const data = await response.json();
          setFeaturedContent(data);
        }
      } catch (error) {
        console.error('Error fetching featured content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedContent();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="bg-gray-200 rounded-lg h-96"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!featuredContent) {
    return null;
  }

  const isVideo = featuredContent.type === 'VIDEO';
  const isPDF = featuredContent.fileUrl?.endsWith('.pdf');

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="mb-12 text-3xl font-bold text-center text-gray-800 md:text-4xl font-montserrat">
          Nội Dung Nổi Bật
        </h2>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Media Content */}
            <div className="relative h-64 md:h-80">
              {isVideo && featuredContent.fileUrl ? (
                <iframe
                  src={featuredContent.fileUrl}
                  title={featuredContent.title}
                  className="w-full h-full"
                  allowFullScreen
                />
              ) : isPDF && featuredContent.fileUrl ? (
                <embed
                  src={featuredContent.fileUrl}
                  type="application/pdf"
                  className="w-full h-full"
                />
              ) : featuredContent.thumbnailUrl ? (
                <Image
                  src={featuredContent.thumbnailUrl}
                  alt={featuredContent.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Không có hình ảnh</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full font-montserrat">
                  {featuredContent.type}
                </span>
                <span className="text-gray-600 text-sm font-montserrat">
                  {featuredContent.viewCount}+ lượt xem
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-3 font-montserrat">
                {featuredContent.title}
              </h3>

              {featuredContent.description && (
                <p className="text-gray-600 mb-6 line-clamp-3 font-montserrat">
                  {featuredContent.description}
                </p>
              )}

              <Link
                href={`/library/${featuredContent.id}`}
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors font-montserrat"
                aria-label={`Xem chi tiết ${featuredContent.title}`}
              >
                Xem chi tiết
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}