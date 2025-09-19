'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BookOpen, User, Eye } from 'lucide-react';
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

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch('/api/content/stories');
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

  // Function to get brief content (first 150 characters)
  const getBriefContent = (content: string) => {
    const plainText = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
  };

  // Function to get the appropriate image URL
  const getImageUrl = (story: StoryItem) => {
    return getBestImageUrl(story.thumbnailUrl, story.imageUrl, '/uploads/placeholder-story.jpg') || '/uploads/placeholder-story.jpg';
  };

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
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-green-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-800 md:text-4xl">
              Câu Chuyện Thành Công
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá những câu chuyện thành công từ các nông dân và doanh nghiệp trong chuỗi giá trị tôm và lúa bền vững.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {stories.slice(0, 3).map((story) => (
            <article
              key={story.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={getImageUrl(story)}
                  alt={story.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-full">
                    Câu chuyện
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Author and Date */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    <span>{story.author.name}</span>
                    {story.author.organization && (
                      <span className="ml-1">({story.author.organization})</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    <span>{story.viewCount}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
                  {story.title}
                </h3>

                {/* Brief Content */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-4">
                  {getBriefContent(story.content)}
                </p>

                {/* Date and Read More */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {(() => {
                      const date = new Date(story.createdAt)
                      const day = date.getDate().toString().padStart(2, '0')
                      const month = (date.getMonth() + 1).toString().padStart(2, '0')
                      const year = date.getFullYear()
                      return `${day}/${month}/${year}`
                    })()}
                  </span>
                  <Link
                    href={`/library/${story.id}`}
                    className="text-green-600 hover:text-green-700 font-medium text-sm group-hover:translate-x-1 transition-transform"
                    aria-label={`Đọc thêm ${story.title}`}
                  >
                    Đọc thêm →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Stories Button */}
        {stories.length > 3 && (
          <div className="text-center mt-12">
            <Link
              href="/library?type=STORY"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              aria-label="Xem tất cả câu chuyện"
            >
              Xem tất cả →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}