'use client';

import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { getLocaleFromPathname } from '@/lib/content-locale';

export default function AboutVCCIPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isEn = locale === 'en';

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
                  {isEn ? 'About VCCI' : 'Về VCCI'}
                </h2>

                <div className="space-y-4">
                  <p className="text-lg text-gray-700 leading-relaxed font-montserrat text-justify">
                    {isEn
                      ? 'The Vietnam Chamber of Commerce and Industry (VCCI) is a national organization that brings together and represents the business community, entrepreneurs, employers, and business associations in Vietnam. Its purpose is to develop, protect, and support the business community, contribute to the country’s socio-economic development, and promote economic, trade, scientific, and technological cooperation with foreign partners on the basis of equality and mutual benefit, in accordance with the law.'
                      : 'Liên đoàn Thương mại và Công nghiệp Việt Nam (VCCI) là tổ chức quốc gia tập hợp và đại diện cho cộng đồng doanh nghiệp, doanh nhân, người sử dụng lao động và các hiệp hội doanh nghiệp ở Việt Nam nhằm mục đích phát triển, bảo vệ và hỗ trợ cộng đồng doanh nghiệp, góp phần phát triển kinh tế – xã hội của đất nước, thúc đẩy các quan hệ hợp tác kinh tế, thương mại và khoa học – công nghệ với nước ngoài trên cơ sở bình đẳng và cùng có lợi, theo quy định của pháp luật.'}
                  </p>

                  <p className="text-lg text-gray-700 leading-relaxed font-montserrat text-justify">
                    {isEn
                      ? 'The VCCI Ho Chi Minh City Branch (VCCI-HCM) is the largest branch, operating in Ho Chi Minh City and southern provinces including Dong Nai, Lam Dong, Tay Ninh, and others.'
                      : 'Chi nhánh VCCI khu vực Thành phố Hồ Chí Minh (VCCI-HCM) là Chi nhánh lớn nhất, hoạt động trên địa bàn TP.HCM và khu vực các tỉnh thành phía Nam: Đồng Nai, Lâm Đồng, Tây Ninh,...'}
                  </p>

                  <div className="pl-6 border-l-4 border-blue-500">
                    <p className="text-lg text-gray-700 leading-relaxed font-montserrat text-justify">
                      {isEn
                        ? 'VCCI acts as a bridge between the State and enterprises, connecting the business community and employers. Through business support activities, VCCI helps strengthen competitiveness and sustainable development so enterprises can participate in global value chains.'
                        : 'VCCI đóng vai trò là cầu nối giữa Nhà nước – doanh nghiệp để gắn kết cộng đồng doanh nghiệp, người sử dụng lao động và thông qua các hoạt động hỗ trợ doanh nghiệp giúp nâng cao năng lực cạnh tranh, phát triển bền vững để tham gia vào chuỗi giá trị toàn cầu.'}
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
