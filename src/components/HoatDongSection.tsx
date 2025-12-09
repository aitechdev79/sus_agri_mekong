'use client';

import Link from 'next/link';

export default function HoatDongSection() {
  const activities = [
    {
      id: 'graisea',
      title: 'Dự án Graisea',
      shortTitle: 'GRAISEA',
      description: 'Tăng cường bình đẳng giới và đầu tư kinh doanh nông nghiệp có trách nhiệm tại Đông Nam Á',
      subtitle: 'Hỗ trợ nâng cao năng lực cho doanh nghiệp trong chuỗi chế biến tôm và lúa gạo',
      link: 'https://graisea.github.io/',
      borderColor: 'border-vn-gold',
      iconBgColor: 'bg-vn-gold-light',
      iconColor: 'text-vn-gold',
      icon: '🌾',
    },
    {
      id: 'right-to-food',
      title: 'Dự án Right To Food',
      shortTitle: 'RIGHT TO FOOD',
      description: 'Thúc đẩy hợp tác khu vực tư nhân nhằm phát triển mô hình kinh doanh toàn diện và đầu tư có trách nhiệm',
      subtitle: 'Hỗ trợ doanh nghiệp trong chuỗi lúa gạo',
      link: 'https://policy-practice.oxfam.org/resources/a-common-sense-approach-to-the-right-to-food-558742/',
      borderColor: 'border-vn-gold',
      iconBgColor: 'bg-vn-gold-light',
      iconColor: 'text-vn-gold',
      icon: '🍚',
    },
    {
      id: 'dgd',
      title: 'Dự án DGD',
      shortTitle: 'DGD',
      description: 'Cải thiện khả năng tiếp cận thị trường quốc tế thông qua nâng cao kỹ năng làm việc và an toàn vệ sinh lao động',
      subtitle: 'Hỗ trợ doanh nghiệp trong chuỗi chế biến tôm và lúa gạo',
      link: 'https://vietnam.oxfam.org/kick-project-component-supporting-female-farmers-and-informal-workers',
      borderColor: 'border-vn-gold',
      iconBgColor: 'bg-vn-gold-light',
      iconColor: 'text-vn-gold',
      icon: '🦐',
    },
  ];

  return (
    <section className="py-20 w-full bg-vn-rice-white">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-16">
          <h2 className="text-4xl font-black text-vn-green mb-6 md:text-5xl font-montserrat text-left tracking-tight">
            Hoạt động dự án
          </h2>
          <p className="text-xl text-vn-dark font-montserrat text-left max-w-3xl leading-relaxed">
            Tìm hiểu thêm về các dự án đã và đang thực hiện của chúng tôi với các đối tác quốc tế.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {activities.map((activity) => (
            <Link
              key={activity.id}
              href={activity.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white border-l-[6px] ${activity.borderColor} hover:-translate-y-1`}
            >
              {/* Content */}
              <div className="relative z-10 h-full flex flex-col p-6">
                {/* Icon Container */}
                <div className={`w-16 h-16 ${activity.iconBgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <span className={`text-3xl ${activity.iconColor}`}>{activity.icon}</span>
                </div>

                {/* Project Short Title */}
                <div className="mb-3">
                  <span className="font-montserrat font-black text-vn-dark text-xl md:text-2xl">
                    {activity.shortTitle}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-bold text-vn-dark mb-3 font-montserrat">
                  {activity.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed font-montserrat mb-3 line-clamp-3">
                  {activity.description}
                </p>

                {/* Subtitle with Icon */}
                <div className="flex items-start gap-2 mt-2 mb-4">
                  <span className="text-gray-400 text-xs mt-1">→</span>
                  <p className="text-gray-500 text-xs italic font-montserrat leading-relaxed">
                    {activity.subtitle}
                  </p>
                </div>

                {/* Learn More Link */}
                <div className="mt-auto flex items-center gap-2 text-sm font-montserrat font-semibold text-vn-green group-hover:text-vn-red transition-colors duration-300">
                  <span>Tìm hiểu thêm</span>
                  <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}