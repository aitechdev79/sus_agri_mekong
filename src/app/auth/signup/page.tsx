'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import NavigationBar from '@/components/NavigationBar'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    province: '',
    organization: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isBusinessSignUp, setIsBusinessSignUp] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = new URLSearchParams(window.location.search).get('role')?.toLowerCase()
      setIsBusinessSignUp(role === 'business')
    }
  }, [])

  const provinces = ['An Giang', 'Sóc Trăng', 'Bạc Liêu', 'Cà Mau', 'TP. Hồ Chí Minh', 'Cần Thơ']

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          role: isBusinessSignUp ? 'BUSINESS' : 'USER',
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const message = isBusinessSignUp
          ? 'Đăng ký tài khoản doanh nghiệp thành công! Vui lòng đăng nhập để hoàn thiện hồ sơ.'
          : 'Đăng ký thành công! Vui lòng đăng nhập.'
        router.push(`/auth/signin?message=${encodeURIComponent(message)}`)
      } else {
        setError(data.message || 'Đã xảy ra lỗi khi đăng ký')
      }
    } catch {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <div className="flex items-center justify-center pb-8 pt-20">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center font-montserrat text-3xl font-extrabold text-gray-900">
              {isBusinessSignUp ? 'Tạo tài khoản doanh nghiệp' : 'Tạo tài khoản mới'}
            </h2>
            <p className="mt-2 text-center font-montserrat text-sm text-gray-600">
              Hoặc{' '}
              <Link href="/auth/signin" className="font-medium text-green-600 hover:text-green-500">
                đăng nhập vào tài khoản có sẵn
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="relative block w-full rounded-md border border-gray-300 px-3 py-2 font-montserrat text-gray-900 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-green-500"
                placeholder="Họ và tên"
              />

              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="relative block w-full rounded-md border border-gray-300 px-3 py-2 font-montserrat text-gray-900 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-green-500"
                placeholder="Địa chỉ email"
              />

              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="relative block w-full rounded-md border border-gray-300 px-3 py-2 font-montserrat text-gray-900 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-green-500"
                placeholder="Số điện thoại (VD: 0901234567)"
              />

              <select
                name="province"
                required
                value={formData.province}
                onChange={handleChange}
                className="relative block w-full rounded-md border border-gray-300 px-3 py-2 font-montserrat text-gray-900 focus:border-green-500 focus:outline-none focus:ring-green-500"
              >
                <option value="">Chọn tỉnh/thành phố</option>
                {provinces.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                className="relative block w-full rounded-md border border-gray-300 px-3 py-2 font-montserrat text-gray-900 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-green-500"
                placeholder="Tổ chức/Doanh nghiệp (không bắt buộc)"
              />

              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="relative block w-full rounded-md border border-gray-300 px-3 py-2 font-montserrat text-gray-900 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-green-500"
                placeholder="Mật khẩu"
              />

              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="relative block w-full rounded-md border border-gray-300 px-3 py-2 font-montserrat text-gray-900 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-green-500"
                placeholder="Xác nhận mật khẩu"
              />
            </div>

            {error && <div className="text-center font-montserrat text-sm text-red-600">{error}</div>}

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
