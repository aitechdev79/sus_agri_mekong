'use client';

import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <div className="relative z-50">
        <NavigationBar />
      </div>

      {/* Main Content */}
      <main className="pt-20">
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

                  <div className="bg-blue-50 p-6 rounded-lg mt-6">
                    <h3 className="font-montserrat font-bold text-xl text-blue-800 mb-3">
                      Dự án liên quan
                    </h3>
                    <p className="text-base text-gray-700 leading-relaxed font-montserrat">
                      Dự án Oxfam hỗ trợ VCCI trong việc tác động tích cực lên chuỗi giá trị tôm và lúa, nhằm nâng cao tính bền vững và trách nhiệm xã hội trong ngành nông nghiệp Việt Nam. Dự án này đặt nền móng cho sự phát triển của nền tảng thông tin này.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Oxfam Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
              {/* Content Column (2/3 width) - Left side */}
              <div className="md:col-span-2">
                <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-gray-800 mb-6">
                  Tổ chức Oxfam tại Việt Nam
                </h2>

                <div className="space-y-6">
                  {/* Project 1 - Graisea */}
                  <a
                    href="https://graisea.github.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 hover:shadow-xl transition-shadow duration-300"
                  >
                    <h3 className="font-montserrat font-bold text-xl text-green-700 mb-3 hover:text-green-800">
                      Dự án Graisea
                    </h3>
                    <p className="text-base text-gray-700 leading-relaxed font-montserrat mb-2">
                      Tăng cường bình đẳng giới và đầu tư kinh doanh nông nghiệp có trách nhiệm tại Đông Nam Á
                    </p>
                    <p className="text-sm text-gray-600 italic font-montserrat">
                      → Hỗ trợ nâng cao năng lực cho doanh nghiệp trong chuỗi chế biến tôm và lúa gạo
                    </p>
                  </a>

                  {/* Project 2 - Right To Food */}
                  <a
                    href="https://policy-practice.oxfam.org/resources/a-common-sense-approach-to-the-right-to-food-558742/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 hover:shadow-xl transition-shadow duration-300"
                  >
                    <h3 className="font-montserrat font-bold text-xl text-blue-700 mb-3 hover:text-blue-800">
                      Dự án Right To Food
                    </h3>
                    <p className="text-base text-gray-700 leading-relaxed font-montserrat mb-2">
                      Thúc đẩy hợp tác khu vực tư nhân nhằm phát triển mô hình kinh doanh toàn diện (IB) và đầu tư có trách nhiệm (RI) trong chuỗi giá trị lúa gạo tại Việt Nam
                    </p>
                    <p className="text-sm text-gray-600 italic font-montserrat">
                      → Hỗ trợ doanh nghiệp trong chuỗi lúa gạo
                    </p>
                  </a>

                  {/* Project 3 - DGD */}
                  <a
                    href="https://vietnam.oxfam.org/kick-project-component-supporting-female-farmers-and-informal-workers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500 hover:shadow-xl transition-shadow duration-300"
                  >
                    <h3 className="font-montserrat font-bold text-xl text-orange-700 mb-3 hover:text-orange-800">
                      Dự án DGD
                    </h3>
                    <p className="text-base text-gray-700 leading-relaxed font-montserrat mb-2">
                      Cải thiện khả năng tiếp cận thị trường quốc tế của Doanh nghiệp tôm và lúa thông qua nâng cao kỹ năng làm việc và an toàn vệ sinh lao động tại Doanh nghiệp
                    </p>
                    <p className="text-sm text-gray-600 italic font-montserrat">
                      → Hỗ trợ doanh nghiệp trong chuỗi chế biến tôm và lúa gạo
                    </p>
                  </a>
                </div>
              </div>

              {/* Logo Column (1/3 width) - Right side */}
              <div className="md:col-span-1 flex justify-center items-start">
                <div className="relative w-full max-w-xs">
                  <Image
                    src="/OX_HL_C_RGB.png"
                    alt="Oxfam Logo"
                    width={300}
                    height={300}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ILO Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
              {/* Logo Column (1/3 width) - Left side */}
              <div className="md:col-span-1 flex justify-center items-start">
                <div className="relative w-full max-w-xs">
                  <Image
                    src="/ILOlogo.png"
                    alt="ILO Logo"
                    width={300}
                    height={300}
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Content Column (2/3 width) - Right side */}
              <div className="md:col-span-2">
                <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-gray-800 mb-6">
                  Tổ chức ILO (Tổ chức lao động Quốc tế)
                </h2>

                <div className="space-y-6">
                  {/* Project 1 - SCORE */}
                  <div className="bg-gray-50 p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                    <h3 className="font-montserrat font-bold text-xl text-purple-700 mb-3">
                      Dự án SCORE
                    </h3>
                    <p className="text-base text-gray-700 leading-relaxed font-montserrat mb-2">
                      Dự án phát triển doanh nghiệp bền vững
                    </p>
                    <p className="text-sm text-gray-600 italic font-montserrat">
                      → Hỗ trợ nâng cao năng lực cạnh tranh cho doanh nghiệp trong ngành chế biến gỗ, dệt may và công nghiệp hỗ trợ
                    </p>
                  </div>

                  {/* Project 2 - PE4DW */}
                  <div className="bg-gray-50 p-6 rounded-lg shadow-md border-l-4 border-indigo-500">
                    <h3 className="font-montserrat font-bold text-xl text-indigo-700 mb-3">
                      Dự án PE4DW
                    </h3>
                    <p className="text-base text-gray-700 leading-relaxed font-montserrat mb-2">
                      Dự án Hệ sinh thái năng suất vì việc làm bền vững
                    </p>
                    <p className="text-sm text-gray-600 italic font-montserrat">
                      → Hỗ trợ nâng cao năng suất và tiêu chuẩn bền vững cho doanh nghiệp ngành công nghiệp hỗ trợ
                    </p>
                  </div>

                  {/* Project 3 - RSCA */}
                  <div className="bg-gray-50 p-6 rounded-lg shadow-md border-l-4 border-cyan-500">
                    <h3 className="font-montserrat font-bold text-xl text-cyan-700 mb-3">
                      Dự án RSCA
                    </h3>
                    <p className="text-base text-gray-700 leading-relaxed font-montserrat mb-2">
                      Dự án Trách nhiệm xã hội trong chuỗi cung ứng tại châu Á
                    </p>
                    <p className="text-sm text-gray-600 italic font-montserrat">
                      → Hỗ trợ nâng cao năng lực cho Doanh nghiệp thủy sản về thực hành trách nhiệm xã hội và bền vững
                    </p>
                  </div>

                  {/* Project 4 - Electronics Supply Chain */}
                  <div className="bg-gray-50 p-6 rounded-lg shadow-md border-l-4 border-teal-500">
                    <h3 className="font-montserrat font-bold text-xl text-teal-700 mb-3">
                      Dự án Tăng cường kết nối chuỗi cung ứng ngành điện tử tại Việt Nam
                    </h3>
                    <p className="text-sm text-gray-600 italic font-montserrat">
                      → Hỗ trợ phát triển và kết nối chuỗi cung ứng trong ngành công nghiệp điện tử
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