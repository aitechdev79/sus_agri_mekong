import Image from 'next/image';
import { Calendar, Download, Eye, ExternalLink } from 'lucide-react';
import { notFound } from 'next/navigation';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import { PublicContent } from '@/types/content';
import { isEnglishLocale, pickLocalizedText } from '@/lib/content-locale';

async function getContent(contentId: string): Promise<PublicContent | null> {
  try {
    const content = await prisma.content.findUnique({
      where: { id: contentId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true,
            organization: true
          }
        }
      }
    });

    if (!content || !content.isPublic) {
      return null;
    }

    return {
      ...content,
      createdAt: content.createdAt.toISOString(),
      updatedAt: content.updatedAt.toISOString(),
      eventStartAt: content.eventStartAt?.toISOString() || null,
      eventEndAt: content.eventEndAt?.toISOString() || null
    } as PublicContent;
  } catch (error) {
    console.error('Error fetching content:', error);
    return null;
  }
}

function formatDate(dateString: string, locale: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString(isEnglishLocale(locale) ? 'en-US' : 'vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function extractYouTubeVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function getContentTypeLabel(type: string, locale: string): string {
  const isEn = isEnglishLocale(locale);
  const typeMap: Record<string, string> = isEn
    ? {
        ARTICLE: 'Article',
        DOCUMENT: 'Document',
        STORY: 'Story',
        PROJECT_ACTIVITY: 'Project Activity',
        GUIDE: 'Guide',
        POLICY: 'Policy',
        NEWS: 'News',
        EVENT: 'Event'
      }
    : {
        ARTICLE: 'BÃ i viáº¿t',
        DOCUMENT: 'TÃ i liá»‡u',
        STORY: 'Äiá»ƒn hÃ¬nh',
        PROJECT_ACTIVITY: 'Hoáº¡t Ä‘á»™ng dá»± Ã¡n',
        GUIDE: 'HÆ°á»›ng dáº«n',
        POLICY: 'ChÃ­nh sÃ¡ch',
        NEWS: 'Tin tá»©c',
        EVENT: 'Sá»± kiá»‡n'
      };

  return typeMap[type] || type;
}

function formatEventRange(content: PublicContent, locale: string) {
  if (!content.eventStartAt) return null;

  const start = new Date(content.eventStartAt);
  if (Number.isNaN(start.getTime())) return null;

  const targetLocale = isEnglishLocale(locale) ? 'en-US' : 'vi-VN';
  if (content.isAllDay) {
    return start.toLocaleDateString(targetLocale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  const startLabel = start.toLocaleString(targetLocale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  if (!content.eventEndAt) return startLabel;

  const end = new Date(content.eventEndAt);
  if (Number.isNaN(end.getTime())) return startLabel;

  const endLabel = end.toLocaleString(targetLocale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `${startLabel} - ${endLabel}`;
}

function formatContentWithParagraphs(content: string): string {
  if (content.includes('<p>') || content.includes('<br>') || content.includes('<div>')) {
    return content;
  }

  return content
    .split(/\n\s*\n/)
    .filter((paragraph) => paragraph.trim().length > 0)
    .map((paragraph) => `<p>${paragraph.trim().replace(/\n/g, '<br>')}</p>`)
    .join('\n');
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

function getExternalLabel(type: string, locale: string) {
  if (isEnglishLocale(locale)) {
    if (type === 'EVENT') return 'Register at:';
    if (type === 'POLICY') return 'Reference link:';
    return 'Read more:';
  }

  if (type === 'EVENT') return 'ÄÄƒng kÃ½ táº¡i:';
  if (type === 'POLICY') return 'Link tham kháº£o:';
  return 'Tham kháº£o thÃªm:';
}

export default async function LocaleContentDetailPage({
  params
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const content = await getContent(id);

  if (!content || content.status !== 'PUBLISHED') {
    notFound();
  }

  const bestImageUrl = getBestImageUrl(content.thumbnailUrl, content.imageUrl);
  const localizedTitle = pickLocalizedText(locale, content.title, content.titleEn);
  const localizedDescription = pickLocalizedText(locale, content.description, content.descriptionEn);
  const localizedBody = pickLocalizedText(locale, content.content, content.contentEn);
  const youtubeVideoId = content.videoUrl ? extractYouTubeVideoId(content.videoUrl) : null;
  const eventRange = formatEventRange(content, locale);
  const hasPdf =
    !!content.fileUrl &&
    (content.fileType === 'application/pdf' || content.fileUrl.toLowerCase().endsWith('.pdf'));
  const pdfUrl = content.fileUrl;
  const hasRichTextContent = Boolean(localizedBody?.trim());
  const externalUrl = content.projectUrl?.trim() || null;
  const showMainImage = Boolean(bestImageUrl) && !hasPdf && content.type !== 'POLICY';
  const isEn = isEnglishLocale(locale);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />

      <main className="container mx-auto px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <article className="overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="p-8">
              <div className="mb-4">
                <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                  {getContentTypeLabel(content.type, locale)}
                </span>
              </div>

              <h1 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">{localizedTitle}</h1>

              {localizedDescription && (
                <p className="mb-6 text-lg italic leading-relaxed text-gray-600">{localizedDescription}</p>
              )}

              <div className="mb-6 flex items-center space-x-6 text-sm text-gray-500">
                {content.type === 'EVENT' && eventRange && (
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{isEn ? `Schedule: ${eventRange}` : `Thá»i gian: ${eventRange}`}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{isEn ? `Published: ${formatDate(content.createdAt, locale)}` : `NgÃ y Ä‘Äƒng: ${formatDate(content.createdAt, locale)}`}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="mr-2 h-4 w-4" />
                  <span>
                    {content.viewCount.toLocaleString(isEn ? 'en-US' : 'vi-VN')} {isEn ? 'views' : 'lÆ°á»£t xem'}
                  </span>
                </div>
              </div>

              {content.type === 'EVENT' && content.eventLocation && (
                <div className="mb-6 text-sm text-gray-500">
                  {isEn ? 'Location:' : 'Äá»‹a Ä‘iá»ƒm:'} {content.eventLocation}
                </div>
              )}
            </div>

            <div className="border-t border-gray-200" />
            {showMainImage && (
              <div className="relative h-64 overflow-hidden md:h-96">
                <Image src={bestImageUrl as string} alt={localizedTitle} fill className="object-cover" priority />
              </div>
            )}

            {hasPdf && pdfUrl && (
              <div className="p-8 pb-0">
                <section className="rounded-3xl border border-gray-200 bg-gray-100 p-4 md:p-6">
                  <div className="sticky top-4 z-10 mb-4 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white/95 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{isEn ? 'PDF Document' : 'TÃ i liá»‡u PDF'}</h2>
                      <p className="text-sm text-gray-500">
                        {isEn ? 'Use the browser PDF zoom controls to enlarge the document.' : 'DÃ¹ng nÃºt +/- cá»§a trÃ¬nh duyá»‡t PDF Ä‘á»ƒ phÃ³ng to.'}
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
                        {isEn ? 'Open full screen' : 'Má»Ÿ toÃ n mÃ n hÃ¬nh'}
                      </a>
                      <a
                        href={pdfUrl}
                        download
                        className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        {isEn ? 'Download PDF' : 'Táº£i PDF'}
                      </a>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <object
                      data={`${pdfUrl}#view=FitH`}
                      type="application/pdf"
                      className="h-[70vh] w-full md:h-[80vh]"
                      aria-label={`PDF viewer for ${localizedTitle}`}
                    >
                      <div className="p-6 text-sm text-gray-600">
                        <p>
                          {isEn
                            ? 'Your browser does not support inline PDF viewing.'
                            : 'TrÃ¬nh duyá»‡t cá»§a báº¡n khÃ´ng há»— trá»£ hiá»ƒn thá»‹ PDF trá»±c tiáº¿p.'}
                        </p>
                        <a
                          href={pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center font-medium text-gray-900 underline"
                        >
                          {isEn ? 'Open or download PDF' : 'Má»Ÿ hoáº·c táº£i PDF'}
                        </a>
                      </div>
                    </object>
                  </div>
                </section>
              </div>
            )}

            {hasPdf && bestImageUrl && content.type !== 'POLICY' && (
              <div className="p-8 pb-0">
                <div className="relative h-64 overflow-hidden rounded-2xl md:h-96">
                  <Image src={bestImageUrl} alt={localizedTitle} fill className="object-cover" />
                </div>
              </div>
            )}

            <div className="p-8">
              {hasPdf ? (
                hasRichTextContent && (
                  <section>
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">{isEn ? 'Introduction' : 'Giá»›i thiá»‡u'}</h2>
                    <div
                      className="prose prose-lg max-w-none text-justify prose-headings:text-gray-900 prose-p:leading-relaxed prose-p:text-gray-700"
                      style={{ textAlign: 'justify', textAlignLast: 'left' }}
                      dangerouslySetInnerHTML={{ __html: formatContentWithParagraphs(localizedBody) }}
                    />
                  </section>
                )
              ) : (
                <div
                  className="prose prose-lg max-w-none text-justify prose-headings:text-gray-900 prose-p:leading-relaxed prose-p:text-gray-700"
                  style={{ textAlign: 'justify', textAlignLast: 'left' }}
                  dangerouslySetInnerHTML={{ __html: formatContentWithParagraphs(localizedBody) }}
                />
              )}

              {externalUrl && (
                <div className="mt-8 pt-6">
                  <p className="text-sm italic text-gray-500">
                    <span className="font-medium">{getExternalLabel(content.type, locale)} </span>
                    <a
                      href={externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-gray-500 underline hover:text-gray-700"
                    >
                      {externalUrl}
                    </a>
                  </p>
                </div>
              )}
            </div>

            {youtubeVideoId && (
              <div className="p-8 pt-0">
                <h3 className="mb-4 text-xl font-semibold text-gray-900">{isEn ? 'Related Video' : 'Video liÃªn quan'}</h3>
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    className="absolute left-0 top-0 h-full w-full rounded-lg"
                    src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
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

