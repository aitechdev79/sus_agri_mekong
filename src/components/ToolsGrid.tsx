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
          <h2 className="text-3xl font-bold text-vn-green mb-4 md:text-4xl font-montserrat">
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
                className="relative flex-1 flex flex-row bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group hover:scale-[1.02] border-t-4 border-vn-green"
                style={{
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  minHeight: '100px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(255, 184, 28, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }}
              >
                {/* Thumbnail on Left - Full Height */}
                <div className="relative w-32 flex-shrink-0 overflow-hidden">
                  <div className="absolute inset-0 bg-vn-green/10 group-hover:bg-vn-green/20 transition-colors duration-300 z-10"></div>
                  <Image
                    src={tool.thumbnailImage}
                    alt={`${tool.title} thumbnail`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="128px"
                  />
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col justify-center px-6 py-4 bg-gradient-to-b from-white to-gray-50">
                  <h3 className="text-lg md:text-xl font-bold text-vn-dark group-hover:text-vn-green transition-colors font-montserrat mb-1">
                    {tool.title}
                  </h3>
                  <div className="flex items-center gap-2 text-vn-green group-hover:text-vn-gold transition-colors duration-300">
                    <span className="text-sm font-semibold font-montserrat">Khám phá ngay</span>
                    <span className="text-lg transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Side - Baocao 2025 Card */}
          <div className="md:flex-1">
            <div
              className="block h-full rounded-lg overflow-hidden transition-all duration-300 group hover:scale-105 border-t-4 border-vn-green bg-white"
              style={{
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(255, 184, 28, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }}
            >
              <div className="relative w-full h-full bg-gradient-to-br from-vn-green via-vn-green-dark to-vn-green-dark p-8 flex flex-col items-center justify-center text-center transition-all duration-300">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:bg-white/20 transition-colors duration-300"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full translate-y-20 -translate-x-20 group-hover:bg-white/20 transition-colors duration-300"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/5 rounded-full group-hover:bg-white/10 transition-colors duration-300"></div>

                {/* Content */}
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-colors duration-300">
                      <span className="text-4xl">📊</span>
                    </div>
                  </div>

                  {/* Main Title */}
                  <h3 className="font-montserrat font-black text-4xl md:text-5xl text-white mb-3 drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-300">
                    BÁO CÁO
                  </h3>
                  <div className="w-24 h-1 bg-vn-gold mx-auto mb-3 group-hover:w-32 transition-all duration-300"></div>
                  <h4 className="font-montserrat font-black text-5xl md:text-6xl text-white drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-300">
                    2025
                  </h4>

                  {/* Subtitle */}
                  <p className="font-montserrat text-base md:text-lg text-white/90 font-semibold max-w-sm mx-auto group-hover:text-white transition-colors duration-300">
                    Phát triển Bền vững
                  </p>
                </div>

                {/* Animated Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}