'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import NavigationBar from '@/components/NavigationBar'
import { Button } from '@/components/ui/button'

type AccountType = 'USER' | 'BUSINESS'

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
  const [accountType, setAccountType] = useState<AccountType>('USER')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = new URLSearchParams(window.location.search).get('role')?.toLowerCase()
      if (role === 'business') {
        setAccountType('BUSINESS')
      }
    }
  }, [])

  const provinces = [
    'An Giang',
    'Bắc Ninh',
    'Cà Mau',
    'Cao Bằng',
    'Cần Thơ',
    'Đà Nẵng',
    'Đắk Lắk',
    'Điện Biên',
    'Đồng Nai',
    'Đồng Tháp',
    'Gia Lai',
    'Hà Nội',
    'Hà Tĩnh',
    'Hải Phòng',
    'Hưng Yên',
    'Huế',
    'Khánh Hòa',
    'Lai Châu',
    'Lâm Đồng',
    'Lạng Sơn',
    'Lào Cai',
    'Nghệ An',
    'Ninh Bình',
    'Phú Thọ',
    'Quảng Ngãi',
    'Quảng Ninh',
    'Quảng Trị',
    'Sơn La',
    'Tây Ninh',
    'Thanh Hóa',
    'Thái Nguyên',
    'Thành phố Hồ Chí Minh',
    'Tuyên Quang',
    'Vĩnh Long',
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          role: accountType,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Đã xảy ra lỗi khi đăng ký')
      }

      const roleParam = accountType === 'BUSINESS' ? 'business' : 'user'
      router.push(`/welcome?role=${roleParam}`)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Đã xảy ra lỗi. Vui lòng thử lại.')
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
            <h2 className="mt-6 text-center font-montserrat text-3xl font-extrabold text-gray-900">Tạo tài khoản mới</h2>
            <p className="mt-2 text-center font-montserrat text-sm text-gray-600">
              Hoặc{' '}
              <Link href="/auth/signin" className="font-medium text-green-600 hover:text-green-500">
                đăng nhập vào tài khoản có sẵn
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Loại tài khoản</label>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value as AccountType)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 font-montserrat text-gray-900 focus:border-green-500 focus:outline-none focus:ring-green-500"
                >
                  <option value="USER">Cá nhân</option>
                  <option value="BUSINESS">Doanh nghiệp</option>
                </select>
              </div>

              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 font-montserrat text-gray-900 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-green-500"
                placeholder={accountType === 'BUSINESS' ? 'Tên doanh nghiệp' : 'Họ và tên'}
              />

              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 font-montserrat text-gray-900 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-green-500"
                placeholder="Địa chỉ email"
              />

              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 font-montserrat text-gray-900 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-green-500"
                placeholder="Số điện thoại (VD: 0901234567)"
              />

              <select
                name="province"
                required
                value={formData.province}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 font-montserrat text-gray-900 focus:border-green-500 focus:outline-none focus:ring-green-500"
              >
                <option value="">Chọn tỉnh/thành phố</option>
                {provinces.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Tổ chức/Doanh nghiệp (không bắt buộc)</label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 font-montserrat text-gray-900 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-green-500"
                  placeholder="Nhập tổ chức/doanh nghiệp"
                />
              </div>

              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 font-montserrat text-gray-900 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-green-500"
                placeholder="Mật khẩu"
              />

              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 font-montserrat text-gray-900 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-green-500"
                placeholder="Xác nhận mật khẩu"
              />
            </div>

            {error && <div className="text-center font-montserrat text-sm text-red-600">{error}</div>}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
