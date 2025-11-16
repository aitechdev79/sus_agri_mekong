'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

export default function NavigationBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logos */}
          <Link href="/" className="flex items-center gap-3 md:gap-4">
            <Image
              src="/VCCI-HCM logo VN (blue).png"
              alt="VCCI-HCM Logo"
              width={80}
              height={40}
              className="h-8 md:h-10 w-auto scale-120"
              style={{ transform: 'scale(1.2)' }}
              priority
            />
            <Image
              src="/OX_HL_C_RGB.png"
              alt="Oxfam Logo"
              width={80}
              height={40}
              className="h-8 md:h-10 w-auto"
              priority
            />
            <Image
              src="/CBD_logo_EN_CMYK.png"
              alt="CBD Logo"
              width={80}
              height={40}
              className="h-8 md:h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-8">
              <Link
                href="/library"
                className="font-montserrat font-normal text-base text-gray-800 uppercase tracking-wide hover:underline hover:text-green-500 transition-colors"
              >
                Thư viện
              </Link>
              <Link
                href="/news"
                className="font-montserrat font-normal text-base text-gray-800 uppercase tracking-wide hover:underline hover:text-green-500 transition-colors"
              >
                Tin tức
              </Link>
              <Link
                href="/about-us"
                className="font-montserrat font-normal text-base text-gray-800 uppercase tracking-wide hover:underline hover:text-green-500 transition-colors"
              >
                Khám phá
              </Link>
            </div>

            {/* Login Button */}
            <div className="flex items-center">
              <Link
                href="/auth/signin"
                className="font-montserrat font-normal text-base text-gray-800 hover:text-green-500 transition-colors"
              >
                ĐĂNG NHẬP
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-white hover:text-green-500 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-white/20">
            <div className="flex flex-col space-y-4 px-6 py-6">
              <Link
                href="/library"
                className="font-montserrat font-normal text-base text-gray-800 uppercase tracking-wide hover:text-green-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Thư viện
              </Link>
              <Link
                href="/news"
                className="font-montserrat font-normal text-base text-gray-800 uppercase tracking-wide hover:text-green-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Tin tức
              </Link>
              <Link
                href="/about-us"
                className="font-montserrat font-normal text-base text-gray-800 uppercase tracking-wide hover:text-green-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Khám phá
              </Link>
              <Link
                href="/auth/signin"
                className="font-montserrat font-normal text-base text-gray-800 hover:text-green-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                ĐĂNG NHẬP
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}