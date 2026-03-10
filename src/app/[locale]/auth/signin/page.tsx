'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const locale = useLocale();
  const isEn = locale === 'en';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(isEn ? 'Invalid email or password.' : 'Email hoặc mật khẩu không đúng.');
      } else {
        const session = await getSession();
        if (session?.user?.role === 'ADMIN' || session?.user?.role === 'MODERATOR') {
          router.push(`/${locale}/admin`);
        } else {
          router.push(`/${locale}`);
        }
      }
    } catch {
      setError(isEn ? 'An error occurred. Please try again.' : 'Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 via-white to-emerald-50">
      <Header />

      <main className="flex-grow">
        <div className="container mx-auto flex items-center justify-center px-6 py-12 md:py-16">
          <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-xl md:grid-cols-2">
            <div className="relative hidden bg-sky-700 p-10 text-sky-50 md:block">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.20),transparent_42%)]" />
              <div className="relative">
                <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                  <ShieldCheck className="h-4 w-4" />
                  {isEn ? 'Secure Access' : 'Truy cập an toàn'}
                </div>
                <h1 className="text-3xl font-bold leading-tight">
                  {isEn
                    ? 'Sign in to manage content and workflows in one place'
                    : 'Đăng nhập để quản lý nội dung và luồng công việc tại một nơi'}
                </h1>
                <ul className="mt-8 space-y-3 text-sm text-sky-100">
                  <li>
                    {isEn
                      ? 'Centralized moderation and publication controls.'
                      : 'Tập trung kiểm duyệt và xuất bản nội dung.'}
                  </li>
                  <li>
                    {isEn
                      ? 'Track performance metrics from the admin dashboard.'
                      : 'Theo dõi chỉ số hiệu quả trực tiếp từ trang quản trị.'}
                  </li>
                  <li>
                    {isEn
                      ? 'Use AI tools to discover and summarize relevant content.'
                      : 'Dùng công cụ AI để tìm và tóm tắt nội dung liên quan.'}
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-6 md:p-10">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">{isEn ? 'Sign in' : 'Đăng nhập'}</h1>
                <p className="mt-2 text-sm text-gray-600">
                  {isEn ? 'Access your account to continue.' : 'Truy cập tài khoản của bạn để tiếp tục.'}
                </p>
              </div>

              {error && (
                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                    {isEn ? 'Email' : 'Email'}
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 text-gray-900 outline-none ring-sky-500 transition focus:border-sky-500 focus:ring-2"
                      placeholder={isEn ? 'Enter your email' : 'Nhập địa chỉ email'}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                    {isEn ? 'Password' : 'Mật khẩu'}
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-12 text-gray-900 outline-none ring-sky-500 transition focus:border-sky-500 focus:ring-2"
                      placeholder={isEn ? 'Enter your password' : 'Nhập mật khẩu'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      aria-label={showPassword ? (isEn ? 'Hide password' : 'Ẩn mật khẩu') : (isEn ? 'Show password' : 'Hiện mật khẩu')}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full rounded-xl bg-sky-600 py-3 text-sm font-semibold hover:bg-sky-700">
                  {isLoading ? (isEn ? 'Signing in...' : 'Đang đăng nhập...') : (isEn ? 'Sign in' : 'Đăng nhập')}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600">
                {isEn ? "Don't have an account?" : 'Chưa có tài khoản?'}{' '}
                <Link href={`/${locale}/auth/signup`} className="font-semibold text-sky-700 hover:text-sky-600">
                  {isEn ? 'Sign up' : 'Đăng ký'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
