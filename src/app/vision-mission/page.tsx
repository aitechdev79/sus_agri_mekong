'use client';

import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function VisionMissionPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <div className="relative z-50">
        <NavigationBar />
      </div>

      {/* Main Content */}
      <main className="pt-20">
        {/* Introduction Section - 2 Parts */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {/* Part 1: Text Section (2/3 width) */}
              <div className="md:col-span-2 p-8">
                <h1 className="font-montserrat font-bold text-3xl md:text-4xl text-gray-800 mb-8 text-left">
                  Tầm nhìn sứ mệnh
                </h1>

                {/* Vision */}
                <div className="mb-6">
                  <h2 className="font-montserrat font-bold text-2xl text-gray-800 mb-4">
                    Tầm nhìn
                  </h2>
                  <p className="text-lg text-gray-700 leading-relaxed font-montserrat mb-4">
                    Cổng thông tin là sáng kiến của VCCI-HCM, được hình thành với sứ mệnh cung cấp nguồn dữ liệu,
                    thông tin minh bạch, chính xác và đáng tin cậy, đặt nền móng cho tương lai phát triển bền vững của Việt Nam.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed font-montserrat">
                    Chúng tôi kết nối hệ sinh thái doanh nghiệp Việt Nam bằng dữ liệu minh bạch, kinh nghiệm thực tiễn và thông tin chính sách cập nhật, nhằm thúc đẩy phát triển bền vững và hội nhập quốc tế.
                  </p>
                </div>

                {/* Mission */}
                <div className="mb-6">
                  <h2 className="font-montserrat font-bold text-2xl text-gray-800 mb-4">
                    Sứ mệnh
                  </h2>
                  <p className="text-lg text-gray-700 leading-relaxed font-montserrat mb-4">
                    Sứ mệnh của chúng tôi là đồng hành cùng doanh nghiệp và cộng đồng để nâng cao năng lực cạnh tranh, cải thiện điều kiện lao động, thúc đẩy kinh doanh có trách nhiệm và tạo ra giá trị lâu dài cho xã hội.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed font-montserrat">
                    Với sự hợp tác đa bên, chúng tôi hướng tới một tương lai nơi doanh nghiệp Việt Nam phát triển bền vững, minh bạch và đáng tin cậy.
                  </p>
                </div>

                {/* ESG Commitment */}
                <div className="mb-6">
                  <h2 className="font-montserrat font-bold text-2xl text-gray-800 mb-4">
                    Định hướng ESG
                  </h2>
                  <p className="text-lg text-gray-700 leading-relaxed font-montserrat mb-4">
                    Bên cạnh đó, chúng tôi xem ESG (Môi trường – Xã hội – Quản trị) là định hướng trọng tâm trong chiến lược phát triển. ESG không chỉ phản ánh trách nhiệm của doanh nghiệp với cộng đồng và môi trường, mà còn là nền tảng quản trị hiện đại giúp gia tăng năng lực cạnh tranh và nâng cao uy tín.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed font-montserrat">
                    Bằng việc thúc đẩy áp dụng các tiêu chuẩn ESG, chúng tôi khuyến khích doanh nghiệp Việt Nam tích hợp phát triển bền vững vào chiến lược dài hạn, từ đó vừa gia tăng năng lực cạnh tranh, vừa đóng góp tích cực cho mục tiêu phát triển chung của đất nước.
                  </p>
                </div>

                {/* PPP Partnership Model */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h2 className="font-montserrat font-bold text-xl text-blue-800 mb-3">
                    Cơ chế PPP (Public-Private Partnership)
                  </h2>
                  <p className="text-base text-gray-700 leading-relaxed font-montserrat">
                    Thông qua cơ chế PPP, cổng thông tin không chỉ đơn thuần là kho dữ liệu mà còn là cầu nối tin cậy, nơi ba bên cùng chia sẻ trách nhiệm, kết nối nguồn lực và đồng kiến tạo giá trị. Đây chính là nền tảng để hình thành một hệ sinh thái phát triển bền vững toàn diện, trong đó mọi thành phần xã hội đều được lắng nghe, tham gia và thụ hưởng lợi ích chung.
                  </p>
                </div>
              </div>

              {/* Part 2: 3 Cards Stacked Vertically (1/3 width) */}
              <div className="md:col-span-1 flex flex-col gap-6">
                {/* Nhà nước */}
                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                  {/* Icon on left */}
                  <div className="flex-shrink-0">
                    <div className="relative w-16 h-16">
                      <Image
                        src="/nha nuoc.png"
                        alt="Nhà nước"
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="flex-1">
                    <h3 className="font-montserrat font-bold text-lg text-green-700 mb-2">
                      Nhà nước
                    </h3>
                    <p className="text-xs text-gray-700 font-montserrat leading-relaxed">
                      Khung pháp lý, chính sách và chiến lược phát triển bền vững,
                      tạo môi trường thuận lợi cho sự phát triển của doanh nghiệp và xã hội.
                    </p>
                  </div>
                </div>

                {/* Doanh nghiệp */}
                <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg">
                  {/* Icon on left */}
                  <div className="flex-shrink-0">
                    <div className="relative w-16 h-16">
                      <Image
                        src="/doanh nghiep.png"
                        alt="Doanh nghiệp"
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="flex-1">
                    <h3 className="font-montserrat font-bold text-lg text-yellow-700 mb-2">
                      Doanh nghiệp
                    </h3>
                    <p className="text-xs text-gray-700 font-montserrat leading-relaxed">
                      Đổi mới sáng tạo, quản trị bền vững và xây dựng chuỗi giá trị
                      để thúc đẩy tăng trưởng kinh tế xanh và bền vững.
                    </p>
                  </div>
                </div>

                {/* Xã hội dân sự */}
                <div className="flex items-start gap-4 p-4 bg-pink-50 rounded-lg">
                  {/* Icon on left */}
                  <div className="flex-shrink-0">
                    <div className="relative w-16 h-16">
                      <Image
                        src="/xa hoi.png"
                        alt="Xã hội dân sự"
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="flex-1">
                    <h3 className="font-montserrat font-bold text-lg text-pink-700 mb-2">
                      Xã hội dân sự
                    </h3>
                    <p className="text-xs text-gray-700 font-montserrat leading-relaxed">
                      Giám sát, đảm bảo minh bạch và lan tỏa giá trị bền vững
                      đến cộng đồng, tạo sức ảnh hưởng tích cực cho xã hội.
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
