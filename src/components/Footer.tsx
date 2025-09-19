'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Facebook, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const navigation = {
    main: [
      { name: 'Giới thiệu', href: '/about' },
      { name: 'Thư viện', href: '/library' },
      { name: 'Công cụ', href: '/tools' },
      { name: 'Cộng đồng', href: '/community' },
      { name: 'Tin tức', href: '/news' },
    ],
    support: [
      { name: 'Trợ giúp', href: '/help' },
      { name: 'Liên hệ', href: '/contact' },
      { name: 'Quyền riêng tư', href: '/privacy' },
      { name: 'Điều khoản', href: '/terms' },
    ],
    social: [
      { name: 'Facebook', href: '#', icon: Facebook },
      { name: 'Twitter', href: '#', icon: Twitter },
      { name: 'YouTube', href: '#', icon: Youtube },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">GP</span>
              </div>
              <span className="font-bold text-lg">Nền Tảng Thực Hành Tốt</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Chia sẻ và học hỏi các thực hành tốt trong chuỗi giá trị tôm và lúa bền vững
            </p>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>123 Đường ABC, Quận 1, TP.HCM, Việt Nam</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+84 123 456 789</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>info@goodpractices.vn</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Bản tin</h3>
            <p className="text-gray-300 text-sm mb-4">
              Đăng ký nhận thông tin mới nhất về thực hành tốt
            </p>
            <div className="flex flex-col space-y-2">
              <input
                type="email"
                defaultValue=""
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => {
                  // Handle newsletter signup
                  console.log('Newsletter signup:', email);
                  setEmail('');
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Đăng ký
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <p className="text-gray-400 text-sm">
              © 2025 Nền Tảng Thực Hành Tốt. Tất cả quyền được bảo lưu.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {navigation.social.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={item.name}
                >
                  <item.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>

            {/* Partners */}
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>Đối tác:</span>
              <span className="text-blue-400">VCCI</span>
              <span className="text-green-400">Oxfam</span>
              <span className="text-red-400">HCM</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}