'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Globe, Menu, X, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSession, signOut } from 'next-auth/react'

interface HeaderProps {
  currentPath?: string
}

export function Header({ currentPath }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [language, setLanguage] = useState<'vi' | 'en'>('vi')
  const { data: session, status } = useSession()

  const navigation = [
    { href: '/', label: language === 'vi' ? 'Trang Chủ' : 'Home' },
    { href: '/library', label: language === 'vi' ? 'Thư Viện' : 'Library' },
    { href: '/about', label: language === 'vi' ? 'Giới Thiệu' : 'About' },
  ]

  if (session?.user?.role === 'ADMIN') {
    navigation.push({ href: '/admin', label: language === 'vi' ? 'Quản Trị' : 'Admin' })
  }

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded bg-green-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">GP</span>
            </div>
            <span className="font-bold text-lg">Good Practices</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-green-600 ${
                  currentPath === item.href ? 'text-green-600' : 'text-gray-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Actions & Language Toggle & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : session ? (
              <div className="flex items-center space-x-2">
                <span className="hidden md:block text-sm text-gray-700">
                  Xin chào, {session.user.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-1" />
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">
                    Đăng ký
                  </Button>
                </Link>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
            >
              <Globe className="h-4 w-4 mr-1" />
              {language === 'vi' ? 'EN' : 'VI'}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 text-gray-700 hover:text-green-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}