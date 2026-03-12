import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Eye, User, ArrowLeft } from 'lucide-react';
import { NewsContent } from '@/types/content';
import { prisma } from '@/lib/prisma';
import { pickLocalizedText } from '@/lib/content-locale';
import { renderRichTextContent } from '@/lib/rich-text';

// Use dynamic rendering for Vercel deployment
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

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

export default async function NewsPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const content = await getNewsContent(id);
  const isEn = locale === 'en';

  if (!content) {
    notFound();
  }

  const localizedTitle = pickLocalizedText(locale, content.title, content.titleEn);
  const localizedDescription = pickLocalizedText(locale, content.description, content.descriptionEn);
  const localizedBody = pickLocalizedText(locale, content.content, content.contentEn);

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
            {isEn ? 'Back to home' : 'Về trang chủ'}
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <article className="max-w-4xl mx-auto">
          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {localizedTitle}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(content.createdAt).toLocaleDateString(isEn ? 'en-US' : 'vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>

              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                {content.viewCount} {isEn ? 'views' : 'lượt xem'}
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
            {localizedDescription && (
              <div className="text-lg text-gray-700 bg-gray-100 p-4 rounded-lg mb-6">
                {localizedDescription}
              </div>
            )}
          </header>

          {/* Featured Image */}
          {(content.imageUrl || content.thumbnailUrl) && (
            <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
              <Image
                src={content.imageUrl || content.thumbnailUrl || ''}
                alt={localizedTitle}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-8 [&_ul]:list-disc [&_ul]:list-inside [&_ul]:pl-2 [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:pl-2 [&_li]:my-1">
            <div
              className="text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderRichTextContent(localizedBody) }}
            />
          </div>

          {/* Video Section */}
          {content.videoUrl && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{isEn ? 'Related video' : 'Video liên quan'}</h3>
              <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden bg-black">
                {content.videoUrl.includes('youtube.com') || content.videoUrl.includes('youtu.be') ? (
                  <iframe
                    src={content.videoUrl.replace('watch?v=', 'embed/')}
                    title={localizedTitle}
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
                    {isEn ? 'Your browser does not support video.' : 'Trình duyệt của bạn không hỗ trợ video.'}
                  </video>
                )}
              </div>
            </div>
          )}

          {/* Back to News Button */}
          <div className="pt-8 mt-12">
            <div className="flex justify-between items-center">
              <Link
                href={`/${locale}/news`}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {isEn ? 'View all news' : 'Xem tất cả tin tức'}
              </Link>

              <Link
                href={`/${locale}`}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isEn ? 'Back to home' : 'Về trang chủ'}
              </Link>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
