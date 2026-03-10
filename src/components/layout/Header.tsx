'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Globe, LogOut, Menu, User, X } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

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
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-green-600">
              <span className="text-sm font-bold text-white">GP</span>
            </div>
            <span className="text-lg font-bold">Good Practices</span>
          </Link>

          <nav className="hidden space-x-8 md:flex">
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

          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200"></div>
            ) : session ? (
              <div className="flex items-center space-x-2">
                <span className="hidden text-sm text-gray-700 md:block">Xin chào, {session.user.name}</span>
                <Link href="/account">
                  <Button variant="ghost" size="sm">
                    <User className="mr-1 h-4 w-4" />
                    Tài khoản
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                  <LogOut className="mr-1 h-4 w-4" />
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">
                    <User className="mr-1 h-4 w-4" />
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Đăng ký</Button>
                </Link>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
            >
              <Globe className="mr-1 h-4 w-4" />
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

        {isMenuOpen && (
          <div className="border-t py-4 md:hidden">
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
