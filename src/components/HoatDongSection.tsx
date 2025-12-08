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
      colorClass: 'from-green-500 to-green-700',
      accentColor: 'bg-green-500',
      icon: '🌾',
    },
    {
      id: 'right-to-food',
      title: 'Dự án Right To Food',
      shortTitle: 'RIGHT TO FOOD',
      description: 'Thúc đẩy hợp tác khu vực tư nhân nhằm phát triển mô hình kinh doanh toàn diện và đầu tư có trách nhiệm',
      subtitle: 'Hỗ trợ doanh nghiệp trong chuỗi lúa gạo',
      link: 'https://policy-practice.oxfam.org/resources/a-common-sense-approach-to-the-right-to-food-558742/',
      colorClass: 'from-blue-500 to-blue-700',
      accentColor: 'bg-blue-500',
      icon: '🍚',
    },
    {
      id: 'dgd',
      title: 'Dự án DGD',
      shortTitle: 'DGD',
      description: 'Cải thiện khả năng tiếp cận thị trường quốc tế thông qua nâng cao kỹ năng làm việc và an toàn vệ sinh lao động',
      subtitle: 'Hỗ trợ doanh nghiệp trong chuỗi chế biến tôm và lúa gạo',
      link: 'https://vietnam.oxfam.org/kick-project-component-supporting-female-farmers-and-informal-workers',
      colorClass: 'from-orange-500 to-orange-700',
      accentColor: 'bg-orange-500',
      icon: '🦐',
    },
  ];

  return (
    <section className="py-20 w-full">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-16">
          <h2 className="text-4xl font-black text-white mb-6 md:text-5xl font-montserrat text-left tracking-tight">
            Hoạt động dự án
          </h2>
          <p className="text-xl text-teal-100 font-montserrat text-left max-w-3xl leading-relaxed">
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
              className="group relative rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 aspect-[2/3] bg-white hover:scale-[1.02]"
            >
              {/* Gradient Header */}
              <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-br ${activity.colorClass} transition-all duration-300 group-hover:h-36`}>
                {/* Decorative Circle */}
                <div className="absolute top-4 right-4 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-3xl">{activity.icon}</span>
                </div>

                {/* Project Short Title */}
                <div className="absolute bottom-4 left-4">
                  <span className="font-montserrat font-black text-white text-xl md:text-2xl drop-shadow-lg">
                    {activity.shortTitle}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-end p-6 pt-36">
                {/* Accent Bar */}
                <div className={`w-12 h-1 ${activity.accentColor} mb-4`}></div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 font-montserrat group-hover:text-gray-900 transition-colors">
                  {activity.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed font-montserrat mb-3 line-clamp-3">
                  {activity.description}
                </p>

                {/* Subtitle with Icon */}
                <div className="flex items-start gap-2 mt-2">
                  <span className="text-gray-400 text-xs mt-1">→</span>
                  <p className="text-gray-500 text-xs italic font-montserrat leading-relaxed">
                    {activity.subtitle}
                  </p>
                </div>

                {/* Learn More Link */}
                <div className="mt-4 flex items-center gap-2 text-sm font-montserrat font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                  <span>Tìm hiểu thêm</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}