'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function SignUpSection() {

  const partners = [
    { name: 'VCCI', logo: '/uploads/logos/vcci.png', alt: 'VCCI Logo' },
    { name: 'Oxfam', logo: '/uploads/logos/oxfam.png', alt: 'Oxfam Logo' },
    { name: 'HCM', logo: '/uploads/logos/hcm.png', alt: 'HCM Logo' },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Content */}
          <div className="text-white mb-12">
            <h2 className="text-3xl font-bold mb-6 md:text-4xl font-montserrat">
              Tham gia cộng đồng của chúng tôi
            </h2>
            <p className="text-lg mb-8 text-blue-100 max-w-2xl mx-auto font-montserrat">
              Đăng ký ngay để truy cập đầy đủ nội dung và kết nối với cộng đồng nông dân, chuyên gia
            </p>

            {/* Benefits List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <h3 className="font-semibold mb-2 font-montserrat">Nội dung độc quyền</h3>
                <p className="text-sm text-blue-100 font-montserrat">Truy cập tài liệu và video hướng dẫn chỉ dành cho thành viên</p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <h3 className="font-semibold mb-2 font-montserrat">Thông báo mới</h3>
                <p className="text-sm text-blue-100 font-montserrat">Nhận thông báo về nội dung mới và cập nhật quan trọng</p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <h3 className="font-semibold mb-2 font-montserrat">Cộng đồng hỗ trợ</h3>
                <p className="text-sm text-blue-100 font-montserrat">Kết nối và trao đổi kinh nghiệm với các chuyên gia</p>
              </div>
            </div>

            <Link
              href="/auth/signup"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg font-montserrat"
              aria-label="Đăng ký ngay"
            >
              Đăng ký ngay
            </Link>
          </div>

          {/* Partner Logos */}
          <div className="border-t border-blue-500 pt-8">
            <p className="text-blue-200 mb-6 text-sm font-montserrat">
              Được hỗ trợ bởi các tổ chức uy tín
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {partners.map((partner, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-12 w-24">
                    <Image
                      src={partner.logo}
                      alt={partner.alt}
                      fill
                      sizes="(max-width: 768px) 96px, 192px"
                      className="object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-blue-200 text-sm font-montserrat">
              Đã có tài khoản?{' '}
              <Link
                href="/auth/signin"
                className="text-white underline hover:no-underline font-montserrat"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}