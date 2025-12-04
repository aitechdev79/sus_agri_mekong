'use client';

import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function AboutVCCIPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <div className="relative z-50">
        <NavigationBar />
      </div>

      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section - Full Width Banner */}
        <section className="relative w-full h-[400px] md:h-[500px]">
          <Image
            src="/vcci_hcm_banner.jpg"
            alt="VCCI HCM Banner"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </section>

        {/* VCCI Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
              {/* Logo Column (1/3 width) */}
              <div className="md:col-span-1 flex justify-center items-start">
                <div className="relative w-full max-w-xs">
                  <Image
                    src="/VCCI-HCM logo VN (blue).png"
                    alt="VCCI-HCM Logo"
                    width={300}
                    height={300}
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Content Column (2/3 width) */}
              <div className="md:col-span-2">
                <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-gray-800 mb-6">
                  Về VCCI
                </h2>

                <div className="space-y-4">
                  <p className="text-lg text-gray-700 leading-relaxed font-montserrat">
                    Liên đoàn Thương mại và Công nghiệp Việt Nam (VCCI) là tổ chức quốc gia tập hợp và đại diện cho cộng đồng doanh nghiệp, doanh nhân, người sử dụng lao động và các hiệp hội doanh nghiệp ở Việt Nam nhằm mục đích phát triển, bảo vệ và hỗ trợ cộng đồng doanh nghiệp phát triển bền vững.
                  </p>

                  <div className="pl-6 border-l-4 border-blue-500">
                    <p className="text-lg text-gray-700 leading-relaxed font-montserrat">
                      VCCI đóng vai trò là cầu nối giữa nhà nước – doanh nghiệp để gắn kết cộng đồng doanh nghiệp và nâng cao năng lực cạnh tranh của doanh nghiệp, phát triển bền vững để tham gia vào chuỗi giá trị toàn cầu.
                    </p>
                  </div>
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
