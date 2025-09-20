'use client'

import { useState } from 'react'
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
    organization: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [otp, setOtp] = useState('')
  const router = useRouter()

  const provinces = [
    'An Giang', 'Sóc Trăng', 'Bạc Liêu', 'Cà Mau',
    'TP. Hồ Chí Minh', 'Cần Thơ'
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setShowOTPModal(true)
      } else {
        setError(data.message || 'Đã xảy ra lỗi khi đăng ký')
      }
    } catch (error) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formData.phone,
          code: otp
        }),
      })

      if (response.ok) {
        router.push('/auth/signin?message=Đăng ký thành công! Vui lòng đăng nhập.')
      } else {
        const data = await response.json()
        setError(data.message || 'Mã OTP không đúng')
      }
    } catch (error) {
      setError('Đã xảy ra lỗi khi xác thực OTP')
    } finally {
      setIsLoading(false)
    }
  }

  if (showOTPModal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 font-montserrat">
              Xác thực số điện thoại
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 font-montserrat">
              Mã OTP đã được gửi đến số {formData.phone}
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleOTPVerification}>
            <div>
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-montserrat"
                placeholder="Nhập mã OTP"
                maxLength={6}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center font-montserrat">{error}</div>
            )}

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 font-montserrat"
              >
                {isLoading ? 'Đang xác thực...' : 'Xác thực'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <div className="flex items-center justify-center pt-20 pb-8">
        <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 font-montserrat">
            Tạo tài khoản mới
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 font-montserrat">
            Hoặc{' '}
            <Link href="/auth/signin" className="font-medium text-green-600 hover:text-green-500 font-montserrat">
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
              className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-montserrat"
              placeholder="Họ và tên"
            />

            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-montserrat"
              placeholder="Địa chỉ email"
            />

            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-montserrat"
              placeholder="Số điện thoại (VD: 0901234567)"
            />

            <select
              name="province"
              required
              value={formData.province}
              onChange={handleChange}
              className="relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-montserrat"
            >
              <option value="">Chọn tỉnh/thành phố</option>
              {provinces.map((province) => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>

            <input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-montserrat"
              placeholder="Tổ chức/Doanh nghiệp (không bắt buộc)"
            />

            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-montserrat"
              placeholder="Mật khẩu"
            />

            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-montserrat"
              placeholder="Xác nhận mật khẩu"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center font-montserrat">{error}</div>
          )}

          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 font-montserrat"
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