'use client';

import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function PartnersPage() {
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
            src="/hero-main.jpg"
            alt="Partners Hero Banner"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </section>

        {/* Strategic Partners Introduction */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <h1 className="font-montserrat font-bold text-4xl md:text-5xl text-gray-800 mb-6">
              Đối tác chiến lược
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed font-montserrat mb-8">
              Sự phát triển bền vững của cổng thông tin được xây dựng từ sự đồng hành của nhiều đối tác chiến lược trong và ngoài nước. Từ các tổ chức quốc tế, hiệp hội ngành hàng đến chính quyền địa phương, mỗi đối tác đều mang đến nguồn lực, kinh nghiệm và cam kết cùng chung tay nâng cao năng lực cạnh tranh, cải thiện điều kiện lao động và thúc đẩy kinh doanh có trách nhiệm cho doanh nghiệp Việt Nam.
            </p>

            {/* Partner Categories */}
            <div className="space-y-8">
              {/* Government Ministries */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-montserrat font-bold text-2xl text-blue-800 mb-4">
                  Các bộ ngành
                </h3>
                <ul className="space-y-2 text-gray-700 font-montserrat">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Bộ Lao động (nay là Bộ Nội vụ)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Tổng Liên đoàn</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Hội Nông dân Việt Nam</span>
                  </li>
                </ul>
              </div>

              {/* International NGO Partners */}
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-montserrat font-bold text-2xl text-green-800 mb-4">
                  Đối tác NGO quốc tế
                </h3>
                <ul className="space-y-2 text-gray-700 font-montserrat">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Oxfam</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>ILO (Tổ chức Lao động Quốc tế)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>DI (Development International)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>NHO</span>
                  </li>
                </ul>
              </div>

              {/* Industry Associations */}
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="font-montserrat font-bold text-2xl text-orange-800 mb-4">
                  Hiệp hội ngành nghề trong nước
                </h3>
                <ul className="space-y-2 text-gray-700 font-montserrat">
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">•</span>
                    <span>VASEP - Hiệp hội Chế biến và Xuất khẩu Thủy sản Việt Nam</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">•</span>
                    <span>VFA - Hiệp hội Thủy sản Việt Nam</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">•</span>
                    <span>Hiệp hội Thủy sản Cần Thơ, An Giang, Cà Mau, Sóc Trăng</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">•</span>
                    <span>HAWA - Hiệp hội Gỗ và Lâm sản Việt Nam</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">•</span>
                    <span>BIFA - Hiệp hội Gỗ Bình Dương</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">•</span>
                    <span>DOWA - Hiệp hội Gỗ Đồng Nai</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">•</span>
                    <span>CSID - Trung tâm Phát triển Công nghiệp Hỗ trợ</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">•</span>
                    <span>VITAS - Hiệp hội Dệt May Việt Nam</span>
                  </li>
                </ul>
              </div>

              {/* Partner Organizations */}
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="font-montserrat font-bold text-2xl text-purple-800 mb-4">
                  Các tổ chức đối tác
                </h3>
                <p className="text-gray-700 font-montserrat leading-relaxed">
                  VCCI, Oxfam, DGD, Hội Nông dân Việt Nam, VASEP, VFA, và các hiệp hội địa phương tại An Giang, Cà Mau, Sóc Trăng.
                </p>
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
