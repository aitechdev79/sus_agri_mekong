'use client';

import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { getLocaleFromPathname } from '@/lib/content-locale';

export default function CommitmentPage() {
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
      <main className="pt-20">
        {/* Introduction Section - 2 Parts */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {/* Part 1: Text Section (2/3 width) */}
              <div className="md:col-span-2 p-8">
                <h1 className="font-montserrat font-bold text-3xl md:text-4xl text-gray-800 mb-8 text-left">
                  {isEn ? 'Vision, Mission, and Goals' : 'Tầm nhìn, sứ mệnh, mục tiêu'}
                </h1>

                {/* Vision */}
                <div className="mb-6">
                  <h2 className="font-montserrat font-bold text-2xl text-gray-800 mb-4">
                    {isEn ? 'Vision' : 'Tầm nhìn'}
                  </h2>
                  <p className="text-lg text-gray-700 leading-relaxed font-montserrat mb-4">
                    {isEn
                      ? 'This portal is an initiative of VCCI-HCM, created to provide transparent, accurate, and reliable data and information as a foundation for Vietnam’s sustainable future.'
                      : 'Cổng thông tin là sáng kiến của VCCI-HCM, được hình thành với sứ mệnh cung cấp nguồn dữ liệu, thông tin minh bạch, chính xác và đáng tin cậy, đặt nền móng cho tương lai phát triển bền vững của Việt Nam.'}
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed font-montserrat">
                    {isEn
                      ? 'We connect Vietnam’s business ecosystem through transparent data, practical experience, and updated policy insights to drive sustainable development and international integration.'
                      : 'Chúng tôi kết nối hệ sinh thái doanh nghiệp Việt Nam bằng dữ liệu minh bạch, kinh nghiệm thực tiễn và thông tin chính sách cập nhật, nhằm thúc đẩy phát triển bền vững và hội nhập quốc tế.'}
                  </p>
                </div>

                {/* Mission */}
                <div className="mb-6">
                  <h2 className="font-montserrat font-bold text-2xl text-gray-800 mb-4">
                    {isEn ? 'Mission' : 'Sứ mệnh'}
                  </h2>
                  <p className="text-lg text-gray-700 leading-relaxed font-montserrat mb-4">
                    {isEn
                      ? 'Our mission is to accompany businesses and communities in improving competitiveness, working conditions, and responsible business practices while creating long-term social value.'
                      : 'Sứ mệnh của chúng tôi là đồng hành cùng doanh nghiệp và cộng đồng để nâng cao năng lực cạnh tranh, cải thiện điều kiện lao động, thúc đẩy kinh doanh có trách nhiệm và tạo ra giá trị lâu dài cho xã hội.'}
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed font-montserrat">
                    {isEn
                      ? 'Through multi-stakeholder collaboration, we aim for a future where Vietnamese businesses grow sustainably with transparency and trust.'
                      : 'Với sự hợp tác đa bên, chúng tôi hướng tới một tương lai nơi doanh nghiệp Việt Nam phát triển bền vững, minh bạch và đáng tin cậy.'}
                  </p>
                </div>

                {/* ESG Commitment */}
                <div className="mb-6">
                  <h2 className="font-montserrat font-bold text-2xl text-gray-800 mb-4">
                    {isEn ? 'Goal: ESG Direction' : 'Mục tiêu: Định hướng ESG'}
                  </h2>
                  <p className="text-lg text-gray-700 leading-relaxed font-montserrat mb-4">
                    {isEn
                      ? 'We consider ESG (Environmental, Social, and Governance) a core direction of our strategy. ESG reflects responsibility to communities and the environment while also strengthening governance, competitiveness, and credibility.'
                      : 'Bên cạnh đó, chúng tôi xem ESG (Môi trường – Xã hội – Quản trị) là định hướng trọng tâm trong chiến lược phát triển. ESG không chỉ phản ánh trách nhiệm của doanh nghiệp với cộng đồng và môi trường, mà còn là nền tảng quản trị hiện đại giúp gia tăng năng lực cạnh tranh và nâng cao uy tín.'}
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed font-montserrat">
                    {isEn
                      ? 'By promoting ESG standards, we encourage Vietnamese businesses to integrate sustainability into long-term strategy, improve competitiveness, and contribute to national development goals.'
                      : 'Bằng việc thúc đẩy áp dụng các tiêu chuẩn ESG, chúng tôi khuyến khích doanh nghiệp Việt Nam tích hợp phát triển bền vững vào chiến lược dài hạn, từ đó vừa gia tăng năng lực cạnh tranh, vừa đóng góp tích cực cho mục tiêu phát triển chung của đất nước.'}
                  </p>
                </div>

                {/* PPP Partnership Model */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h2 className="font-montserrat font-bold text-xl text-blue-800 mb-3">
                    {isEn ? 'PPP Mechanism (Public-Private Partnership)' : 'Cơ chế PPP (Public-Private Partnership)'}
                  </h2>
                  <p className="text-base text-gray-700 leading-relaxed font-montserrat">
                    {isEn
                      ? 'Through PPP, the portal is not only a data repository but also a trusted bridge where stakeholders share responsibility, connect resources, and co-create value for a comprehensive sustainability ecosystem.'
                      : 'Thông qua cơ chế PPP, cổng thông tin không chỉ đơn thuần là kho dữ liệu mà còn là cầu nối tin cậy, nơi ba bên cùng chia sẻ trách nhiệm, kết nối nguồn lực và đồng kiến tạo giá trị. Đây chính là nền tảng để hình thành một hệ sinh thái phát triển bền vững toàn diện, trong đó mọi thành phần xã hội đều được lắng nghe, tham gia và thụ hưởng lợi ích chung.'}
                  </p>
                </div>
              </div>

              {/* Part 2: 3 Cards Stacked Vertically (1/3 width) */}
              <div className="md:col-span-1 self-start flex flex-col gap-6 md:sticky md:top-24 lg:top-1/2 lg:-translate-y-1/2">
                {/* Nhà nước */}
                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                  {/* Icon on left */}
                  <div className="flex-shrink-0">
                    <div className="relative w-16 h-16">
                      <Image
                        src="/nha nuoc.png"
                        alt={isEn ? 'Government' : 'Nhà nước'}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="flex-1">
                    <h3 className="font-montserrat font-bold text-lg text-green-700 mb-2">
                      {isEn ? 'Government' : 'Nhà nước'}
                    </h3>
                    <p className="text-xs text-gray-700 font-montserrat leading-relaxed">
                      {isEn
                        ? 'Legal frameworks, policies, and sustainability strategies that create enabling conditions for businesses and society.'
                        : 'Khung pháp lý, chính sách và chiến lược phát triển bền vững, tạo môi trường thuận lợi cho sự phát triển của doanh nghiệp và xã hội.'}
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
                        alt={isEn ? 'Business' : 'Doanh nghiệp'}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="flex-1">
                    <h3 className="font-montserrat font-bold text-lg text-yellow-700 mb-2">
                      {isEn ? 'Business' : 'Doanh nghiệp'}
                    </h3>
                    <p className="text-xs text-gray-700 font-montserrat leading-relaxed">
                      {isEn
                        ? 'Innovation, sustainable governance, and value-chain development to advance green and resilient economic growth.'
                        : 'Đổi mới sáng tạo, quản trị bền vững và xây dựng chuỗi giá trị để thúc đẩy tăng trưởng kinh tế xanh và bền vững.'}
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
                        alt={isEn ? 'Civil society' : 'Xã hội dân sự'}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="flex-1">
                    <h3 className="font-montserrat font-bold text-lg text-pink-700 mb-2">
                      {isEn ? 'Civil society' : 'Xã hội dân sự'}
                    </h3>
                    <p className="text-xs text-gray-700 font-montserrat leading-relaxed">
                      {isEn
                        ? 'Oversight, transparency, and diffusion of sustainable values to communities for positive social impact.'
                        : 'Giám sát, đảm bảo minh bạch và lan tỏa giá trị bền vững đến cộng đồng, tạo sức ảnh hưởng tích cực cho xã hội.'}
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
