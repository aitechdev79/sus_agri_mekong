'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-vn-dark text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Liên hệ */}
          <div>
            <h3 className="font-montserrat font-semibold text-xl mb-4 text-vn-gold">Liên hệ</h3>
            <Link
              href="/contact"
              className="hover:text-vn-gold transition-colors duration-300 text-base font-montserrat"
              style={{ color: 'rgba(255, 255, 255, 0.8)' }}
            >
              Trang liên hệ
            </Link>
          </div>

          {/* Đăng ký thành viên */}
          <div>
            <h3 className="font-montserrat font-semibold text-xl mb-4 text-vn-gold">Đăng ký thành viên</h3>
            <Link
              href="/auth/signin"
              className="hover:text-vn-gold transition-colors duration-300 text-base font-montserrat"
              style={{ color: 'rgba(255, 255, 255, 0.8)' }}
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/20 text-center">
          <p className="text-sm font-montserrat" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            © {new Date().getFullYear()} VCCI-HCM. Tất cả các quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}