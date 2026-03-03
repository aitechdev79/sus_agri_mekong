import Image from 'next/image';
import { Calendar, Download, Eye, ExternalLink } from 'lucide-react';
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
    PROJECT_ACTIVITY: 'Hoạt động dự án',
    GUIDE: 'Hướng dẫn',
    POLICY: 'Chính sách',
    NEWS: 'Tin tức',
    EVENT: 'Sự kiện'
  };
  return typeMap[type] || type;
}

function formatEventRange(content: PublicContent) {
  if (!content.eventStartAt) return null;

  const start = new Date(content.eventStartAt);
  if (Number.isNaN(start.getTime())) return null;

  if (content.isAllDay) {
    return start.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  const startLabel = start.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  if (!content.eventEndAt) return startLabel;

  const end = new Date(content.eventEndAt);
  if (Number.isNaN(end.getTime())) return startLabel;

  const endLabel = end.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `${startLabel} - ${endLabel}`;
}

function formatContentWithParagraphs(content: string): string {
  // If content already contains HTML tags, return as is
  if (content.includes('<p>') || content.includes('<br>') || content.includes('<div>')) {
    return content;
  }

  // Split by double line breaks first (paragraph breaks)
  const paragraphs = content.split(/\n\s*\n/);

  // Convert each paragraph, handling single line breaks within paragraphs
  const formattedParagraphs = paragraphs
    .filter(paragraph => paragraph.trim().length > 0)
    .map(paragraph => {
      // Replace single line breaks with <br> tags within paragraphs
      const formattedParagraph = paragraph.trim().replace(/\n/g, '<br>');
      return `<p>${formattedParagraph}</p>`;
    });

  return formattedParagraphs.join('\n');
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
  const eventRange = formatEventRange(content);
  const hasPdf = !!content.fileUrl && (content.fileType === 'application/pdf' || content.fileUrl.toLowerCase().endsWith('.pdf'));
  const pdfUrl = content.fileUrl;
  const hasRichTextContent = Boolean(content.content?.trim());
  const externalUrl = content.projectUrl?.trim() || null;

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
              <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
                {content.type === 'EVENT' && eventRange && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Thời gian: {eventRange}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Ngày đăng: {formatDate(content.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  <span>{content.viewCount.toLocaleString('vi-VN')} lượt xem</span>
                </div>
              </div>
              {content.type === 'EVENT' && content.eventLocation && (
                <div className="text-sm text-gray-500 mb-6">
                  Địa điểm: {content.eventLocation}
                </div>
              )}
            </div>

            {/* Main Image */}
            {bestImageUrl && !hasPdf && (
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

            {hasPdf && pdfUrl && (
              <div className="p-8 pb-0">
                <section className="rounded-3xl border border-gray-200 bg-gray-100 p-4 md:p-6">
                  <div className="sticky top-4 z-10 mb-4 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white/95 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Tài liệu PDF</h2>
                      <p className="text-sm text-gray-500">
                        Dùng nút +/- của trình duyệt PDF để phóng to.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Mở toàn màn hình
                      </a>
                      <a
                        href={pdfUrl}
                        download
                        className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Tải PDF
                      </a>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <object
                      data={`${pdfUrl}#view=FitH`}
                      type="application/pdf"
                      className="h-[70vh] w-full md:h-[80vh]"
                      aria-label={`PDF viewer for ${content.title}`}
                    >
                      <div className="p-6 text-sm text-gray-600">
                        <p>Trình duyệt của bạn không hỗ trợ hiển thị PDF trực tiếp.</p>
                        <a
                          href={pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center font-medium text-gray-900 underline"
                        >
                          Mở hoặc tải PDF
                        </a>
                      </div>
                    </object>
                  </div>
                </section>
              </div>
            )}

            {hasPdf && bestImageUrl && (
              <div className="p-8 pb-0">
                <div className="relative h-64 overflow-hidden rounded-2xl md:h-96">
                  <Image
                    src={bestImageUrl}
                    alt={content.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="p-8">
              {hasPdf ? (
                hasRichTextContent && (
                  <section>
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">Giới thiệu</h2>
                    <div
                      className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed text-justify"
                      style={{
                        textAlign: 'justify',
                        textAlignLast: 'left'
                      }}
                      dangerouslySetInnerHTML={{ __html: formatContentWithParagraphs(content.content) }}
                    />
                  </section>
                )
              ) : (
                <div
                  className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed text-justify"
                  style={{
                    textAlign: 'justify',
                    textAlignLast: 'left'
                  }}
                  dangerouslySetInnerHTML={{ __html: formatContentWithParagraphs(content.content) }}
                />
              )}

              {/* Source Link */}
              {externalUrl && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-500 italic">
                    <span className="font-medium">Tham khảo thêm: </span>
                    <a
                      href={externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-700 underline break-all"
                    >
                      {externalUrl}
                    </a>
                  </p>
                </div>
              )}
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
