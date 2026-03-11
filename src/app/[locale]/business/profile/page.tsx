'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocale } from 'next-intl'
import NavigationBar from '@/components/NavigationBar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'

interface BusinessProfile {
  id: string
  companyName: string
  slug: string
  logoUrl: string | null
  website: string | null
  contactEmail: string | null
  phone: string | null
  province: string | null
  description: string | null
}

export default function BusinessProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const locale = useLocale()
  const searchParams = useSearchParams()
  const initMode = searchParams.get('init') === '1'
  const isEn = locale === 'en'

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    companyName: '',
    logoUrl: '',
    website: '',
    contactEmail: '',
    phone: '',
    province: '',
    description: '',
  })

  const text = useMemo(
    () =>
      isEn
        ? {
            title: 'Complete business profile',
            subtitle: 'Provide your business information for review and partner listing.',
            companyName: 'Business name',
            website: 'Website',
            contactEmail: 'Contact email',
            phone: 'Phone',
            province: 'Province/City',
            description: 'Description',
            logo: 'Business logo',
            uploadLogo: 'Upload logo',
            uploadingLogo: 'Uploading...',
            noLogo: 'No logo uploaded',
            save: 'Save profile',
            saving: 'Saving...',
            unauthorized: 'Only business accounts can access this page.',
            defaultSuccess: 'Business profile saved successfully.',
          }
        : {
            title: 'Hoàn thiện hồ sơ doanh nghiệp',
            subtitle: 'Cập nhật thông tin doanh nghiệp để gửi duyệt và hiển thị ở mục đối tác.',
            companyName: 'Tên doanh nghiệp',
            website: 'Website',
            contactEmail: 'Email liên hệ',
            phone: 'Số điện thoại',
            province: 'Tỉnh/Thành phố',
            description: 'Mô tả',
            logo: 'Logo doanh nghiệp',
            uploadLogo: 'Tải logo',
            uploadingLogo: 'Đang tải...',
            noLogo: 'Chưa có logo',
            save: 'Lưu hồ sơ',
            saving: 'Đang lưu...',
            unauthorized: 'Chỉ tài khoản doanh nghiệp mới truy cập được trang này.',
            defaultSuccess: 'Đã lưu hồ sơ doanh nghiệp thành công.',
          },
    [isEn],
  )

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push(`/${locale}/auth/signin`)
      return
    }

    if (session.user.role !== 'BUSINESS') {
      router.push(`/${locale}`)
      return
    }

    void loadProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session, locale, router])

  const loadProfile = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch('/api/business/profile')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load business profile')
      }

      if (data.profile) {
        fillForm(data.profile as BusinessProfile)
        return
      }

      if (!initMode) {
        setLoading(false)
        return
      }

      const fallbackCompanyName =
        session?.user?.name?.trim() ||
        session?.user?.email?.split('@')[0] ||
        (isEn ? 'My business' : 'Doanh nghiệp của tôi')

      const initResponse = await fetch('/api/business/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName: fallbackCompanyName }),
      })

      const initData = await initResponse.json()
      if (!initResponse.ok) {
        throw new Error(initData.error || 'Failed to initialize business profile')
      }

      if (initData.profile) {
        fillForm(initData.profile as BusinessProfile)
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Đã xảy ra lỗi')
    } finally {
      setLoading(false)
    }
  }

  const fillForm = (profile: BusinessProfile) => {
    setFormData({
      companyName: profile.companyName || '',
      logoUrl: profile.logoUrl || '',
      website: profile.website || '',
      contactEmail: profile.contactEmail || '',
      phone: profile.phone || '',
      province: profile.province || '',
      description: profile.description || '',
    })
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/business/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save profile')
      }

      setSuccess(text.defaultSuccess)
      if (data.profile) {
        fillForm(data.profile as BusinessProfile)
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Đã xảy ra lỗi')
    } finally {
      setSaving(false)
    }
  }

  const handleLogoChange = async (file: File | null) => {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError(isEn ? 'Please select an image file.' : 'Vui lòng chọn file ảnh.')
      return
    }

    try {
      setUploadingLogo(true)
      setError('')
      setSuccess('')

      const uploadForm = new FormData()
      uploadForm.append('file', file)

      const response = await fetch('/api/business/profile/logo', {
        method: 'POST',
        body: uploadForm,
      })
      const data = await response.json()

      if (!response.ok || !data?.file?.url) {
        throw new Error(data?.error || (isEn ? 'Failed to upload logo' : 'Không thể tải logo'))
      }

      setFormData((prev) => ({ ...prev, logoUrl: String(data.file.url) }))
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : isEn ? 'Upload failed' : 'Tải logo thất bại')
    } finally {
      setUploadingLogo(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationBar />
        <main className="container mx-auto max-w-3xl px-6 pb-16 pt-24">
          <div className="rounded-xl bg-white p-8 text-center shadow">Loading...</div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!session || session.user.role !== 'BUSINESS') {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationBar />
        <main className="container mx-auto max-w-3xl px-6 pb-16 pt-24">
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-700">{text.unauthorized}</div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />

      <main className="container mx-auto max-w-3xl px-6 pb-12 pt-24">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h1 className="text-2xl font-bold text-slate-900">{text.title}</h1>
          <p className="mt-2 text-sm text-slate-600">{text.subtitle}</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">{text.logo}</p>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                  {formData.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={formData.logoUrl} alt={formData.companyName || 'Logo'} className="h-full w-full object-contain" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center px-1 text-center text-[10px] text-slate-400">
                      {text.noLogo}
                    </div>
                  )}
                </div>
                <label className="inline-flex cursor-pointer items-center rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                  {uploadingLogo ? text.uploadingLogo : text.uploadLogo}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingLogo || saving}
                    className="hidden"
                    onChange={(event) => {
                      const selected = event.target.files?.[0] || null
                      void handleLogoChange(selected)
                      event.currentTarget.value = ''
                    }}
                  />
                </label>
              </div>
            </div>

            <input
              required
              value={formData.companyName}
              onChange={(event) => setFormData((prev) => ({ ...prev, companyName: event.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
              placeholder={text.companyName}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                value={formData.website}
                onChange={(event) => setFormData((prev) => ({ ...prev, website: event.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                placeholder={text.website}
              />
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(event) => setFormData((prev) => ({ ...prev, contactEmail: event.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                placeholder={text.contactEmail}
              />
              <input
                value={formData.phone}
                onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                placeholder={text.phone}
              />
              <input
                value={formData.province}
                onChange={(event) => setFormData((prev) => ({ ...prev, province: event.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                placeholder={text.province}
              />
            </div>

            <textarea
              value={formData.description}
              onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
              className="min-h-28 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
              placeholder={text.description}
            />

            {error && <p className="text-sm text-rose-600">{error}</p>}
            {success && <p className="text-sm text-emerald-600">{success}</p>}

            <Button type="submit" disabled={saving} className="rounded-lg bg-emerald-600 px-5 hover:bg-emerald-700">
              {saving ? text.saving : text.save}
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
