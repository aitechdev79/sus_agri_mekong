'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import NavigationBar from '@/components/NavigationBar'
import Footer from '@/components/Footer'

type AccountType = 'USER' | 'BUSINESS'

export default function SignUpPage() {
  const locale = useLocale()
  const isEn = locale === 'en'
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    province: '',
    businessSector: '',
  })
  const [accountType, setAccountType] = useState<AccountType>('USER')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = new URLSearchParams(window.location.search).get('role')?.toLowerCase()
      if (role === 'business') {
        setAccountType('BUSINESS')
      }
    }
  }, [])

  const text = useMemo(
    () =>
      isEn
        ? {
            title: 'Create account',
            subtitle: 'Register to access platform content and tools',
            typeLabel: 'Account type',
            userLabel: 'Personal',
            businessLabel: 'Business',
            fullName: 'Full name',
            businessSector: 'Business sector',
            email: 'Email',
            phone: 'Phone',
            province: 'Province/City',
            password: 'Password',
            confirmPassword: 'Confirm password',
            selectProvince: 'Select province/city',
            passwordMismatch: 'Password confirmation does not match.',
            signUp: 'Sign up',
            signingUp: 'Signing up...',
            hasAccount: 'Already have an account?',
            signIn: 'Sign in',
            businessSectorRequired: 'Business sector is required for business accounts.',
            successBusiness: 'Business account created. Please sign in.',
            successUser: 'Registration successful. Please sign in.',
          }
        : {
            title: 'Tạo tài khoản',
            subtitle: 'Đăng ký để truy cập nội dung và công cụ trên nền tảng',
            typeLabel: 'Loại tài khoản',
            userLabel: 'Cá nhân',
            businessLabel: 'Doanh nghiệp',
            fullName: 'Họ và tên',
            businessSector: 'Lĩnh vực kinh doanh',
            email: 'Email',
            phone: 'Số điện thoại',
            province: 'Tỉnh/Thành phố',
            password: 'Mật khẩu',
            confirmPassword: 'Xác nhận mật khẩu',
            selectProvince: 'Chọn tỉnh/thành phố',
            passwordMismatch: 'Mật khẩu xác nhận không khớp.',
            signUp: 'Đăng ký',
            signingUp: 'Đang đăng ký...',
            hasAccount: 'Đã có tài khoản?',
            signIn: 'Đăng nhập',
            businessSectorRequired: 'Vui lòng nhập lĩnh vực kinh doanh cho tài khoản doanh nghiệp.',
            successBusiness: 'Đăng ký tài khoản doanh nghiệp thành công. Vui lòng đăng nhập.',
            successUser: 'Đăng ký thành công. Vui lòng đăng nhập.',
          },
    [isEn],
  )

  const provinces = [
    'An Giang',
    'Bắc Ninh',
    'Bạc Liêu',
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    if (formData.password !== formData.confirmPassword) {
      setError(text.passwordMismatch)
      setIsLoading(false)
      return
    }
    if (accountType === 'BUSINESS' && !formData.businessSector.trim()) {
      setError(text.businessSectorRequired)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          province: formData.province,
          organization: accountType === 'BUSINESS' ? formData.businessSector.trim() : null,
          role: accountType,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Registration failed')
      }

      setSuccess(accountType === 'BUSINESS' ? text.successBusiness : text.successUser)
      setTimeout(() => {
        if (accountType === 'BUSINESS') {
          router.push(`/${locale}/auth/signin`)
          return
        }
        router.push(`/${locale}/welcome?role=user`)
      }, 1200)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />

      <main className="flex-grow bg-gray-50 pb-12 pt-24">
        <div className="container mx-auto max-w-2xl px-6">
          <div className="rounded-lg bg-white p-8 shadow-md">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-2xl font-bold text-gray-800">{text.title}</h1>
              <p className="text-gray-600">{text.subtitle}</p>
            </div>

            {success && (
              <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">{text.typeLabel}</label>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value as AccountType)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USER">{text.userLabel}</option>
                  <option value="BUSINESS">{text.businessLabel}</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <input
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={text.fullName}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={text.email}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={text.phone}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{text.selectProvince}</option>
                  {provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>

              {accountType === 'BUSINESS' && (
                <div>
                  <input
                    name="businessSector"
                    required
                    value={formData.businessSector}
                    onChange={handleInputChange}
                    placeholder={text.businessSector}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={text.password}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder={text.confirmPassword}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
              >
                {isLoading ? text.signingUp : text.signUp}
              </button>
            </form>

            <div className="mt-6 text-center text-gray-600">
              {text.hasAccount}{' '}
              <Link href={`/${locale}/auth/signin`} className="font-medium text-blue-600 hover:text-blue-700">
                {text.signIn}
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
