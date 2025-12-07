import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Eye, User, ArrowLeft } from 'lucide-react';
import { NewsContent } from '@/types/content';
import { prisma } from '@/lib/prisma';

async function getNewsContent(id: string): Promise<NewsContent | null> {
  try {
    const content = await prisma.content.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            organization: true,
          },
        },
      },
    });

    if (!content) {
      return null;
    }

    return content as unknown as NewsContent;
  } catch (error) {
    console.error('Error fetching news content:', error);
    return null;
  }
}

// Generate static params for all news items at build time
export async function generateStaticParams() {
  try {
    const news = await prisma.content.findMany({
      where: {
        type: 'NEWS',
        status: 'PUBLISHED',
      },
      select: {
        id: true,
      },
    });

    const locales = ['vi', 'en']; // Your supported locales

    // Generate params for each locale
    return locales.flatMap((locale) =>
      news.map((item) => ({
        locale,
        id: item.id,
      }))
    );
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function NewsPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const content = await getNewsContent(id);

  if (!content) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Về trang chủ
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <article className="max-w-4xl mx-auto">
          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {content.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(content.createdAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>

              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                {content.viewCount} lượt xem
              </div>

              {content.author.name && (
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {content.author.name}
                  {content.author.organization && (
                    <span className="ml-1">- {content.author.organization}</span>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            {content.description && (
              <div className="text-lg text-gray-700 bg-gray-100 p-4 rounded-lg mb-6">
                {content.description}
              </div>
            )}
          </header>

          {/* Featured Image */}
          {(content.imageUrl || content.thumbnailUrl) && (
            <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
              <Image
                src={content.imageUrl || content.thumbnailUrl || ''}
                alt={content.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-8">
            <div
              className="text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content.content.replace(/\n/g, '<br>') }}
            />
          </div>

          {/* Video Section */}
          {content.videoUrl && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Video liên quan</h3>
              <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden bg-black">
                {content.videoUrl.includes('youtube.com') || content.videoUrl.includes('youtu.be') ? (
                  <iframe
                    src={content.videoUrl.replace('watch?v=', 'embed/')}
                    title={content.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    controls
                    className="w-full h-full object-contain"
                    preload="metadata"
                  >
                    <source src={content.videoUrl} type="video/mp4" />
                    Trình duyệt của bạn không hỗ trợ video.
                  </video>
                )}
              </div>
            </div>
          )}

          {/* Back to News Button */}
          <div className="border-t pt-8 mt-12">
            <div className="flex justify-between items-center">
              <Link
                href={`/${locale}/news`}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Xem tất cả tin tức
              </Link>

              <Link
                href={`/${locale}`}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}