import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Eye, ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface NewsItem {
  id: string;
  title: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  thumbnailUrl?: string;
  viewCount: number;
  createdAt: string;
}

async function getNewsItems(): Promise<NewsItem[]> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/content/news`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      return [];
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const newsItems = await getNewsItems();

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
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <header className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tin Tức
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cập nhật những tin tức mới nhất về ngành tôm và lúa, các thực hành tốt và câu chuyện thành công
            </p>
          </header>

          {/* News Grid */}
          {newsItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/${locale}/news/${item.id}`}
                  className="group"
                >
                  <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      {item.thumbnailUrl ? (
                        <Image
                          src={item.thumbnailUrl}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">Không có hình ảnh</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Date and Views */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {item.viewCount}
                        </div>
                      </div>

                      {/* Title */}
                      <h2 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h2>

                      {/* Description */}
                      {item.description && (
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Chưa có tin tức nào được đăng</p>
              <Link
                href={`/${locale}`}
                className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Về trang chủ
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}