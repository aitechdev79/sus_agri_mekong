'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getLocaleFromPathname, withLocalePrefix } from '@/lib/content-locale';

export default function Footer() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isEn = locale === 'en';

  return (
    <footer className="bg-vn-dark text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div>
            <h3 className="font-montserrat font-semibold text-xl mb-4 text-vn-gold">
              {isEn ? 'Contact' : 'Liên hệ'}
            </h3>
            <Link
              href={withLocalePrefix('/contact', locale)}
              className="hover:text-vn-gold transition-colors duration-300 text-base font-montserrat"
              style={{ color: 'rgba(255, 255, 255, 0.8)' }}
            >
              {isEn ? 'Contact page' : 'Trang liên hệ'}
            </Link>
          </div>

          <div>
            <h3 className="font-montserrat font-semibold text-xl mb-4 text-vn-gold">
              {isEn ? 'Member Access' : 'Đăng ký thành viên'}
            </h3>
            <Link
              href={withLocalePrefix('/auth/signin', locale)}
              className="hover:text-vn-gold transition-colors duration-300 text-base font-montserrat"
              style={{ color: 'rgba(255, 255, 255, 0.8)' }}
            >
              {isEn ? 'Sign in now' : 'Đăng ký ngay'}
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/20 text-center">
          <p className="text-sm font-montserrat" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            © {new Date().getFullYear()} VCCI-HCM.{' '}
            {isEn ? 'All rights reserved.' : 'Tất cả các quyền được bảo lưu.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
