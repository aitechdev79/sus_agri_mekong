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
              className="block h-full rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="relative w-full h-full min-h-[300px] md:min-h-full">
                <Image
                  src="/baocao 2025.png"
                  alt="Báo cáo 2025"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}