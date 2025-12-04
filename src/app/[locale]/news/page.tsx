import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Eye, ArrowLeft } from 'lucide-react';
import EventCalendar from '@/components/EventCalendar';

interface NewsItem {
  id: string;
  title: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  thumbnailUrl?: string;
  viewCount: number;
  createdAt: string;
  category?: string;
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

  // Sort events by date (newest first) and separate featured from list
  const sortedEvents = [...newsItems].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const featuredEvent = sortedEvents[0];
  const upcomingEvents = sortedEvents.slice(1, 5);

  // Prepare events for calendar
  const calendarEvents = newsItems.map(item => ({
    id: item.id,
    title: item.title,
    date: new Date(item.createdAt),
    type: (item.category?.toLowerCase().includes('đào tạo') || item.category?.toLowerCase().includes('training')) ? 'training' as const : 'event' as const,
  }));

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #1e40af, #1e3a8a)' }}>
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center text-white hover:text-yellow-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Về trang chủ
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upcoming Events */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 font-montserrat">
                SỰ KIỆN SẮP DIỄN RA
              </h1>
              <button className="text-yellow-400 hover:text-yellow-300">
                <span className="text-2xl">»</span>
              </button>
            </div>

            {newsItems.length > 0 ? (
              <div className="space-y-6">
                {/* Featured Event */}
                {featuredEvent && (
                  <Link href={`/${locale}/news/${featuredEvent.id}`} className="block group">
                    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                      <div className="relative h-64 md:h-80">
                        {featuredEvent.thumbnailUrl ? (
                          <Image
                            src={featuredEvent.thumbnailUrl}
                            alt={featuredEvent.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">Không có hình ảnh</span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h2 className="text-xl md:text-2xl font-bold text-blue-800 mb-3 font-montserrat group-hover:text-blue-600 transition-colors">
                          {featuredEvent.title}
                        </h2>
                        {featuredEvent.description && (
                          <p className="text-gray-700 leading-relaxed">
                            {featuredEvent.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                )}

                {/* Event List */}
                {upcomingEvents.length > 0 && (
                  <div className="bg-white rounded-lg p-6 shadow-lg space-y-4">
                    {upcomingEvents.map((item) => (
                      <Link
                        key={item.id}
                        href={`/${locale}/news/${item.id}`}
                        className="flex gap-4 group hover:bg-gray-50 p-3 rounded-lg transition-colors"
                      >
                        <div className="relative w-24 h-24 flex-shrink-0 rounded overflow-hidden">
                          {item.thumbnailUrl ? (
                            <Image
                              src={item.thumbnailUrl}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-xs text-gray-400">No image</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {item.title}
                          </h3>
                          {item.description && (
                            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-12 text-center">
                <p className="text-gray-500 text-lg">Chưa có sự kiện nào được đăng</p>
              </div>
            )}
          </div>

          {/* Right Column - Calendar */}
          <div className="lg:col-span-1">
            <EventCalendar events={calendarEvents} />
          </div>
        </div>
      </main>
    </div>
  );
}