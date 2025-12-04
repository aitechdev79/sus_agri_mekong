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
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 md:text-4xl font-montserrat">
            Công Cụ Hỗ Trợ
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-6 justify-center max-w-3xl mx-auto">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="flex items-center gap-4 bg-white border-4 border-gray-300 rounded-lg px-6 py-4 hover:border-green-600 hover:shadow-lg transition-all duration-300 group md:flex-1"
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
      </div>
    </section>
  );
}