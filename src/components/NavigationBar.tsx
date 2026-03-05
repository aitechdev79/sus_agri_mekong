'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { getLocaleFromPathname, stripLocalePrefix, withLocalePrefix } from '@/lib/content-locale';

export default function NavigationBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const otherLocale = locale === 'en' ? 'vi' : 'en';
  const normalizedPath = stripLocalePrefix(pathname);

  const homeHref = withLocalePrefix('/', locale);
  const libraryHref = withLocalePrefix('/library', locale);
  const newsHref = withLocalePrefix('/news', locale);
  const exploreHref = withLocalePrefix('/vision-mission', locale);
  const signInHref = withLocalePrefix('/auth/signin', locale);
  const switchLocaleHref = withLocalePrefix(normalizedPath, otherLocale);

  const labels =
    locale === 'en'
      ? {
          home: 'Home',
          library: 'Library',
          news: 'News',
          explore: 'Explore',
          signIn: 'SIGN IN'
        }
      : {
          home: 'Trang chu',
          library: 'Thu vien',
          news: 'Tin tuc',
          explore: 'Kham pha',
          signIn: 'DANG NHAP'
        };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href={homeHref} className="flex items-center gap-3 md:gap-4">
            <Image
              src="/VCCI-HCM logo VN (blue).png"
              alt="VCCI-HCM Logo"
              width={80}
              height={40}
              className="h-8 md:h-10 w-auto scale-120"
              style={{ transform: 'scale(1.2)' }}
              priority
            />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-8">
              <Link
                href={homeHref}
                className="font-montserrat font-normal text-base text-vn-dark hover:text-vn-green transition-colors"
                aria-label={labels.home}
              >
                <Home className="w-5 h-5" />
              </Link>
              <Link
                href={libraryHref}
                className="font-montserrat font-normal text-base text-vn-dark uppercase tracking-wide hover:underline hover:text-vn-green transition-colors"
              >
                {labels.library}
              </Link>
              <Link
                href={newsHref}
                className="font-montserrat font-normal text-base text-vn-dark uppercase tracking-wide hover:underline hover:text-vn-green transition-colors"
              >
                {labels.news}
              </Link>
              <Link
                href={exploreHref}
                className="font-montserrat font-normal text-base text-vn-dark uppercase tracking-wide hover:underline hover:text-vn-green transition-colors"
              >
                {labels.explore}
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={switchLocaleHref}
                className="font-montserrat text-sm font-semibold text-vn-dark border border-vn-dark px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
              >
                {otherLocale.toUpperCase()}
              </Link>
              <Link
                href={signInHref}
                className="font-montserrat font-normal text-base text-vn-green border-2 border-vn-green px-4 py-2 rounded-lg hover:bg-vn-green hover:text-white transition-all duration-300"
              >
                {labels.signIn}
              </Link>
            </div>
          </div>

          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="md:hidden p-2 text-vn-dark hover:text-vn-green transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-white/20">
            <div className="flex flex-col space-y-4 px-6 py-6">
              <Link
                href={homeHref}
                className="font-montserrat font-normal text-base text-vn-dark hover:text-vn-green transition-colors flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
                aria-label={labels.home}
              >
                <Home className="w-5 h-5" />
                <span className="uppercase tracking-wide">{labels.home}</span>
              </Link>
              <Link
                href={libraryHref}
                className="font-montserrat font-normal text-base text-vn-dark uppercase tracking-wide hover:text-vn-green transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {labels.library}
              </Link>
              <Link
                href={newsHref}
                className="font-montserrat font-normal text-base text-vn-dark uppercase tracking-wide hover:text-vn-green transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {labels.news}
              </Link>
              <Link
                href={exploreHref}
                className="font-montserrat font-normal text-base text-vn-dark uppercase tracking-wide hover:text-vn-green transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {labels.explore}
              </Link>
              <Link
                href={switchLocaleHref}
                className="font-montserrat font-semibold text-sm text-vn-dark border border-vn-dark px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                {otherLocale.toUpperCase()}
              </Link>
              <Link
                href={signInHref}
                className="font-montserrat font-normal text-base text-vn-green border-2 border-vn-green px-4 py-2 rounded-lg hover:bg-vn-green hover:text-white transition-all duration-300 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                {labels.signIn}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
