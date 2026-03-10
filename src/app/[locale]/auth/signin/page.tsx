'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
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
      const callbackUrl = `/${locale}/admin`;
      const result = await signIn('credentials', {
        email,
        password,
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        setError(isEn ? 'Invalid email or password.' : 'Email hoáº·c máº­t kháº©u khÃ´ng Ä‘Ãºng.');
      } else {
        router.push(result?.url || callbackUrl);
        router.refresh();
      }
    } catch {
      setError(isEn ? 'An error occurred. Please try again.' : 'ÄÃ£ xáº£y ra lá»—i. Vui lÃ²ng thá»­ láº¡i.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 via-white to-emerald-50">
      <Header />

      <main className="flex-grow">
        <div className="container mx-auto flex items-center justify-center px-6 py-12 md:py-16">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-xl">
            <div className="p-6 md:p-10">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">{isEn ? 'Sign in' : 'ÄÄƒng nháº­p'}</h1>
                <p className="mt-2 text-sm text-gray-600">
                  {isEn ? 'Access your account to continue.' : 'Truy cáº­p tÃ i khoáº£n cá»§a báº¡n Ä‘á»ƒ tiáº¿p tá»¥c.'}
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
                    Email
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
                      placeholder={isEn ? 'Enter your email' : 'Nháº­p Ä‘á»‹a chá»‰ email'}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                    {isEn ? 'Password' : 'Máº­t kháº©u'}
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
                      placeholder={isEn ? 'Enter your password' : 'Nháº­p máº­t kháº©u'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      aria-label={showPassword ? (isEn ? 'Hide password' : 'áº¨n máº­t kháº©u') : (isEn ? 'Show password' : 'Hiá»‡n máº­t kháº©u')}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full rounded-xl bg-sky-600 py-3 text-sm font-semibold hover:bg-sky-700">
                  {isLoading ? (isEn ? 'Signing in...' : 'Äang Ä‘Äƒng nháº­p...') : (isEn ? 'Sign in' : 'ÄÄƒng nháº­p')}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600">
                {isEn ? "Don't have an account?" : 'ChÆ°a cÃ³ tÃ i khoáº£n?'}{' '}
                <Link href={`/${locale}/auth/signup`} className="font-semibold text-sky-700 hover:text-sky-600">
                  {isEn ? 'Sign up' : 'ÄÄƒng kÃ½'}
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

