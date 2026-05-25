import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Eye, User, ArrowLeft } from 'lucide-react';
import { ContentViewTracker } from '@/components/content/ContentViewTracker';
import Footer from '@/components/Footer';
import { pickLocalizedText } from '@/lib/content-locale';
import { renderRichTextContent } from '@/lib/rich-text';
import { formatVietnamDateTime } from '@/lib/vietnam-time';
import { getPublishedDate } from '@/lib/content-dates';
import { getPublishedContentById } from '@/lib/public-content-detail';

export const revalidate = 3600;

function getLocale(paramsLocale?: string) {
  return paramsLocale === 'en' ? 'en' : 'vi';
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale?: string; id: string }>;
}) {
  const { locale: paramsLocale, id } = await params;
  const locale = getLocale(paramsLocale);
  const isEn = locale === 'en';
  const content = await getPublishedContentById(id).catch((error) => {
    console.error('Error fetching news content:', error);
    return null;
  });

  if (!content) {
    notFound();
  }

  const localizedTitle = pickLocalizedText(locale, content.title, content.titleEn);
  const localizedDescription = pickLocalizedText(locale, content.description, content.descriptionEn);
  const localizedBody = pickLocalizedText(locale, content.content, content.contentEn);

  return (
    <div className="min-h-screen bg-gray-50">
      <ContentViewTracker contentId={content.id} />
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <Link href={`/${locale}`} className="inline-flex items-center text-blue-600 transition-colors hover:text-blue-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {isEn ? 'Back to home' : 'Về trang chủ'}
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <article className="mx-auto max-w-4xl">
          <header className="mb-8">
            <h1 className="mb-4 text-3xl font-bold leading-tight text-gray-900 md:text-4xl">{localizedTitle}</h1>

            <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <span>
                  {isEn ? `Published: ${formatVietnamDateTime(getPublishedDate(content), locale)}` : `Ngày đăng: ${formatVietnamDateTime(getPublishedDate(content), locale)}`}
                </span>
              </div>
              <div className="flex items-center">
                <Eye className="mr-2 h-4 w-4" />
                {content.viewCount} {isEn ? 'views' : 'lượt xem'}
              </div>
              {content.author.name && (
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  {content.author.name}
                  {content.author.organization && <span className="ml-1">- {content.author.organization}</span>}
                </div>
              )}
            </div>

            {localizedDescription && <div className="mb-6 rounded-lg bg-gray-100 p-4 text-lg text-gray-700">{localizedDescription}</div>}
          </header>

          {(content.imageUrl || content.thumbnailUrl) && (
            <div className="relative mb-8 h-64 w-full overflow-hidden rounded-lg md:h-96">
              <Image src={content.imageUrl || content.thumbnailUrl || ''} alt={localizedTitle} fill className="object-cover" priority />
            </div>
          )}

          <div className="prose prose-lg mb-8 max-w-none [&_ul]:list-disc [&_ul]:list-inside [&_ul]:pl-2 [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:pl-2 [&_li]:my-1 [&_li>p]:m-0 [&_li>p]:inline [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-green-700 [&_blockquote]:bg-green-50 [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:italic [&_blockquote_p]:text-gray-700">
            <div className="leading-relaxed text-gray-800" dangerouslySetInnerHTML={{ __html: renderRichTextContent(localizedBody) }} />
          </div>

          {content.videoUrl && (
            <div className="mb-8">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">{isEn ? 'Related video' : 'Video liên quan'}</h3>
              <div className="relative h-64 w-full overflow-hidden rounded-lg bg-black md:h-96">
                {content.videoUrl.includes('youtube.com') || content.videoUrl.includes('youtu.be') ? (
                  <iframe
                    src={content.videoUrl.replace('watch?v=', 'embed/')}
                    title={localizedTitle}
                    className="h-full w-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                ) : (
                  <video controls className="h-full w-full object-contain" preload="metadata">
                    <source src={content.videoUrl} type="video/mp4" />
                    {isEn ? 'Your browser does not support video.' : 'Trình duyệt của bạn không hỗ trợ video.'}
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
