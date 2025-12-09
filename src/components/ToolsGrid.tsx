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
        <div className="mb-12 text-left">
          <h2 className="text-3xl font-bold mb-4 md:text-4xl font-montserrat" style={{ color: '#3C3C3B' }}>
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
                className="group block overflow-hidden bg-white transition-all duration-500"
                style={{
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                }}
              >
                {/* Content Container - Zooms on hover */}
                <div className="flex flex-row items-center px-6 py-4 transition-transform duration-500 group-hover:scale-105" style={{ minHeight: '100px' }}>
                  {/* Thumbnail on Left */}
                  <div className="relative w-16 h-16 flex-shrink-0 mr-4 bg-gray-100 overflow-hidden">
                    <Image
                      src={tool.thumbnailImage}
                      alt={`${tool.title} thumbnail`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-lg md:text-xl font-bold font-montserrat" style={{ color: '#3C3C3B' }}>
                      {tool.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Side - Baocao 2025 Card */}
          <div className="md:flex-1">
            <div
              className="group block overflow-hidden transition-all duration-500 h-full"
              style={{
                backgroundColor: '#0A7029',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
              }}
            >
              {/* Content Container - Zooms on hover */}
              <div className="flex flex-col items-center justify-center text-center p-6 h-full transition-transform duration-500 group-hover:scale-105" style={{ minHeight: '100px' }}>
                {/* Icon Container */}
                <div className="mb-3 w-12 h-12 bg-white/20 flex items-center justify-center">
                  <span className="text-3xl">📊</span>
                </div>

                {/* Title */}
                <h3 className="font-montserrat font-black text-2xl mb-1 text-white">
                  BÁO CÁO
                </h3>
                <h4 className="font-montserrat font-black text-3xl mb-2 text-white">
                  2025
                </h4>

                {/* Subtitle */}
                <p className="font-montserrat text-sm font-semibold text-white/90">
                  Phát triển Bền vững
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}