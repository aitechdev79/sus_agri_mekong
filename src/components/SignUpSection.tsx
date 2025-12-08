'use client';

import Link from 'next/link';

export default function SignUpSection() {

  return (
    <section className="py-16 relative" style={{
      background: 'linear-gradient(135deg, #0A7029 0%, #065018 100%)'
    }}>
      {/* Background Image with opacity */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('/canhdong_Flickr.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.3
        }}
      ></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Content */}
          <div className="text-white mb-12">
            <h2 className="text-3xl font-bold mb-6 md:text-4xl font-montserrat">
              Trở thành đối tác
            </h2>
            <p className="text-lg mb-8 text-white max-w-2xl mx-auto font-montserrat">
              Đối tác doanh nghiệp được cập nhật các chương trình và nội dung mới nhất. Được kết nối với cộng đồng doanh nghiệp, chuyên gia và nông dân
            </p>


            <div className="flex gap-4 justify-center">
              <Link
                href="/join-us"
                className="inline-block bg-vn-gold text-vn-dark px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg font-montserrat hover:scale-105"
                style={{
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFD84D'; // Lighten vn-gold
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFB81C'; // Original vn-gold
                }}
                aria-label="Tham gia"
              >
                Tham gia
              </Link>
              <Link
                href="/members"
                className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-vn-green transition-all duration-300 shadow-lg font-montserrat"
                aria-label="Thành viên"
              >
                Thành viên
              </Link>
            </div>
          </div>


          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-white text-sm font-montserrat">
              Đã có tài khoản?{' '}
              <Link
                href="/auth/signin"
                className="text-vn-gold underline hover:text-white transition-colors duration-300 font-montserrat"
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