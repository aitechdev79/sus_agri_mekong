'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, FileText } from 'lucide-react';

export default function ToolsGrid() {
  const tools = [
    {
      id: 'search',
      title: 'Tìm Kiếm Tài Liệu',
      description: 'Tìm kiếm và khám phá thư viện tài liệu phong phú về thực hành tốt',
      href: '/library?search=true',
      icon: Search,
      color: 'bg-blue-600',
      backgroundImage: '/tools/shrimp.png',
    },
    {
      id: 'policy',
      title: 'Chính Sách & Hướng Dẫn',
      description: 'Tìm hiểu các chính sách và hướng dẫn chính thức về nuôi tôm và trồng lúa',
      href: '/guidance-policy',
      icon: FileText,
      color: 'bg-green-600',
      backgroundImage: '/tools/rice.png',
    },
  ];

  return (
    <section className="py-16 bg-gray-50 relative overflow-hidden w-full">
      {/* Background SVG - Full Width */}
      <div className="absolute inset-0 w-full h-full opacity-10">
        <Image
          src="/vecteezy_topo_34242655.svg"
          alt="Topographic background"
          fill
          className="object-cover w-full h-full"
          priority={false}
          sizes="100vw"
        />
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 md:text-4xl font-montserrat text-left">
            Công Cụ Hỗ Trợ
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group relative bg-white rounded-lg shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-blue-200"
              style={{ boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)' }}
              aria-label={`${tool.title} - ${tool.description}`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={tool.backgroundImage}
                  alt={`${tool.title} background`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-white bg-opacity-50"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center text-center p-6">
                <div className={`${tool.color} rounded-full p-4 mb-4 group-hover:scale-110 transition-transform`}>
                  <tool.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-montserrat">
                  {tool.title}
                </h3>
                <p className="text-gray-600 mb-4 flex-grow font-montserrat">
                  {tool.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}