'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, FileText, MessageSquare } from 'lucide-react';

export default function ToolsGrid() {
  const tools = [
    {
      id: 'search',
      title: 'Tìm Kiếm Tài Liệu',
      description: 'Tìm kiếm và khám phá thư viện tài liệu phong phú về thực hành tốt',
      href: '/library?search=true',
      icon: Search,
      color: 'bg-blue-500',
      backgroundImage: '/tools/shrimp.png',
    },
    {
      id: 'policy',
      title: 'Chính Sách & Hướng Dẫn',
      description: 'Tìm hiểu các chính sách và hướng dẫn chính thức về nuôi tôm và trồng lúa',
      href: '/library?type=POLICY',
      icon: FileText,
      color: 'bg-green-500',
      backgroundImage: '/tools/rice.png',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 md:text-4xl font-montserrat">
            Công Cụ Hỗ Trợ
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
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
                <div className="absolute inset-0 bg-white bg-opacity-70"></div>
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