'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import NavigationBar from '@/components/NavigationBar'
import Footer from '@/components/Footer'
import { getLocaleFromPathname, withLocalePrefix } from '@/lib/content-locale'

type PartnerStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'

interface BusinessProfileResponse {
  profile: {
    companyName: string
    contactEmail: string | null
    phone: string | null
    website: string | null
    province: string | null
    description: string | null
    status: PartnerStatus
  } | null
}

function statusLabel(status: PartnerStatus) {
  const labels: Record<PartnerStatus, string> = {
    DRAFT: 'Bản nháp',
    PENDING: 'Đang chờ duyệt',
    APPROVED: 'Đã duyệt',
    REJECTED: 'Đã từ chối',
    SUSPENDED: 'Tạm dừng',
  }
  return labels[status]
}

export default function JoinUsPage() {
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname)
  const router = useRouter()
  const { data: session, status } = useSession()

  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    province: '',
    companySize: '',
    industry: '',
    message: '',
  })
  const [profileStatus, setProfileStatus] = useState<PartnerStatus | ''>('')
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const isAuthenticated = status === 'authenticated'
  const isBusinessAccount = session?.user?.role === 'BUSINESS' || session?.user?.role === 'ADMIN'

  const signUpBusinessHref = useMemo(() => {
    return `${withLocalePrefix('/auth/signup', locale)}?role=business`
  }, [locale])

  useEffect(() => {
    const loadProfile = async () => {
      if (!isAuthenticated || !isBusinessAccount) return

      try {
        setLoadingProfile(true)
        const response = await fetch('/api/business/profile')
        const data: BusinessProfileResponse = await response.json()
        if (!response.ok) {
          throw new Error((data as unknown as { error?: string }).error || 'Không thể tải hồ sơ doanh nghiệp')
        }

        const profile = data.profile
        if (profile) {
          setFormData((prev) => ({
            ...prev,
            companyName: profile.companyName || '',
            email: profile.contactEmail || '',
            phone: profile.phone || '',
            website: profile.website || '',
            province: profile.province || '',
            message: profile.description || '',
          }))
          setProfileStatus(profile.status)
        }
      } catch (profileError) {
        console.error('Join-us profile load error:', profileError)
      } finally {
        setLoadingProfile(false)
      }
    }

    loadProfile()
  }, [isAuthenticated, isBusinessAccount])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const buildDescription = () => {
    const extra = [
      formData.contactName ? `Người liên hệ: ${formData.contactName}` : '',
      formData.companySize ? `Quy mô: ${formData.companySize}` : '',
      formData.industry ? `Lĩnh vực: ${formData.industry}` : '',
      formData.message ? `Ghi chú: ${formData.message}` : '',
    ].filter(Boolean)
    return extra.join('\n')
  }

  const saveDraft = async () => {
    if (!isAuthenticated) {
      router.push(signUpBusinessHref)
      return
    }

    if (!isBusinessAccount) {
      setError('Tài khoản hiện tại chưa có quyền doanh nghiệp. Vui lòng liên hệ admin để chuyển role BUSINESS.')
      return
    }

    try {
      setSavingDraft(true)
      setError('')
      setSuccess('')

      const response = await fetch('/api/business/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: formData.companyName,
          slug: formData.companyName,
          contactEmail: formData.email,
          phone: formData.phone,
          website: formData.website,
          province: formData.province,
          description: buildDescription(),
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Không thể lưu hồ sơ doanh nghiệp')
      }

      setProfileStatus(data.profile?.status || 'DRAFT')
      setSuccess('Đã lưu hồ sơ doanh nghiệp (bản nháp).')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Đã xảy ra lỗi khi lưu hồ sơ.')
    } finally {
      setSavingDraft(false)
    }
  }

  const submitForReview = async () => {
    if (!isAuthenticated) {
      router.push(signUpBusinessHref)
      return
    }

    if (!isBusinessAccount) {
      setError('Tài khoản hiện tại chưa có quyền doanh nghiệp. Vui lòng liên hệ admin để chuyển role BUSINESS.')
      return
    }

    try {
      setSubmitting(true)
      setError('')
      setSuccess('')

      const saveResponse = await fetch('/api/business/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: formData.companyName,
          slug: formData.companyName,
          contactEmail: formData.email,
          phone: formData.phone,
          website: formData.website,
          province: formData.province,
          description: buildDescription(),
        }),
      })
      const saveData = await saveResponse.json()
      if (!saveResponse.ok) {
        throw new Error(saveData.error || 'Không thể lưu hồ sơ trước khi gửi duyệt')
      }

      const submitResponse = await fetch('/api/business/profile/submit', {
        method: 'POST',
      })
      const submitData = await submitResponse.json()
      if (!submitResponse.ok) {
        throw new Error(submitData.error || 'Không thể gửi hồ sơ chờ duyệt')
      }

      setProfileStatus(submitData.profile?.status || 'PENDING')
      setSuccess('Đã gửi hồ sơ doanh nghiệp. Admin sẽ kiểm duyệt trước khi hiển thị trên trang chủ.')
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Đã xảy ra lỗi khi gửi duyệt.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <section
        className="relative w-screen overflow-hidden"
        style={{ height: '56vh', marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)' }}
      >
        <NavigationBar />
        <div className="absolute inset-0">
          <Image src="/hero_members.jpg" alt="Tham gia mạng lưới hợp tác" fill priority sizes="100vw" className="object-cover" />
        </div>

        <div className="relative flex h-full items-center pt-16">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="max-w-3xl">
              <h1 className="font-montserrat text-left text-3xl font-bold text-white md:text-5xl">
                Trở thành đối tác doanh nghiệp
              </h1>
              <p className="mt-4 max-w-2xl text-left text-sm text-white md:text-lg">
                Đăng ký hồ sơ doanh nghiệp để xuất hiện tại khu vực đối tác trên trang chủ sau khi được admin duyệt.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-16">
        <section className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-700">
            Trạng thái hồ sơ hiện tại:{' '}
            <span className="font-semibold">{profileStatus ? statusLabel(profileStatus) : 'Chưa có hồ sơ'}</span>
          </p>
          {!isAuthenticated && (
            <p className="mt-2 text-sm text-slate-600">
              Bạn chưa đăng nhập. Hãy tạo tài khoản doanh nghiệp trước khi gửi hồ sơ.
            </p>
          )}
          {isAuthenticated && !isBusinessAccount && (
            <p className="mt-2 text-sm text-rose-700">
              Tài khoản hiện tại không phải doanh nghiệp. Vui lòng liên hệ admin để đổi role sang BUSINESS.
            </p>
          )}
        </section>

        <section className="max-w-4xl">
          <h2 className="mb-3 text-3xl font-bold text-gray-800">Đơn đăng ký thành viên doanh nghiệp</h2>
          <p className="mb-8 text-lg text-gray-600">
            Hoàn thiện biểu mẫu dưới đây để tạo hồ sơ doanh nghiệp. Bạn có thể lưu nháp trước khi gửi duyệt.
          </p>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 md:p-12">
            {loadingProfile && <p className="mb-4 text-sm text-gray-500">Đang tải hồ sơ hiện có...</p>}
            {error && <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
            {success && <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}

            <form
              onSubmit={(e) => {
                e.preventDefault()
              }}
              className="space-y-6"
            >
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="companyName" className="mb-2 block text-sm font-semibold text-gray-700">
                    Tên công ty <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Nhập tên công ty"
                  />
                </div>

                <div>
                  <label htmlFor="contactName" className="mb-2 block text-sm font-semibold text-gray-700">
                    Người liên hệ
                  </label>
                  <input
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Tên người phụ trách"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-700">
                    Email liên hệ <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="example@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-gray-700">
                    Số điện thoại
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="+84 xxx xxx xxx"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="website" className="mb-2 block text-sm font-semibold text-gray-700">
                    Website
                  </label>
                  <input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label htmlFor="province" className="mb-2 block text-sm font-semibold text-gray-700">
                    Tỉnh/Thành
                  </label>
                  <input
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ví dụ: Cà Mau"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="companySize" className="mb-2 block text-sm font-semibold text-gray-700">
                    Quy mô công ty
                  </label>
                  <select
                    id="companySize"
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Chọn quy mô</option>
                    <option value="1-10">1-10 nhân viên</option>
                    <option value="11-50">11-50 nhân viên</option>
                    <option value="51-200">51-200 nhân viên</option>
                    <option value="201-500">201-500 nhân viên</option>
                    <option value="500+">Trên 500 nhân viên</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="industry" className="mb-2 block text-sm font-semibold text-gray-700">
                    Lĩnh vực hoạt động
                  </label>
                  <input
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Nông nghiệp, thủy sản, logistics..."
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-semibold text-gray-700">
                  Giới thiệu ngắn về doanh nghiệp
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Mô tả ngắn về doanh nghiệp và định hướng hợp tác..."
                />
              </div>

              <div className="flex flex-col gap-3 pt-2 md:flex-row">
                <button
                  type="button"
                  onClick={saveDraft}
                  disabled={savingDraft || submitting}
                  className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60 md:w-auto"
                >
                  {savingDraft ? 'Đang lưu...' : 'Lưu bản nháp'}
                </button>
                <button
                  type="button"
                  onClick={submitForReview}
                  disabled={savingDraft || submitting}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-60 md:w-auto"
                >
                  {submitting ? 'Đang gửi duyệt...' : 'Gửi hồ sơ chờ duyệt'}
                </button>
                {!isAuthenticated && (
                  <Link
                    href={signUpBusinessHref}
                    className="inline-flex w-full items-center justify-center rounded-lg border border-green-600 px-6 py-3 font-semibold text-green-700 transition hover:bg-green-50 md:w-auto"
                  >
                    Tạo tài khoản doanh nghiệp
                  </Link>
                )}
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
