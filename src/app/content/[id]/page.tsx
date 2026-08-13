import Image from 'next/image';
import { Calendar, Download, Eye, ExternalLink } from 'lucide-react';
import { notFound } from 'next/navigation';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { ContentViewTracker } from '@/components/content/ContentViewTracker';
import { renderRichTextContent } from '@/lib/rich-text';
import { PublicContent } from '@/types/content';
import { formatVietnamDate, formatVietnamDateTime } from '@/lib/vietnam-time';
import { getPublishedDate } from '@/lib/content-dates';
import { getPublishedContentById } from '@/lib/public-content-detail';

export const revalidate = 300;

function extractYouTubeVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function getContentTypeLabel(type: string): string {
  const typeMap: Record<string, string> = {
    ARTICLE: 'Bài viết',
    DOCUMENT: 'Tài liệu',
    STORY: 'Điển hình',
    PROJECT_ACTIVITY: 'Hoạt động dự án',
    GUIDE: 'Hướng dẫn',
    POLICY: 'Chính sách',
    NEWS: 'Tin tức',
    EVENT: 'Sự kiện',
  };

  return typeMap[type] || type;
}

function formatEventRange(content: PublicContent) {
  if (!content.eventStartAt) return null;

  const start = new Date(content.eventStartAt);
  if (Number.isNaN(start.getTime())) return null;

  if (content.isAllDay) {
    return formatVietnamDate(start);
  }

  const startLabel = formatVietnamDateTime(start);

  if (!content.eventEndAt) return startLabel;

  const end = new Date(content.eventEndAt);
  if (Number.isNaN(end.getTime())) return startLabel;

  const endLabel = formatVietnamDateTime(end);

  return `${startLabel} - ${endLabel}`;
}

function getBestImageUrl(thumbnailUrl?: string, imageUrl?: string): string | null {
  if (thumbnailUrl && thumbnailUrl.startsWith('./uploads/')) {
    return thumbnailUrl.replace('./uploads/', '/uploads/');
  }

  if (imageUrl && imageUrl.startsWith('./uploads/')) {
    return imageUrl.replace('./uploads/', '/uploads/');
  }

  return thumbnailUrl || imageUrl || null;
}

function getExternalLabel(type: string) {
  if (type === 'EVENT') return 'Đăng ký tại:';
  if (type === 'POLICY') return 'Link tham khảo:';
  return 'Tham khảo thêm:';
}

export default async function ContentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const content = await getPublishedContentById(id).catch((error) => {
    console.error('Error fetching content:', error);
    return null;
  });

  if (!content || content.status !== 'PUBLISHED') {
    notFound();
  }

  const bestImageUrl = getBestImageUrl(content.thumbnailUrl, content.imageUrl);
  const youtubeVideoId = content.videoUrl ? extractYouTubeVideoId(content.videoUrl) : null;
  const eventRange = formatEventRange(content);
  const hasPdf = !!content.fileUrl && (
    content.fileType === 'application/pdf' || content.fileUrl.toLowerCase().endsWith('.pdf')
  );
  const pdfUrl = content.fileUrl;
  const hasRichTextContent = Boolean(content.content?.trim());
  const externalUrl = content.projectUrl?.trim() || null;
  const showMainImage = Boolean(bestImageUrl) && !hasPdf && content.type !== 'POLICY';

  return (
    <div className="min-h-screen bg-gray-50">
      <ContentViewTracker contentId={content.id} />
      <NavigationBar />

      <main className="container mx-auto px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <article className="overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="p-8">
              <div className="mb-4">
                <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                  {getContentTypeLabel(content.type)}
                </span>
              </div>

              <h1 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
                {content.title}
              </h1>

              {content.description && (
                <p className="mb-6 text-lg italic leading-relaxed text-gray-700">
                  {content.description}
                </p>
              )}

              <div className="mb-2 flex items-center space-x-6 text-sm text-gray-700">
                {content.type === 'EVENT' && eventRange && (
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Thời gian: {eventRange}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Ngày đăng: {formatVietnamDateTime(getPublishedDate(content))}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="mr-2 h-4 w-4" />
                  <span>{content.viewCount.toLocaleString('vi-VN')} lượt xem</span>
                </div>
              </div>

              {content.type === 'EVENT' && content.eventLocation && (
                <div className="mb-2 text-sm text-gray-700">
                  Địa điểm: {content.eventLocation}
                </div>
              )}
              <div className="mt-2 -mb-4 border-t border-gray-200" />
            </div>

            {showMainImage && (
              <div className="relative mx-8 h-64 overflow-hidden border border-gray-200 md:h-96">
                <Image
                  src={bestImageUrl as string}
                  alt={content.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
            {showMainImage && content.thumbnailUrl && (
              <div className="mx-8 mt-3 border-t-[1.5px] border-[#0A7029]" />
            )}

            {hasPdf && pdfUrl && (
              <div className="p-8 pb-0">
                <section className="rounded-3xl border border-gray-200 bg-gray-100 p-4 md:p-6">
                  <div className="sticky top-4 z-10 mb-4 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white/95 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Tài liệu PDF</h2>
                      <p className="text-sm text-gray-700">
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
                      <div className="p-6 text-sm text-gray-700">
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

            {hasPdf && bestImageUrl && content.type !== 'POLICY' && (
              <div className="p-8 pb-0">
                <div className="relative h-64 overflow-hidden md:h-96">
                  <Image
                    src={bestImageUrl}
                    alt={content.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            <div className="p-8">
              {hasPdf ? (
                hasRichTextContent && (
                  <section>
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">Giới thiệu</h2>
                    <div
                      className="prose prose-lg max-w-none text-justify prose-headings:text-gray-900 prose-headings:mb-4 prose-headings:mt-8 prose-p:my-4 prose-p:leading-relaxed prose-p:text-gray-800 [&_p:has(br:only-child)]:my-6 [&_ul]:list-disc [&_ul]:list-inside [&_ul]:pl-2 [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:pl-2 [&_li]:my-1 [&_li>p]:inline [&_li>p]:m-0 [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-green-700 [&_blockquote]:bg-green-50 [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:italic [&_blockquote_p]:text-gray-800"
                      dangerouslySetInnerHTML={{ __html: renderRichTextContent(content.content) }}
                    />
                  </section>
                )
              ) : (
                <div
                  className="prose prose-lg max-w-none text-justify prose-headings:text-gray-900 prose-headings:mb-4 prose-headings:mt-8 prose-p:my-4 prose-p:leading-relaxed prose-p:text-gray-800 [&_p:has(br:only-child)]:my-6 [&_ul]:list-disc [&_ul]:list-inside [&_ul]:pl-2 [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:pl-2 [&_li]:my-1 [&_li>p]:inline [&_li>p]:m-0 [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-green-700 [&_blockquote]:bg-green-50 [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:italic [&_blockquote_p]:text-gray-800"
                  dangerouslySetInnerHTML={{ __html: renderRichTextContent(content.content) }}
                />
              )}

              {externalUrl && (
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <p className="text-xs italic text-gray-700">
                    <span>{getExternalLabel(content.type)} </span>
                    <a
                      href={externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-gray-700 underline hover:text-gray-900"
                    >
                      {externalUrl}
                    </a>
                  </p>
                </div>
              )}
            </div>

            {youtubeVideoId && (
              <div className="p-8 pt-0">
                <div className="relative w-full overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    className="absolute left-0 top-0 h-full w-full"
                    src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  />
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

