'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
}

export default function Report2025Section() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const newsItems: NewsItem[] = [
    {
      id: '1',
      title: 'Báo cáo ESG 2025: Xu hướng Phát triển Bền vững',
      excerpt: 'Phân tích chi tiết về các xu hướng ESG và phát triển bền vững trong năm 2025',
      image: '/news/esg-trends.jpg',
      date: '15/01/2025',
      category: 'ESG',
    },
    {
      id: '2',
      title: 'Chuyển đổi Xanh trong Doanh nghiệp Việt Nam',
      excerpt: 'Khảo sát 500 doanh nghiệp về tiến trình chuyển đổi xanh và thách thức',
      image: '/news/green-transformation.jpg',
      date: '10/01/2025',
      category: 'Chuyển đổi xanh',
    },
    {
      id: '3',
      title: 'An toàn Lao động: Thành tựu và Thách thức',
      excerpt: 'Đánh giá toàn diện về tình hình ATVSLĐ tại các doanh nghiệp',
      image: '/news/labor-safety.jpg',
      date: '05/01/2025',
      category: 'ATVSLĐ',
    },
    {
      id: '4',
      title: 'Kinh tế Tuần hoàn: Cơ hội cho Doanh nghiệp',
      excerpt: 'Mô hình kinh tế tuần hoàn đang mở ra nhiều cơ hội mới cho doanh nghiệp',
      image: '/news/circular-economy.jpg',
      date: '28/12/2024',
      category: 'Kinh tế tuần hoàn',
    },
    {
      id: '5',
      title: 'Nông nghiệp Bền vững: Hướng đi Mới',
      excerpt: 'Các giải pháp công nghệ giúp nông nghiệp phát triển bền vững',
      image: '/news/sustainable-agriculture.jpg',
      date: '20/12/2024',
      category: 'Nông nghiệp',
    },
    {
      id: '6',
      title: 'Đầu tư ESG: Xu hướng Toàn cầu',
      excerpt: 'Nhà đầu tư ngày càng ưu tiên các doanh nghiệp có thực hành ESG tốt',
      image: '/news/esg-investment.jpg',
      date: '15/12/2024',
      category: 'Đầu tư',
    },
  ];

  // Auto-scroll every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 4 >= newsItems.length ? 0 : prev + 4));
    }, 4000);

    return () => clearInterval(timer);
  }, [newsItems.length]);

  // Get current 4 items to display
  const displayedItems = newsItems.slice(currentIndex, currentIndex + 4);

  // If less than 4 items, wrap around
  const finalDisplayItems = displayedItems.length < 4
    ? [...displayedItems, ...newsItems.slice(0, 4 - displayedItems.length)]
    : displayedItems;

  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <Image
          src="/vecteezy_topo_34242655.svg"
          alt="Background pattern"
          fill
          className="object-cover"
          priority={false}
        />
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Báo cáo 2025 Design */}
          <div className="relative">
            <div className="relative aspect-square bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 rounded-2xl shadow-2xl overflow-hidden group hover:scale-105 transition-transform duration-500">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full translate-y-20 -translate-x-20"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full"></div>

              {/* Main Content */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
                {/* Icon/Symbol */}
                <div className="mb-6">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                    <span className="text-5xl">📊</span>
                  </div>
                </div>

                {/* Main Title */}
                <h2 className="font-montserrat font-black text-5xl md:text-6xl text-white mb-4 drop-shadow-lg">
                  BÁO CÁO
                </h2>
                <div className="w-32 h-1 bg-white/50 mb-4"></div>
                <h3 className="font-montserrat font-black text-6xl md:text-7xl text-white drop-shadow-lg mb-6">
                  2025
                </h3>

                {/* Subtitle */}
                <p className="font-montserrat text-lg md:text-xl text-white/90 font-semibold mb-8 max-w-sm">
                  Tổng quan Phát triển Bền vững & ESG tại Việt Nam
                </p>

                {/* CTA Button */}
                <Link
                  href="/reports"
                  className="px-8 py-4 bg-white text-amber-600 font-montserrat font-bold rounded-full hover:bg-amber-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Xem báo cáo →
                </Link>

                {/* Decorative Corner Badge */}
                <div className="absolute top-6 left-6 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-white font-montserrat font-bold text-sm">NEW</p>
                </div>
              </div>

              {/* Animated Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-yellow-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>

          {/* Right Side - 2x2 News Carousel */}
          <div className="relative">
            <div className="mb-6">
              <h3 className="font-montserrat font-bold text-2xl md:text-3xl text-gray-800 mb-2">
                Tin tức nổi bật
              </h3>
              <p className="text-gray-600 font-montserrat">
                Cập nhật thông tin mới nhất về phát triển bền vững
              </p>
            </div>

            {/* 2x2 Grid of News Cards */}
            <div className="grid grid-cols-2 gap-4">
              {finalDisplayItems.map((item, index) => (
                <div
                  key={`${item.id}-${currentIndex}-${index}`}
                  className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fadeIn"
                  style={{
                    animation: `fadeIn 0.5s ease-in-out ${index * 0.1}s`,
                  }}
                >
                  {/* Image */}
                  <div className="relative h-32 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl opacity-30">📰</span>
                    </div>
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                    {/* Category Badge */}
                    <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-montserrat font-bold px-2 py-1 rounded">
                      {item.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h4 className="font-montserrat font-bold text-sm text-gray-800 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-600 font-montserrat line-clamp-2 mb-3">
                      {item.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-montserrat">{item.date}</span>
                      <span className="text-amber-600 text-xs font-montserrat font-semibold">
                        Đọc thêm →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: Math.ceil(newsItems.length / 4) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index * 4)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    Math.floor(currentIndex / 4) === index
                      ? 'bg-amber-500 w-8'
                      : 'bg-gray-300 w-2 hover:bg-amber-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out forwards;
        }
      `}</style>
    </section>
  );
}
