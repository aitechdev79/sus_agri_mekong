'use client';

import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ShieldPlus, Sprout, Wheat } from 'lucide-react';

export default function HoatDongDuAnPage() {
  const activities = [
    {
      id: 'graisea',
      title: 'Dự án Graisea',
      shortTitle: 'GRAISEA',
      description:
        'GRAISEA thúc đẩy các mô hình ba bên cùng có lợi (win-win-win), mang lại lợi ích cho cộng đồng, những nhà sản xuất quy mô nhỏ và các doanh nghiệp lớn.',
      link: 'https://graisea.github.io/',
      icon: <Sprout size={72} strokeWidth={2} />,
      label: 'Graisea',
      tag: 'Bình đẳng giới và đầu tư kinh doanh nông nghiệp có trách nhiệm',
      iconBg: '#5e42a6',
    },
    {
      id: 'right-to-food',
      title: 'Dự án Right To Food',
      shortTitle: 'RIGHT TO FOOD',
      description:
        'Các nghiên cứu nhằm phân tích cách người dân diễn giải và xác định trách nhiệm liên quan đến việc bảo đảm quyền được có lương thực.',
      link: 'https://policy-practice.oxfam.org/resources/a-common-sense-approach-to-the-right-to-food-558742/',
      icon: <Wheat size={48} strokeWidth={2} />,
      label: 'Right To Food',
      tag: 'Quyền được có lương thực',
      iconBg: '#0A7029',
    },
    {
      id: 'dgd',
      title: 'Dự án DGD',
      shortTitle: 'DGD',
      description:
        'Cải thiện an sinh xã hội và việc làm bền vững cho lao động nữ và người lao động phi chính thức trong chuỗi giá trị lúa gạo và tôm tại Việt Nam',
      link: 'https://vietnam.oxfam.org/kick-project-component-supporting-female-farmers-and-informal-workers',
      icon: <ShieldPlus size={48} strokeWidth={2} />,
      label: 'DGD',
      tag: 'Nâng cao kỹ năng làm việc và an toàn vệ sinh lao động',
      iconBg: '#edd907',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="relative z-50">
        <NavigationBar />
      </div>

      <main className="pt-16">
        <section className="py-16 bg-vn-rice-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="mb-10">
              <h1 className="text-3xl md:text-4xl font-bold font-montserrat" style={{ color: '#3C3C3B' }}>
                Hoạt động dự án
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
              {activities.map((activity) => (
                <Link
                  key={activity.id}
                  href={activity.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block flex flex-col w-full max-w-md mx-auto md:max-w-none md:mx-0"
                  aria-label={`${activity.title} - ${activity.description}`}
                >
                  <div
                    className="relative overflow-hidden mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-500"
                    style={{ aspectRatio: '16/9', backgroundColor: '#F7F3EA' }}
                  >
                    <div className="flex flex-col items-start gap-3 text-left">
                      <div className="flex items-center gap-4">
                        <div
                          className="rounded-full flex items-center justify-center text-white shadow-md w-24 h-24"
                          style={{ backgroundColor: activity.iconBg }}
                        >
                          {activity.icon}
                        </div>
                        <span className="font-montserrat font-black text-xl md:text-2xl" style={{ color: '#3C3C3B' }}>
                          {activity.label}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm font-montserrat max-w-xs" style={{ color: '#6B7280' }}>
                        {activity.tag}
                      </p>
                    </div>
                  </div>

                  <div className="pb-4 relative flex-1 flex flex-col" style={{ minHeight: '120px' }}>
                    <div className="absolute bottom-0 left-0 w-full h-0.5" style={{ backgroundColor: '#E8F5E9' }}></div>
                    <div
                      className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 ease-out"
                      style={{ backgroundColor: '#0A7029' }}
                    ></div>
                    <p className="text-sm md:text-base font-montserrat flex-1" style={{ color: '#6B7280' }}>
                      {activity.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
