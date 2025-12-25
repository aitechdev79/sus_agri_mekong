'use client';

import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { Building2, Factory, Shirt, Zap } from 'lucide-react';

export default function GlobalBestPracticePage() {
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
            alt="Global Best Practices Hero Banner"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </section>

        {/* Global Best Practices */}
        <section id="global-practices" className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-gray-800 mb-8">
              Thực hành tốt trên thế giới
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Example 1 */}
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
                    <Factory className="w-6 h-6" />
                  </div>
                  <h3 className="font-montserrat font-bold text-xl text-gray-800">
                    Unilever - Kế hoạch Sống Bền vững
                  </h3>
                </div>
                <p className="text-gray-700 font-montserrat leading-relaxed mb-4">
                  Unilever đã cam kết giảm 50% tác động môi trường từ sản phẩm của mình vào năm 2030,
                  đồng thời cải thiện sức khỏe và phúc lợi cho hơn 1 tỷ người. Công ty tập trung vào
                  nguồn cung ứng bền vững, giảm phát thải carbon và đóng góp tích cực cho cộng đồng.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                    Giảm carbon
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                    Chuỗi cung ứng bền vững
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                    Trách nhiệm xã hội
                  </span>
                </div>
              </div>

              {/* Example 2 */}
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="font-montserrat font-bold text-xl text-gray-800">
                    Tesla - Năng lượng Tái tạo
                  </h3>
                </div>
                <p className="text-gray-700 font-montserrat leading-relaxed mb-4">
                  Tesla tiên phong trong việc chuyển đổi sang năng lượng sạch thông qua xe điện và
                  giải pháp lưu trữ năng lượng. Công ty đã giảm hàng triệu tấn CO2 và thúc đẩy ngành
                  công nghiệp ô tô toàn cầu chuyển sang điện hóa.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                    Năng lượng sạch
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                    Đổi mới công nghệ
                  </span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                    Net Zero
                  </span>
                </div>
              </div>

              {/* Example 3 */}
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-700">
                    <Shirt className="w-6 h-6" />
                  </div>
                  <h3 className="font-montserrat font-bold text-xl text-gray-800">
                    Patagonia - Kinh tế Tuần hoàn
                  </h3>
                </div>
                <p className="text-gray-700 font-montserrat leading-relaxed mb-4">
                  Patagonia áp dụng mô hình kinh tế tuần hoàn với chương trình Worn Wear - sửa chữa,
                  tái chế và tái sử dụng sản phẩm. Công ty cam kết sử dụng 100% vật liệu tái chế và
                  hữu cơ, đồng thời đóng góp 1% doanh thu cho bảo vệ môi trường.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                    Tái chế
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                    Kinh tế tuần hoàn
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                    Bảo vệ môi trường
                  </span>
                </div>
              </div>

              {/* Example 4 */}
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-montserrat font-bold text-xl text-gray-800">
                    Microsoft - Phát thải Carbon Âm
                  </h3>
                </div>
                <p className="text-gray-700 font-montserrat leading-relaxed mb-4">
                  Microsoft cam kết đạt carbon âm vào năm 2030 và loại bỏ toàn bộ lượng carbon từng
                  phát thải kể từ khi thành lập vào năm 2050. Công ty đầu tư 1 tỷ USD vào Quỹ Đổi
                  mới Khí hậu để phát triển công nghệ carbon âm.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                    Carbon âm
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                    Đổi mới khí hậu
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                    Cam kết dài hạn
                  </span>
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
