'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function ToolsGrid() {
  const tools = [
    {
      id: 'library',
      title: 'Tìm kiếm thông tin',
      href: '/library',
      thumbnailImage: '/search.jpg',
    },
    {
      id: 'policy',
      title: 'Tìm hiểu ESG',
      href: '/esg',
      thumbnailImage: '/ESG_rice.jpg',
    },
  ];

  return (
    <section className="py-16 w-full">
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 md:text-4xl font-montserrat">
            Công Cụ Hỗ Trợ
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-stretch">
          {/* Left Side - Tool Buttons Stacked */}
          <div className="flex flex-col gap-6 md:flex-1">
            {tools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.href}
                className="flex items-center gap-4 bg-white border-4 border-gray-300 rounded-lg px-6 py-4 hover:border-green-600 hover:shadow-lg transition-all duration-300 group"
              >
                {/* Thumbnail Image */}
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={tool.thumbnailImage}
                    alt={`${tool.title} icon`}
                    fill
                    className="object-contain"
                    sizes="64px"
                  />
                </div>

                {/* Button Text */}
                <span className="text-lg md:text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors font-montserrat">
                  {tool.title}
                </span>
              </Link>
            ))}
          </div>

          {/* Right Side - Baocao 2025 Card */}
          <div className="md:flex-1">
            <Link
              href="/reports"
              className="block h-full rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative w-full h-full min-h-[300px] md:min-h-full bg-gradient-to-br from-green-500 via-green-600 to-green-700 p-8 flex flex-col items-center justify-center text-center">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full translate-y-20 -translate-x-20"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/5 rounded-full"></div>

                {/* Content */}
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">📊</span>
                    </div>
                  </div>

                  {/* Main Title */}
                  <h3 className="font-montserrat font-black text-4xl md:text-5xl text-white mb-3 drop-shadow-lg">
                    BÁO CÁO
                  </h3>
                  <div className="w-24 h-1 bg-white/50 mx-auto mb-3"></div>
                  <h4 className="font-montserrat font-black text-5xl md:text-6xl text-white drop-shadow-lg mb-4">
                    2025
                  </h4>

                  {/* Subtitle */}
                  <p className="font-montserrat text-base md:text-lg text-white/90 font-semibold max-w-sm mx-auto">
                    Phát triển Bền vững
                  </p>

                  {/* CTA Button - Bottom Right */}
                  <div className="absolute bottom-6 right-6 inline-flex items-center gap-2 bg-white text-green-700 font-montserrat font-bold px-6 py-3 rounded-full group-hover:bg-green-50 transition-colors">
                    <span>Xem báo cáo</span>
                    <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>

                {/* Animated Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-green-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}