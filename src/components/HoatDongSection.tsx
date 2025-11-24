'use client';

import Image from 'next/image';

export default function HoatDongSection() {
  const activities = [
    {
      id: 'hoat-dong-1',
      title: 'Hoạt động 1',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      id: 'hoat-dong-2',
      title: 'Hoạt động 2',
      description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      id: 'hoat-dong-3',
      title: 'Hoạt động 3',
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    },
  ];

  return (
    <section className="py-20 bg-teal-800 relative overflow-hidden w-full" style={{ backgroundColor: '#1F4E4E' }}>
      {/* Background SVG - Full Width */}
      <div className="absolute inset-0 w-full h-full opacity-50">
        <Image
          src="/waving-blue-color-gradient-6543611.svg"
          alt="Waving gradient background"
          fill
          className="object-cover w-full h-full"
          priority={false}
          sizes="100vw"
        />
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="mb-16">
          <h2 className="text-4xl font-black text-white mb-6 md:text-5xl font-montserrat text-left tracking-tight">
            Hoạt động dự án
          </h2>
          <p className="text-xl text-teal-100 font-montserrat text-left max-w-3xl leading-relaxed">
            Tìm hiểu thêm về dự án đã và đang thực hiện của chúng tôi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="relative rounded-lg overflow-hidden shadow-xl transition-all duration-300 aspect-[2/3] bg-white"
            >
              {/* Content - Left Aligned at Bottom */}
              <div className="relative z-10 h-full flex flex-col justify-end p-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 transition-all duration-300 font-montserrat">
                  {activity.title}
                </h3>
                <p className="text-gray-600 text-sm md:text-base font-montserrat transition-all duration-300">
                  {activity.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}