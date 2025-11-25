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

        {/* Global Best Practices */}
        <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-gray-800 mb-8">
              Thực hành tốt trên thế giới
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Example 1 */}
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🏭</span>
                  </div>
                  <h3 className="font-montserrat font-bold text-xl text-gray-800">
                    Unilever - Kế hoạch Sống Bền vững
                  </h3>
                </div>
                <p className="text-gray-700 font-montserrat leading-relaxed mb-4">
                  Unilever đã cam kết giảm 50% tác động môi trường từ sản phẩm của mình vào năm 2030,
                  đồng thời cải thiện sức khỏe và ph福 lợi cho hơn 1 tỷ người. Công ty tập trung vào
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
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🚗</span>
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
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👕</span>
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
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🏢</span>
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

        {/* Vietnam Best Practices */}
        <section className="py-16 bg-white">
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

        {/* ESG Assessment Tools */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-slate-50">
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-gray-800 mb-4">
              Công cụ đánh giá ESG
            </h2>
            <p className="text-gray-600 font-montserrat text-lg mb-8">
              Các công cụ và khung đánh giá ESG giúp doanh nghiệp đo lường và cải thiện hiệu quả bền vững
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Tool 1 */}
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-montserrat font-bold text-xl text-indigo-600">
                    GRI Standards
                  </h3>
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                </div>
                <p className="text-gray-700 font-montserrat text-sm mb-4 leading-relaxed">
                  Tiêu chuẩn báo cáo bền vững toàn cầu được sử dụng rộng rãi nhất, giúp doanh nghiệp
                  công bố thông tin về tác động kinh tế, môi trường và xã hội một cách minh bạch.
                </p>
                <div className="flex items-center gap-2 text-sm text-indigo-600 font-montserrat font-semibold">
                  <span>Tìm hiểu thêm →</span>
                </div>
              </div>

              {/* Tool 2 */}
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-montserrat font-bold text-xl text-green-600">
                    SASB Standards
                  </h3>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📈</span>
                  </div>
                </div>
                <p className="text-gray-700 font-montserrat text-sm mb-4 leading-relaxed">
                  Tiêu chuẩn đánh giá ESG tập trung vào các vấn đề tài chính trọng yếu theo từng ngành,
                  giúp nhà đầu tư đưa ra quyết định dựa trên thông tin bền vững đáng tin cậy.
                </p>
                <div className="flex items-center gap-2 text-sm text-green-600 font-montserrat font-semibold">
                  <span>Tìm hiểu thêm →</span>
                </div>
              </div>

              {/* Tool 3 */}
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-montserrat font-bold text-xl text-blue-600">
                    CDP Platform
                  </h3>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🌍</span>
                  </div>
                </div>
                <p className="text-gray-700 font-montserrat text-sm mb-4 leading-relaxed">
                  Nền tảng công bố thông tin về khí hậu, nước và rừng toàn cầu. Hơn 9,600 công ty sử dụng
                  CDP để quản lý tác động môi trường và giao tiếp với nhà đầu tư.
                </p>
                <div className="flex items-center gap-2 text-sm text-blue-600 font-montserrat font-semibold">
                  <span>Tìm hiểu thêm →</span>
                </div>
              </div>

              {/* Tool 4 */}
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-montserrat font-bold text-xl text-purple-600">
                    TCFD Framework
                  </h3>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🔍</span>
                  </div>
                </div>
                <p className="text-gray-700 font-montserrat text-sm mb-4 leading-relaxed">
                  Khung công bố thông tin tài chính liên quan đến khí hậu, giúp doanh nghiệp đánh giá
                  và báo cáo rủi ro và cơ hội từ biến đổi khí hậu một cách có cấu trúc.
                </p>
                <div className="flex items-center gap-2 text-sm text-purple-600 font-montserrat font-semibold">
                  <span>Tìm hiểu thêm →</span>
                </div>
              </div>

              {/* Tool 5 */}
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-montserrat font-bold text-xl text-orange-600">
                    UN SDGs
                  </h3>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                </div>
                <p className="text-gray-700 font-montserrat text-sm mb-4 leading-relaxed">
                  17 Mục tiêu Phát triển Bền vững của Liên Hợp Quốc cung cấp khung tổng thể để doanh nghiệp
                  đóng góp vào các mục tiêu toàn cầu về xã hội và môi trường.
                </p>
                <div className="flex items-center gap-2 text-sm text-orange-600 font-montserrat font-semibold">
                  <span>Tìm hiểu thêm →</span>
                </div>
              </div>

              {/* Tool 6 */}
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-montserrat font-bold text-xl text-teal-600">
                    ESG Rating
                  </h3>
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">⭐</span>
                  </div>
                </div>
                <p className="text-gray-700 font-montserrat text-sm mb-4 leading-relaxed">
                  Các hệ thống xếp hạng ESG từ MSCI, S&P, Sustainalytics giúp nhà đầu tư và đối tác
                  đánh giá hiệu quả ESG của doanh nghiệp một cách khách quan và có thể so sánh.
                </p>
                <div className="flex items-center gap-2 text-sm text-teal-600 font-montserrat font-semibold">
                  <span>Tìm hiểu thêm →</span>
                </div>
              </div>
            </div>

            {/* CTA for Assessment */}
            <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-white text-center">
              <h3 className="font-montserrat font-bold text-2xl mb-4">
                Cần hỗ trợ đánh giá ESG cho doanh nghiệp?
              </h3>
              <p className="font-montserrat text-lg mb-6 text-indigo-100">
                Chúng tôi cung cấp dịch vụ tư vấn và đánh giá ESG chuyên nghiệp, giúp doanh nghiệp
                xây dựng lộ trình phát triển bền vững phù hợp.
              </p>
              <button className="px-8 py-3 bg-white text-indigo-600 font-montserrat font-bold rounded-lg hover:bg-indigo-50 transition-colors duration-200 shadow-lg">
                Liên hệ tư vấn
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
