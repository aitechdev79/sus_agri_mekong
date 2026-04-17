'use client';

import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { getLocaleFromPathname, withLocalePrefix } from '@/lib/content-locale';

const socialLinks = [
  { label: 'Facebook', href: 'https://www.facebook.com/VCCIHCMC/' },
  { label: 'Twitter/X', href: 'https://twitter.com/VCCI_HCM' },
  { label: 'YouTube', href: 'https://www.youtube.com/user/VCCIHCMC' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/vietnam-chamber-of-commerce-and-industry-ho-chi-minh-city-branch-vcci-hcm-',
  },
];

export default function Footer() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isEn = locale === 'en';
  const contactHref = withLocalePrefix('/contact', locale);
  const signupHref = withLocalePrefix('/auth/signup', locale);

  return (
    <footer className="relative z-20 bg-vn-dark text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 font-montserrat text-xl font-semibold">
              <Link href={contactHref} className="text-vn-gold transition-colors duration-300 hover:text-white">
                {isEn ? 'Contact' : 'Liên lạc'}
              </Link>
            </h3>
            <Link
              href={contactHref}
              className="font-montserrat text-base transition-colors duration-300 hover:text-vn-gold"
              style={{ color: 'rgba(255, 255, 255, 0.8)' }}
            >
              {isEn ? 'Contact page' : 'Trang liên lạc'}
            </Link>
          </div>

          <div>
            <h3 className="mb-4 font-montserrat text-xl font-semibold">
              <Link href={signupHref} className="text-vn-gold transition-colors duration-300 hover:text-white">
                {isEn ? 'Member Registration' : 'Đăng ký thành viên'}
              </Link>
            </h3>
            <Link
              href={signupHref}
              className="font-montserrat text-base transition-colors duration-300 hover:text-vn-gold"
              style={{ color: 'rgba(255, 255, 255, 0.8)' }}
            >
              {isEn ? 'Register now' : 'Đăng ký ngay'}
            </Link>
          </div>

          <div>
            <h3 className="mb-4 font-montserrat text-xl font-semibold text-vn-gold">
              {isEn ? 'VCCI-HCM Contact' : 'LIÊN HỆ'}
            </h3>
            <div className="space-y-3 font-montserrat text-sm leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              <p className="font-semibold text-white">
                {isEn
                  ? 'Vietnam Chamber of Commerce and Industry - Ho Chi Minh City Branch'
                  : 'Liên đoàn Thương mại & Công nghiệp Việt Nam - Chi nhánh Khu vực Thành phố Hồ Chí Minh'}
              </p>
              <p className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-vn-gold" />
                <span>171 Võ Thị Sáu, Phường Xuân Hoà, TP. HCM</span>
              </p>
              <p className="flex gap-2">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-vn-gold" />
                <span>
                  <a href="tel:+842839326598" className="transition-colors hover:text-vn-gold">+84 28 3932 6598</a>
                  <span className="mx-2">|</span>
                  <a href="tel:+842839325472" className="transition-colors hover:text-vn-gold">+84 28 3932 5472</a>
                </span>
              </p>
              <p className="flex gap-2">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-vn-gold" />
                <a href="mailto:info@vcci-hcm.org.vn" className="transition-colors hover:text-vn-gold">
                  info@vcci-hcm.org.vn
                </a>
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-montserrat text-xl font-semibold text-vn-gold">
              {isEn ? 'Connect' : 'KẾT NỐI'}
            </h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded border border-white/25 px-3 py-2 font-montserrat text-sm transition-colors hover:border-vn-gold hover:text-vn-gold"
                  style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/20 pt-8 text-center">
          <p className="font-montserrat text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            © {new Date().getFullYear()} VCCI-HCM.{' '}
            {isEn ? 'All rights reserved.' : 'Tất cả các quyền được bảo lưu.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
