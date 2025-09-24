import Image from 'next/image';
import { Calendar, Eye } from 'lucide-react';
import { notFound } from 'next/navigation';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { PublicContent } from '@/types/content';

async function getContent(contentId: string): Promise<PublicContent | null> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/content/${contentId}`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching content:', error);
    return null;
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function extractYouTubeVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function getContentTypeLabel(type: string): string {
  const typeMap: { [key: string]: string } = {
    ARTICLE: 'Bài viết',
    DOCUMENT: 'Tài liệu',
    STORY: 'Điển hình',
    GUIDE: 'Hướng dẫn',
    POLICY: 'Chính sách',
    NEWS: 'Tin tức'
  };
  return typeMap[type] || type;
}

function getBestImageUrl(thumbnailUrl?: string, imageUrl?: string): string | null {
  // If thumbnailUrl starts with './uploads/', convert to absolute path
  if (thumbnailUrl && thumbnailUrl.startsWith('./uploads/')) {
    return thumbnailUrl.replace('./uploads/', '/uploads/');
  }

  // If imageUrl starts with './uploads/', convert to absolute path
  if (imageUrl && imageUrl.startsWith('./uploads/')) {
    return imageUrl.replace('./uploads/', '/uploads/');
  }

  // Return the first available URL or null
  return thumbnailUrl || imageUrl || null;
}

export default async function ContentDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  const content = await getContent(id);

  if (!content || content.status !== 'PUBLISHED') {
    notFound();
  }

  const bestImageUrl = getBestImageUrl(content.thumbnailUrl, content.imageUrl);
  const youtubeVideoId = content.videoUrl ? extractYouTubeVideoId(content.videoUrl) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />

      <main className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <article className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Content Header */}
            <div className="p-8 border-b">
              {/* Content Type Badge */}
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {getContentTypeLabel(content.type)}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {content.title}
              </h1>

              {/* Description */}
              {content.description && (
                <p className="text-lg text-gray-600 italic mb-6 leading-relaxed">
                  {content.description}
                </p>
              )}

              {/* Meta Information */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Ngày đăng: {formatDate(content.createdAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    <span>{content.viewCount.toLocaleString('vi-VN')} lượt xem</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-700">{content.author.name}</div>
                  <div className="text-gray-500">{content.author.role}</div>
                </div>
              </div>
            </div>

            {/* Main Image */}
            {bestImageUrl && (
              <div className="relative h-64 md:h-96 overflow-hidden">
                <Image
                  src={bestImageUrl}
                  alt={content.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Main Content */}
            <div className="p-8">
              <div
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content.content }}
              />
            </div>

            {/* YouTube Video Embed */}
            {youtubeVideoId && (
              <div className="p-8 pt-0">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Video liên quan</h3>
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}