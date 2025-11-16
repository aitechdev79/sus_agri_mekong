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
        {/* Introduction Section - 3 Parts */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <h1 className="font-montserrat font-bold text-4xl md:text-5xl text-gray-800 mb-12 text-center">
              Về Cổng Thông Tin VCCI-HCM
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {/* Part 1: First Text Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-lg text-gray-700 leading-relaxed font-montserrat">
                  Cổng thông tin là sáng kiến của VCCI-HCM, được hình thành với sứ mệnh cung cấp nguồn dữ liệu,
                  thông tin minh bạch, chính xác và đáng tin cậy.
                </p>
              </div>

              {/* Part 2: Image Section */}
              <div className="flex items-center justify-center">
                <div className="relative w-full h-64">
                  <Image
                    src="/Cong_thong_tin-removebg-preview.png"
                    alt="Cổng thông tin VCCI-HCM"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Part 3: Second Text Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-lg text-gray-700 leading-relaxed font-montserrat mb-4">
                  Đặt nền móng cho tương lai phát triển bền vững của Việt Nam thông qua việc kết nối các bên liên quan
                  và cung cấp thông tin chất lượng cao.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed font-montserrat">
                  Đây là không gian tập hợp và chia sẻ các mô hình thực tiễn, chính sách và thông tin bền trách nhiệm và phát triển bền vững.
                </p>
              </div>
            </div>
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