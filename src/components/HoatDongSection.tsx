'use client';

import Link from 'next/link';
import { Sprout, ShieldPlus, Wheat } from 'lucide-react';

export default function HoatDongSection() {
  const activities = [
    {
      id: 'graisea',
      title: 'Dự án Graisea',
      shortTitle: 'GRAISEA',
      description:
        'GRAISEA thúc đẩy các mô hình ba bên cùng có lợi (win-win-win), mang lại lợi ích cho cộng đồng, những nhà sản xuất quy mô nhỏ và các doanh nghiệp lớn.',
      subtitle: 'Hỗ trợ nâng cao năng lực cho doanh nghiệp trong chuỗi chế biến tôm và lúa gạo',
      link: 'https://graisea.github.io/',
      borderColor: 'border-vn-green',
      iconBgColor: 'bg-vn-green-light',
      iconColor: 'text-vn-green',
    },
    {
      id: 'right-to-food',
      title: 'Dự án Right To Food',
      shortTitle: 'RIGHT TO FOOD',
      description:
        'Các nghiên cứu nhằm phân tích cách người dân diễn giải và xác định trách nhiệm liên quan đến việc bảo đảm quyền được có lương thực.',
      subtitle: 'Hỗ trợ doanh nghiệp trong chuỗi lúa gạo',
      link: 'https://policy-practice.oxfam.org/resources/a-common-sense-approach-to-the-right-to-food-558742/',
      borderColor: 'border-vn-green',
      iconBgColor: 'bg-vn-green-light',
      iconColor: 'text-vn-green',
    },
    {
      id: 'dgd',
      title: 'Dự án DGD',
      shortTitle: 'DGD',
      description:
        'Cải thiện an sinh xã hội và việc làm bền vững cho lao động nữ và người lao động phi chính thức trong chuỗi giá trị lúa gạo và tôm tại Việt Nam',
      subtitle: 'Hỗ trợ doanh nghiệp trong chuỗi chế biến tôm và lúa gạo',
      link: 'https://vietnam.oxfam.org/kick-project-component-supporting-female-farmers-and-informal-workers',
      borderColor: 'border-vn-green',
      iconBgColor: 'bg-vn-green-light',
      iconColor: 'text-vn-green',
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-end">
          {activities.map((activity) => {
            const isGraisea = activity.id === 'graisea';
            const isRightToFood = activity.id === 'right-to-food';
            const isDgd = activity.id === 'dgd';
            const icon =
              activity.id === 'graisea' ? (
                <Sprout size={72} strokeWidth={2} />
              ) : activity.id === 'right-to-food' ? (
                <Wheat size={48} strokeWidth={2} />
              ) : (
                <ShieldPlus size={48} strokeWidth={2} />
              );

            return (
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
                  {isGraisea || isRightToFood || isDgd ? (
                    <div className="flex flex-col items-start gap-3 text-left">
                      <div className="flex items-center gap-4">
                        <div
                          className={`rounded-full flex items-center justify-center text-white shadow-md ${
                            isGraisea || isRightToFood || isDgd ? 'w-24 h-24' : 'w-16 h-16'
                          }`}
                          style={{ backgroundColor: isGraisea ? '#5e42a6' : isDgd ? '#edd907' : '#0A7029' }}
                        >
                          {icon}
                        </div>
                        {isGraisea ? (
                          <span className="font-montserrat font-black text-2xl md:text-3xl" style={{ color: '#3C3C3B' }}>
                            Graisea
                          </span>
                        ) : isDgd ? (
                          <span className="font-montserrat font-black text-xl md:text-2xl" style={{ color: '#3C3C3B' }}>
                            DGD
                          </span>
                        ) : (
                          <span className="font-montserrat font-black text-xl md:text-2xl" style={{ color: '#3C3C3B' }}>
                            Right To Food
                          </span>
                        )}
                      </div>
                      <p className="text-xs md:text-sm font-montserrat max-w-xs" style={{ color: '#6B7280' }}>
                        {isGraisea
                          ? 'Bình đẳng giới và đầu tư kinh doanh nông nghiệp có trách nhiệm'
                          : isDgd
                            ? 'Nâng cao kỹ năng làm việc và an toàn vệ sinh lao động'
                          : 'Quyền được có lương thực'}
                      </p>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-[#0A7029] flex items-center justify-center text-white shadow-md">
                      {icon}
                    </div>
                  )}
                </div>

                <div className="pb-4 relative flex-1 flex flex-col" style={{ minHeight: '120px' }}>
                  <div className="absolute bottom-0 left-0 w-full h-0.5" style={{ backgroundColor: '#E8F5E9' }}></div>
                  <div
                    className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 ease-out"
                    style={{ backgroundColor: '#0A7029' }}
                  ></div>
                  {!isGraisea && !isRightToFood && !isDgd && (
                    <h3 className="text-lg md:text-xl font-bold mb-2 font-montserrat" style={{ color: '#3C3C3B' }}>
                      {activity.title}
                    </h3>
                  )}
                  <p className="text-sm md:text-base font-montserrat flex-1" style={{ color: '#6B7280' }}>
                    {activity.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

