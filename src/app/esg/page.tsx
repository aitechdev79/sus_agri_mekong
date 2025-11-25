'use client';

import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function ESGPage() {
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
            src="/esg_hero.jpg"
            alt="ESG Hero Banner"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </section>

        {/* ESG Content Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <h1 className="font-montserrat font-bold text-4xl md:text-5xl text-gray-800 mb-6">
              ESG - Môi trường, Xã hội và Quản trị
            </h1>

            <div className="space-y-8">
              {/* Introduction */}
              <div className="text-lg text-gray-700 leading-relaxed font-montserrat">
                <p className="mb-4">
                  ESG (Environment, Social, and Governance) là khung tiêu chuẩn đánh giá hiệu quả hoạt động của doanh nghiệp
                  dựa trên ba trụ cột chính: Môi trường, Xã hội và Quản trị. Đây không chỉ là xu hướng toàn cầu mà còn là
                  yêu cầu bắt buộc đối với các doanh nghiệp muốn phát triển bền vững và tham gia vào chuỗi cung ứng quốc tế.
                </p>
              </div>

              {/* Three Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Environment */}
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-montserrat font-bold text-2xl text-green-800 mb-4">
                    Môi trường (E)
                  </h3>
                  <p className="text-gray-700 font-montserrat leading-relaxed">
                    Đánh giá tác động của doanh nghiệp đến môi trường, bao gồm quản lý khí thải,
                    sử dụng năng lượng tái tạo, bảo vệ đa dạng sinh học và quản lý chất thải.
                  </p>
                </div>

                {/* Social */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-montserrat font-bold text-2xl text-blue-800 mb-4">
                    Xã hội (S)
                  </h3>
                  <p className="text-gray-700 font-montserrat leading-relaxed">
                    Tập trung vào trách nhiệm xã hội của doanh nghiệp, bao gồm điều kiện lao động,
                    quyền lợi người lao động, an toàn sức khỏe và phát triển cộng đồng.
                  </p>
                </div>

                {/* Governance */}
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="font-montserrat font-bold text-2xl text-purple-800 mb-4">
                    Quản trị (G)
                  </h3>
                  <p className="text-gray-700 font-montserrat leading-relaxed">
                    Đánh giá cấu trúc quản trị doanh nghiệp, tính minh bạch, tuân thủ pháp luật,
                    đạo đức kinh doanh và trách nhiệm giải trình.
                  </p>
                </div>
              </div>

              {/* Why ESG Matters */}
              <div className="bg-gray-50 p-8 rounded-lg">
                <h2 className="font-montserrat font-bold text-3xl text-gray-800 mb-6">
                  Tại sao ESG quan trọng?
                </h2>
                <ul className="space-y-4 text-gray-700 font-montserrat">
                  <li className="flex items-start">
                    <span className="text-green-600 font-bold mr-3 text-xl">✓</span>
                    <span>Nâng cao năng lực cạnh tranh và uy tín doanh nghiệp trên thị trường quốc tế</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 font-bold mr-3 text-xl">✓</span>
                    <span>Đáp ứng yêu cầu của nhà đầu tư và đối tác quốc tế về phát triển bền vững</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 font-bold mr-3 text-xl">✓</span>
                    <span>Giảm thiểu rủi ro pháp lý và tài chính liên quan đến môi trường và xã hội</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 font-bold mr-3 text-xl">✓</span>
                    <span>Tăng cường lợi thế cạnh tranh trong chuỗi giá trị toàn cầu</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 font-bold mr-3 text-xl">✓</span>
                    <span>Đóng góp tích cực cho mục tiêu phát triển bền vững của đất nước</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
