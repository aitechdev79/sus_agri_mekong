import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Calendar, Eye, User } from 'lucide-react';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';

interface NewsContent {
  id: string;
  title: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  content: string;
  contentEn?: string;
  type: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  viewCount: number;
  createdAt: string;
  author: {
    id: string;
    name?: string;
    organization?: string;
  };
}

async function getNewsContent(id: string): Promise<NewsContent | null> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/content/${id}`, {
      cache: 'no-store', // Ensure fresh data for view count
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching news content:', error);
    return null;
  }
}

export default async function NewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const content = await getNewsContent(id);

  if (!content) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />

      <main className="container mx-auto px-6 py-20">
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

        </article>
      </main>

      <Footer />
    </div>
  );
}