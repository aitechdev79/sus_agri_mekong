'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import NavigationBar from '@/components/NavigationBar'
import Footer from '@/components/Footer'
import { getLocaleFromPathname, withLocalePrefix } from '@/lib/content-locale'

export default function WelcomePage() {
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname)
  const isEn = locale === 'en'

  const homeHref = withLocalePrefix('/', locale)
  const signInHref = withLocalePrefix('/auth/signin', locale)

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50">
      <NavigationBar />

      <main className="pt-24">
        <section className="container mx-auto max-w-6xl px-6 py-10">
          <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-xl md:p-8">
            <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-start">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                  {isEn ? 'Welcome to the platform' : 'Chào mừng bạn đến với nền tảng'}
                </h1>
                <p className="mt-3 text-sm text-slate-600 md:text-base">
                  {isEn
                    ? 'Here are the key things you can do right away.'
                    : 'Dưới đây là các nội dung chính bạn có thể bắt đầu ngay.'}
                </p>

                <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700 md:text-base">
                  <li>
                    {isEn
                      ? 'Explore practical resources: policy updates, good practices, stories, and events.'
                      : 'Khám phá tài liệu, chính sách, điển hình, câu chuyện thành công và sự kiện về phát triển bền vững do nền tảng tổ chức.'}
                  </li>
                  <li>
                    {isEn
                      ? 'Receive platform emails for onboarding guidance and new content updates.'
                      : 'Nhận email từ nền tảng để cập nhật nội dung mới.'}
                  </li>
                  <li>
                    {isEn
                      ? 'Business accounts will receive business networking updates and access to business-oriented platform tools.'
                      : 'Tài khoản doanh nghiệp sẽ nhận thêm thông tin kết nối kinh doanh và tiếp cận các công cụ kinh doanh của nền tảng.'}
                  </li>
                </ul>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={signInHref}
                    className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    {isEn ? 'Sign in now' : 'Đăng nhập ngay'}
                  </Link>
                  <Link
                    href={homeHref}
                    className="inline-flex items-center justify-center rounded-xl border border-sky-300 px-4 py-2.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
                  >
                    {isEn ? 'Back to homepage' : 'Quay về trang chủ'}
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                <div className="relative h-64 w-full overflow-hidden rounded-xl md:h-[22rem]">
                  <Image
                    src="/art_members.png"
                    alt={isEn ? 'Platform illustration' : 'Minh hoạ nền tảng'}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
