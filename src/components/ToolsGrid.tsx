'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function ToolsGrid() {
  const tools = [
    {
      id: 'library',
      title: 'Tìm kiếm thông tin',
      description: 'Tra cứu và tìm kiếm thông tin về thực hành bền vững trong chuỗi giá trị',
      href: '/library',
      backgroundImage: '/thuvien_grok.jpg',
    },
    {
      id: 'regulations',
      title: 'Chính sách và quy định',
      description: 'Cập nhật các chính sách, quy định và văn bản pháp luật liên quan đến doanh nghiệp',
      href: '/guidance-policy',
      backgroundImage: '/chinhsachquydinh.jpg',
    },
    {
      id: 'research',
      title: 'Nghiên cứu và báo cáo',
      description: 'Khám phá các nghiên cứu, báo cáo và phân tích chuyên sâu về phát triển bền vững',
      href: '/library',
      backgroundImage: '/nghiencuubaocao.jpg',
    },
    {
      id: 'policy',
      title: 'ESG',
      description: 'Tìm hiểu về Môi trường, Xã hội và Quản trị doanh nghiệp bền vững',
      href: '/esg',
      backgroundImage: '/esg_thumb.jpg',
    },
  ];

  return (
    <section className="py-16 bg-gray-50 relative overflow-hidden w-full">
      {/* Background SVG - Full Width */}
      <div className="absolute inset-0 w-full h-full opacity-50">
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group relative rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 aspect-[2/3]"
              aria-label={`${tool.title} - ${tool.description}`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={tool.backgroundImage}
                  alt={`${tool.title} background`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                {/* Lighter gradient only at bottom for text readability */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>

              {/* Content - Left Aligned at Bottom */}
              <div className="relative z-10 h-full flex flex-col justify-end p-6">
                <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-0 md:group-hover:mb-3 transition-all duration-300 font-montserrat">
                  {tool.title}
                </h3>
                <p className="text-white/90 text-sm md:text-base font-montserrat md:max-h-0 md:overflow-hidden md:opacity-0 md:group-hover:max-h-32 md:group-hover:opacity-100 transition-all duration-300">
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