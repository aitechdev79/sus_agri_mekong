'use client';

import Image from 'next/image';
import Link from 'next/link';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';

export default function MembersPage() {

  const memberLogos = [
    { id: 1, name: 'Greenfeed', src: '/members/01-Greenfeed.png' },
    { id: 2, name: 'CP', src: '/members/02-CP.jpg' },
    { id: 3, name: 'Bình Điền', src: '/members/03-binhdien.jpg' },
    { id: 4, name: 'VCCI', src: '/members/04-VCCI.jpg' },
    { id: 5, name: 'Oxfam', src: '/members/05-Oxfam.png' },
    { id: 6, name: 'Lộc Trời', src: '/members/06-loctroi.png' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden w-screen"
        style={{
          height: '75vh',
          marginLeft: 'calc(50% - 50vw)',
          marginRight: 'calc(50% - 50vw)'
        }}
      >
        {/* Navigation Bar */}
        <NavigationBar />

        {/* Background Image */}
        <div
          className="absolute inset-0"
          style={{
            width: '100vw',
            height: '75vh',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        >
          <Image
            src="/hero/hero_members.jpg"
            alt="Doanh nghiệp Việt Nam cùng chung tay phát triển"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{
              objectFit: 'cover',
              objectPosition: 'center center'
            }}
          />
        </div>

        {/* Main Hero Content */}
        <div className="relative flex h-full items-center pt-16" style={{ zIndex: 10 }}>
          <div className="max-w-6xl px-6 w-full mx-auto">
            <div className="max-w-2xl">
              {/* Main Headline - Left aligned */}
              <div className="mb-6">
                <h1 className="font-montserrat font-bold text-white text-left" style={{ lineHeight: '1.1', letterSpacing: '0.5px' }}>
                  <div className="text-2xl md:text-3xl lg:text-5xl">
                    Doanh nghiệp Việt Nam
                  </div>
                  <div className="text-2xl md:text-3xl lg:text-5xl">
                    cùng chung tay phát triển
                  </div>
                  <div className="text-2xl md:text-3xl lg:text-5xl">
                    cho một chuỗi cung ứng bền vững
                  </div>
                </h1>
              </div>

              {/* Subheadline - Left aligned */}
              <div className="mb-6">
                <p className="font-montserrat font-normal text-white text-left max-w-lg text-xs md:text-sm lg:text-xl" style={{ lineHeight: '1.5' }}>
                  Hợp tác cùng các đối tác để xây dựng tương lai bền vững.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section - Full Width Background */}
      <section
        className="w-screen mb-16"
        style={{
          backgroundColor: '#F7F7F7',
          marginLeft: 'calc(50% - 50vw)',
          marginRight: 'calc(50% - 50vw)'
        }}
      >
        <div className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-0">
              {/* Text Content */}
              <div className="flex-1">
                <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-gray-800 mb-6 text-left">
                  Thành viên của chúng tôi
                </h2>
                <div className="max-w-2xl">
                  <p className="font-montserrat text-lg text-gray-600 leading-relaxed mb-4 text-left">
                    Chúng tôi tự hào hợp tác cùng với các doanh nghiệp, tổ chức hàng đầu trong việc xây dựng
                    một chuỗi cung ứng nông nghiệp bền vững tại Việt Nam. Cùng nhau, chúng ta chia sẻ cam kết
                    về đổi mới, bền vững và phát triển chung.
                  </p>
                  <p className="font-montserrat text-lg text-gray-600 leading-relaxed text-left">
                    Thông qua sự hợp tác này, chúng tôi không ngừng nỗ lực để mang lại những giải pháp
                    tối ưu cho ngành nông nghiệp, góp phần vào sự phát triển kinh tế và xã hội bền vững.
                  </p>
                </div>
              </div>

              {/* Art Image */}
              <div className="flex-shrink-0">
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                  <Image
                    src="/members/art_members.png"
                    alt="Thành viên hợp tác"
                    fill
                    className="object-contain scale-120"
                    sizes="(max-width: 768px) 256px, 320px"
                    style={{ transform: 'scale(1.2)' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16">

        {/* Members Grid Section */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {memberLogos.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex items-center justify-center group hover:scale-105"
                style={{ aspectRatio: '1', minHeight: '150px' }}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={member.src}
                    alt={`Logo ${member.name}`}
                    fill
                    className="object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 md:p-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-0">
              {/* Text Content */}
              <div className="flex-1">
                <h3 className="font-montserrat font-bold text-2xl md:text-3xl text-gray-800 mb-6 text-left">
                  Tham gia cộng đồng doanh nghiệp
                </h3>
                <div className="max-w-2xl">
                  <p className="font-montserrat text-lg text-gray-600 leading-relaxed mb-8 text-left">
                    Hãy cùng chúng tôi xây dựng một mạng lưới đối tác mạnh mẽ, thúc đẩy sự phát triển
                    bền vững trong ngành nông nghiệp. Chúng tôi luôn chào đón các doanh nghiệp có chung
                    tầm nhìn và mục tiêu hợp tác để tạo ra những giá trị tích cực cho cộng đồng.
                  </p>
                  <Link
                    href="/join-us"
                    className="inline-flex items-center gap-2 font-montserrat font-bold text-lg text-white bg-green-600 hover:bg-green-700 transition-all duration-300 px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                    aria-label="Tham gia cộng đồng"
                  >
                    THAM GIA
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* CTA Image */}
              <div className="flex-shrink-0">
                <div className="relative w-48 h-48 md:w-64 md:h-64">
                  <Image
                    src="/members/tham_gia.jpeg"
                    alt="Tham gia cộng đồng"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 192px, 256px"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}