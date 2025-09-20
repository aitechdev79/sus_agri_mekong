'use client';

import { useState } from 'react';
import Link from 'next/link';
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
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-black font-montserrat text-white bg-green-600 px-3 py-1 rounded">
              VO
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-8">
              <Link
                href="/library"
                className="font-montserrat font-normal text-base text-gray-800 uppercase tracking-wide hover:underline hover:text-green-500 transition-colors"
              >
                Tài liệu
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
                Về chúng tôi
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
                Tài liệu
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
                Về chúng tôi
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