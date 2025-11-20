'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Liên hệ */}
          <div>
            <h3 className="font-montserrat font-semibold text-xl mb-4">Liên hệ</h3>
            <Link
              href="/contact"
              className="text-gray-300 hover:text-white transition-colors text-base"
            >
              Trang liên hệ
            </Link>
          </div>

          {/* Đăng ký thành viên */}
          <div>
            <h3 className="font-montserrat font-semibold text-xl mb-4">Đăng ký thành viên</h3>
            <Link
              href="/auth/signin"
              className="text-gray-300 hover:text-white transition-colors text-base"
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}