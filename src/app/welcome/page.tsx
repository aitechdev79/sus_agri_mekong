'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Bot, Mail, Sparkles } from 'lucide-react'
import NavigationBar from '@/components/NavigationBar'
import Footer from '@/components/Footer'
import { getLocaleFromPathname, withLocalePrefix } from '@/lib/content-locale'

type AccountRole = 'USER' | 'BUSINESS'

export default function WelcomePage() {
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname)
  const isEn = locale === 'en'
  const [role, setRole] = useState<AccountRole>('USER')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const roleParam = new URLSearchParams(window.location.search).get('role')?.toLowerCase()
    if (roleParam === 'business') {
      setRole('BUSINESS')
    }
  }, [])

  const homeHref = withLocalePrefix('/', locale)
  const signInHref = withLocalePrefix('/auth/signin', locale)
  const joinUsHref = withLocalePrefix('/join-us', locale)

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50">
      <NavigationBar />

      <main className="pt-24">
        <section className="container mx-auto max-w-6xl px-6 py-10">
          <div className="overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-xl">
            <div className="grid gap-0 md:grid-cols-[1.1fr_1fr]">
              <div className="bg-sky-700 px-7 py-9 text-sky-50 md:px-10 md:py-12">
                <p className="mb-3 inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                  {isEn ? 'Welcome' : 'Chào mừng'}
                </p>
                <h1 className="text-3xl font-bold leading-tight md:text-4xl">
                  {isEn ? 'Your account is ready.' : 'Tài khoản của bạn đã được tạo thành công.'}
                </h1>
                <p className="mt-4 text-sm text-sky-100 md:text-base">
                  {isEn
                    ? 'This page helps all new accounts quickly understand key platform features, documents, and update channels.'
                    : 'Trang này giúp mọi tài khoản mới nắm nhanh các chức năng chính, tài liệu và kênh cập nhật của nền tảng.'}
                </p>
              </div>

              <div className="space-y-3 bg-white px-7 py-9 md:px-10 md:py-12">
                <h2 className="text-lg font-semibold text-slate-900">{isEn ? 'Quick start' : 'Bắt đầu nhanh'}</h2>
                <div className="grid gap-3">
                  <Link
                    href={signInHref}
                    className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    {isEn ? 'Sign in now' : 'Đăng nhập ngay'}
                  </Link>
                  {role === 'BUSINESS' && (
                    <Link
                      href={joinUsHref}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      {isEn ? 'Complete business profile' : 'Hoàn thiện hồ sơ doanh nghiệp'}
                    </Link>
                  )}
                  <Link
                    href={homeHref}
                    className="inline-flex items-center justify-center rounded-xl border border-sky-300 px-4 py-2.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
                  >
                    {isEn ? 'Back to homepage' : 'Quay về trang chủ'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-6xl px-6 pb-16">
          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-3 inline-flex rounded-lg bg-sky-100 p-2 text-sky-700">
                <BookOpen className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{isEn ? 'Resources on platform' : 'Tài liệu trên nền tảng'}</h3>
              <p className="mt-2 text-sm text-slate-600">
                {isEn
                  ? 'Browse practical content: policy updates, success stories, news, and references for sustainable development.'
                  : 'Khám phá nội dung thực tiễn: chính sách, điển hình, tin tức và tài liệu tham khảo cho phát triển bền vững.'}
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-3 inline-flex rounded-lg bg-emerald-100 p-2 text-emerald-700">
                <Mail className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{isEn ? 'Email from platform' : 'Nhận email từ nền tảng'}</h3>
              <p className="mt-2 text-sm text-slate-600">
                {isEn
                  ? 'You may receive onboarding and update emails. Please check spam/junk and whitelist platform emails.'
                  : 'Bạn có thể nhận email hướng dẫn và cập nhật mới. Vui lòng kiểm tra cả spam/junk và whitelist email từ nền tảng.'}
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2">
              <div className="mb-3 inline-flex rounded-lg bg-violet-100 p-2 text-violet-700">
                <Bot className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{isEn ? 'Advanced features (in design)' : 'Tính năng cao cấp (đang thiết kế)'}</h3>
              <p className="mt-2 text-sm text-slate-600">
                {isEn
                  ? 'Upcoming features include AI content finder/summarizer, personalized dashboard, topic-based alerts, and deeper business collaboration workflows.'
                  : 'Sắp tới sẽ có các tính năng nâng cao như AI tìm kiếm/tóm tắt nội dung, dashboard cá nhân hoá, cảnh báo theo chủ đề, và luồng cộng tác chuyên sâu cho doanh nghiệp.'}
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2">
              <div className="mb-3 inline-flex rounded-lg bg-amber-100 p-2 text-amber-700">
                <Sparkles className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                {isEn ? 'For business accounts' : 'Dành cho tài khoản doanh nghiệp'}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {isEn
                  ? 'Business accounts will receive updates on business networking opportunities and access to business-oriented tools provided by the platform.'
                  : 'Tài khoản doanh nghiệp sẽ nhận thêm thông tin về kết nối kinh doanh và được ưu tiên tiếp cận các công cụ phục vụ hoạt động kinh doanh trên nền tảng.'}
              </p>
            </article>
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            {isEn ? 'Thank you for joining. We are glad to have you with us.' : 'Cảm ơn bạn đã tham gia cùng nền tảng.'}
          </p>
        </section>
      </main>

      <Footer />
    </div>
  )
}
