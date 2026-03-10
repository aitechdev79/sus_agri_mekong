'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import NavigationBar from '@/components/NavigationBar'
import { Button } from '@/components/ui/button'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const callbackUrl = '/admin'
      const result = await signIn('credentials', {
        email,
        password,
        callbackUrl,
        redirect: false,
      })

      if (result?.error) {
        setError('Email hoặc mật khẩu không đúng')
      } else {
        router.push(result?.url || callbackUrl)
        router.refresh()
      }
    } catch {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-100">
      <NavigationBar />

      <div className="container mx-auto flex items-center justify-center px-4 py-14 md:py-20">
        <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-xl">
          <div className="p-6 md:p-10">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 font-montserrat">Đăng nhập</h2>
              <p className="mt-2 text-sm text-gray-600 font-montserrat">
                Chưa có tài khoản?{' '}
                <Link href="/auth/signup" className="font-semibold text-emerald-700 hover:text-emerald-600">
                  Tạo tài khoản mới
                </Link>
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 text-gray-900 outline-none ring-emerald-500 transition focus:border-emerald-500 focus:ring-2"
                    placeholder="Địa chỉ email"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Mật khẩu</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-12 text-gray-900 outline-none ring-emerald-500 transition focus:border-emerald-500 focus:ring-2"
                    placeholder="Mật khẩu"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full rounded-xl py-3 text-sm font-semibold">
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
