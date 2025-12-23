'use client';

import Link from 'next/link';
import { Sprout, Target, ExternalLink, ArrowRight } from 'lucide-react';

export default function HoatDongSection() {
  const activities = [
    {
      id: 'graisea',
      title: 'Dự án Graisea',
      shortTitle: 'GRAISEA',
      description: 'Tăng cường bình đẳng giới và đầu tư kinh doanh nông nghiệp có trách nhiệm tại Đông Nam Á',
      subtitle: 'Hỗ trợ nâng cao năng lực cho doanh nghiệp trong chuỗi chế biến tôm và lúa gạo',
      link: 'https://graisea.github.io/',
      borderColor: 'border-vn-green',
      iconBgColor: 'bg-vn-green-light',
      iconColor: 'text-vn-green',
      icon: '🌾',
    },
    {
      id: 'right-to-food',
      title: 'Dự án Right To Food',
      shortTitle: 'RIGHT TO FOOD',
      description: 'Thúc đẩy hợp tác khu vực tư nhân nhằm phát triển mô hình kinh doanh toàn diện và đầu tư có trách nhiệm',
      subtitle: 'Hỗ trợ doanh nghiệp trong chuỗi lúa gạo',
      link: 'https://policy-practice.oxfam.org/resources/a-common-sense-approach-to-the-right-to-food-558742/',
      borderColor: 'border-vn-green',
      iconBgColor: 'bg-vn-green-light',
      iconColor: 'text-vn-green',
      icon: '🍚',
    },
    {
      id: 'dgd',
      title: 'Dự án DGD',
      shortTitle: 'DGD',
      description: 'Cải thiện khả năng tiếp cận thị trường quốc tế thông qua nâng cao kỹ năng làm việc và an toàn vệ sinh lao động',
      subtitle: 'Hỗ trợ doanh nghiệp trong chuỗi chế biến tôm và lúa gạo',
      link: 'https://vietnam.oxfam.org/kick-project-component-supporting-female-farmers-and-informal-workers',
      borderColor: 'border-vn-green',
      iconBgColor: 'bg-vn-green-light',
      iconColor: 'text-vn-green',
      icon: '🦐',
    },
  ];

  return (
    <section className="py-20 w-full bg-vn-rice-white">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-16">
          <h2 className="text-4xl font-black mb-6 md:text-5xl font-montserrat text-left tracking-tight" style={{ color: '#3C3C3B' }}>
            Hoạt động dự án
          </h2>
          <p className="text-xl font-montserrat text-left max-w-3xl leading-relaxed" style={{ color: '#6B7280' }}>
            Tìm hiểu thêm về các dự án đã và đang thực hiện của chúng tôi với các đối tác quốc tế.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {activities.map((activity) => {
            if (activity.id === 'dgd') {
              return (
                <Link
                  key={activity.id}
                  href={activity.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block h-full overflow-hidden rounded-2xl bg-white border border-[#E7E2D9] transition-all duration-500"
                  style={{
                    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.08)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 14px 30px rgba(0, 0, 0, 0.14)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  <div className="relative flex h-full flex-col p-6">
                    {/* Icon Circle */}
                    <div className="relative mb-5 w-16 h-16 rounded-full bg-gradient-to-br from-[#0A7029] to-[#0E8A38] flex items-center justify-center shadow-md">
                      <Sprout size={32} strokeWidth={2.5} color="white" />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm shadow-sm">
                        🦐
                      </div>
                    </div>

                    {/* Project Tag */}
                    <div className="mb-3">
                      <span className="inline-flex items-center rounded-full bg-[#F6E7BF] px-3 py-1 text-xs font-bold tracking-wide text-[#7A5A00]">
                        {activity.shortTitle}
                      </span>
                    </div>

                    {/* Headline */}
                    <h3 className="text-xl font-bold mb-3 font-montserrat" style={{ color: '#3C3C3B' }}>
                      {activity.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm leading-relaxed font-montserrat mb-4" style={{ color: '#6B7280' }}>
                      {activity.description}
                    </p>

                    {/* Focus Area Box */}
                    <div className="rounded-xl border border-[#E3EFE6] bg-[#F3F9F4] p-3 flex items-start gap-2">
                      <Target size={18} className="mt-0.5 text-[#0A7029]" />
                      <div className="text-xs font-montserrat" style={{ color: '#3C3C3B' }}>
                        <span className="font-bold">Hỗ trợ:</span> {activity.subtitle}
                      </div>
                    </div>

                    {/* CTA Area */}
                    <div className="mt-auto pt-4 flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-sm font-montserrat font-semibold" style={{ color: '#0A7029' }}>
                        Tìm hiểu thêm
                        <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                      <span className="w-9 h-9 rounded-full bg-[#0A7029]/10 flex items-center justify-center text-[#0A7029] transition-colors duration-300 group-hover:bg-[#0A7029] group-hover:text-white">
                        <ExternalLink size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            }

            return (
              <Link
                key={activity.id}
                href={activity.link}
                target="_blank"
                rel="noopener noreferrer"
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
                <div className="flex flex-col items-center text-center p-6 transition-transform duration-500 group-hover:scale-105">
                  {/* Icon Container - Zooms with content */}
                  <div className="mb-4 w-16 h-16 bg-gray-100 flex items-center justify-center transition-transform duration-500">
                    <span className="text-3xl">{activity.icon}</span>
                  </div>
              
                  {/* Project Short Title */}
                  <div className="mb-3">
                    <span className="font-montserrat font-black text-xl md:text-2xl" style={{ color: '#3C3C3B' }}>
                      {activity.shortTitle}
                    </span>
                  </div>
              
                  {/* Title */}
                  <h3 className="text-lg md:text-xl font-bold mb-3 font-montserrat" style={{ color: '#3C3C3B' }}>
                    {activity.title}
                  </h3>
              
                  {/* Description */}
                  <p className="text-sm leading-relaxed font-montserrat mb-3 line-clamp-3" style={{ color: '#6B7280' }}>
                    {activity.description}
                  </p>
              
                  {/* Subtitle */}
                  <p className="text-xs italic font-montserrat leading-relaxed mb-4" style={{ color: '#9CA3AF' }}>
                    {activity.subtitle}
                  </p>
              
                  {/* Learn More Link */}
                  <div className="flex items-center gap-2 text-sm font-montserrat font-semibold transition-colors duration-300" style={{ color: '#0A7029' }}>
                    <span>Tìm hiểu thêm</span>
                    <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

