'use client';

import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function VNBestPracticePage() {
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
            alt="Vietnam Best Practices Hero Banner"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </section>

        {/* Vietnam Best Practices */}
        <section id="vietnam-practices" className="py-16 bg-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-gray-800 mb-8">
              Thực hành tốt tại Việt Nam
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vietnam Example 1 */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border-l-4 border-green-600 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🦐</span>
                  </div>
                  <h3 className="font-montserrat font-bold text-xl text-gray-800">
                    Mô hình Tôm - Rừng Cà Mau
                  </h3>
                </div>
                <p className="text-gray-700 font-montserrat leading-relaxed mb-4">
                  Mô hình nuôi tôm kết hợp bảo vệ rừng ngập mặn tại Cà Mau đạt chứng nhận ASC,
                  giúp người dân tăng thu nhập 40% trong khi vẫn bảo tồn hệ sinh thái rừng ngập mặn.
                  Đây là ví dụ điển hình về phát triển bền vững trong thủy sản Việt Nam.
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600 font-montserrat">
                  <span className="font-semibold">Địa điểm:</span>
                  <span>Cà Mau, Đồng bằng sông Cửu Long</span>
                </div>
              </div>

              {/* Vietnam Example 2 */}
              <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg p-6 border-l-4 border-blue-600 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🌾</span>
                  </div>
                  <h3 className="font-montserrat font-bold text-xl text-gray-800">
                    Lúa Hữu cơ An Giang
                  </h3>
                </div>
                <p className="text-gray-700 font-montserrat leading-relaxed mb-4">
                  HTX nông nghiệp An Giang áp dụng sản xuất lúa hữu cơ theo tiêu chuẩn VietGAP và SRP,
                  giảm 60% lượng phân bón hóa học, nước tưới tiết kiệm 30%. Sản phẩm gạo ST25 xuất khẩu
                  sang thị trường EU với giá cao gấp 3 lần gạo thường.
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600 font-montserrat">
                  <span className="font-semibold">Địa điểm:</span>
                  <span>An Giang, Đồng bằng sông Cửu Long</span>
                </div>
              </div>

              {/* Vietnam Example 3 */}
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-6 border-l-4 border-purple-600 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🏭</span>
                  </div>
                  <h3 className="font-montserrat font-bold text-xl text-gray-800">
                    Vinamilk - Trang trại Bò sữa Xanh
                  </h3>
                </div>
                <p className="text-gray-700 font-montserrat leading-relaxed mb-4">
                  Vinamilk xây dựng trang trại bò sữa Organic đạt tiêu chuẩn quốc tế, áp dụng công nghệ
                  xử lý chất thải hiện đại, tận dụng biogas để phát điện. Công ty cam kết đạt Net Zero
                  vào năm 2050 và liên tục công bố báo cáo phát triển bền vững hàng năm.
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600 font-montserrat">
                  <span className="font-semibold">Lĩnh vực:</span>
                  <span>Chế biến thực phẩm, Nông nghiệp công nghệ cao</span>
                </div>
              </div>

              {/* Vietnam Example 4 */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-6 border-l-4 border-orange-600 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="font-montserrat font-bold text-xl text-gray-800">
                    Trung Nam Group - Năng lượng Tái tạo
                  </h3>
                </div>
                <p className="text-gray-700 font-montserrat leading-relaxed mb-4">
                  Tập đoàn Trung Nam phát triển hơn 2,000 MW điện mặt trời và điện gió, góp phần giảm
                  3 triệu tấn CO2 mỗi năm. Công ty tiên phong trong chuyển đổi năng lượng sạch tại Việt Nam
                  và đạt nhiều chứng nhận quốc tế về ESG.
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600 font-montserrat">
                  <span className="font-semibold">Lĩnh vực:</span>
                  <span>Năng lượng tái tạo, Điện mặt trời, Điện gió</span>
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
