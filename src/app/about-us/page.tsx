'use client';

import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <div className="relative z-50">
        <NavigationBar />
      </div>

      {/* Main Content */}
      <main className="pt-20">
        {/* Header Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <h1 className="font-montserrat font-bold text-4xl md:text-5xl text-gray-800 mb-6 text-center">
              Về Cổng Thông Tin VCCI-HCM
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed font-montserrat text-center max-w-4xl mx-auto mb-8">
              Cổng thông tin là sáng kiến của VCCI-HCM, được hình thành với sứ mệnh cung cấp nguồn dữ liệu,
              thông tin minh bạch, chính xác và đáng tin cậy, đặt nền móng cho tương lai phát triển bền vững của Việt Nam.
            </p>
          </div>
        </section>

        {/* Mission & Vision Details */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Nhà nước */}
              <div className="p-6 bg-green-50 rounded-lg">
                <h3 className="font-montserrat font-bold text-2xl text-green-700 mb-4">
                  Nhà nước
                </h3>
                <p className="text-gray-700 font-montserrat leading-relaxed">
                  Khung pháp lý, chính sách và chiến lược phát triển bền vững,
                  tạo môi trường thuận lợi cho sự phát triển của doanh nghiệp và xã hội.
                </p>
              </div>

              {/* Doanh nghiệp */}
              <div className="p-6 bg-yellow-50 rounded-lg">
                <h3 className="font-montserrat font-bold text-2xl text-yellow-700 mb-4">
                  Doanh nghiệp
                </h3>
                <p className="text-gray-700 font-montserrat leading-relaxed">
                  Đổi mới sáng tạo, quản trị bền vững và xây dựng chuỗi giá trị
                  để thúc đẩy tăng trưởng kinh tế xanh và bền vững.
                </p>
              </div>

              {/* Xã hội dân sự */}
              <div className="p-6 bg-pink-50 rounded-lg">
                <h3 className="font-montserrat font-bold text-2xl text-pink-700 mb-4">
                  Xã hội dân sự
                </h3>
                <p className="text-gray-700 font-montserrat leading-relaxed">
                  Giám sát, đảm bảo minh bạch và lan tỏa giá trị bền vững
                  đến cộng đồng, tạo sức ảnh hưởng tích cực cho xã hội.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}