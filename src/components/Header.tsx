'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Giới thiệu', href: '/about' },
    { name: 'Thư viện', href: '/library' },
    { name: 'Công cụ', href: '/tools' },
    { name: 'Cộng đồng', href: '/community' },
    { name: 'Tin tức', href: '/news' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-blue-600 shadow-lg">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3"
          >
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">GP</span>
            </div>
            <span className="text-white font-bold text-lg hidden md:block">
              Nền Tảng Tư Liệu Hóa
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white hover:text-blue-200 transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Auth buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <Link
                href="/auth/signin"
                className="text-white hover:text-blue-200 transition-colors font-medium"
              >
                Đăng nhập
              </Link>
              <Link
                href="/auth/signup"
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Đăng ký
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white p-2"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-blue-700 rounded-lg mt-2 py-4">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white hover:text-blue-200 transition-colors font-medium px-4 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-blue-600 mt-4 pt-4 px-4">
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/auth/signin"
                    className="text-white hover:text-blue-200 transition-colors font-medium"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors text-center"
                  >
                    Đăng ký
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}