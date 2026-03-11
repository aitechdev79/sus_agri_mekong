'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Handshake, Network, BookOpen } from 'lucide-react'
import NavigationBar from '@/components/NavigationBar'
import Footer from '@/components/Footer'
import { getLocaleFromPathname, withLocalePrefix } from '@/lib/content-locale'

export default function JoinUsPage() {
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname)
  const signUpBusinessHref = `${withLocalePrefix('/auth/signup', locale)}?role=business`

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50">
      <NavigationBar />

      <main className="pt-24">
        <section className="container mx-auto max-w-5xl px-6 py-10 pb-16">
          <div className="overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-xl">
            <div className="grid gap-0 md:grid-cols-[1.1fr_1fr]">
              <div className="px-7 py-9 md:px-10 md:py-12">
                <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                  Tham gia Mạng lưới Hợp tác của Chúng tôi
                </h1>

                <p className="mt-5 text-base leading-relaxed text-slate-700">
                  Trở thành thành viên của mạng lưới hợp tác để thúc đẩy các mục tiêu kinh doanh trong lĩnh vực đổi mới và phát triển bền vững. Chúng tôi kết nối các nhà lãnh đạo ngành để tạo ra những giải pháp tích cực cho cộng đồng nông nghiệp Việt Nam.
                </p>
                <p className="mt-4 text-base leading-relaxed text-slate-700">
                  Bằng cách tham gia vào sáng kiến toàn cầu này, bạn sẽ có cơ hội hợp tác với các tổ chức hàng đầu, chia sẻ kiến thức và cùng nhau xây dựng một chuỗi cung ứng nông nghiệp bền vững.
                </p>
              </div>

              <div className="relative min-h-72">
                <Image src="/hero_members.jpg" alt="Tham gia mạng lưới hợp tác" fill className="object-cover" />
              </div>
            </div>

            <div className="grid gap-4 bg-slate-50 px-7 py-7 md:grid-cols-3 md:px-10 md:py-8">
              <article className="rounded-2xl p-6">
                <div className="mb-3 inline-flex rounded-lg bg-amber-100 p-2 text-amber-700">
                  <Network className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Mạng lưới Kết nối</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Kết nối với các doanh nghiệp và chuyên gia hàng đầu trong ngành.
                </p>
              </article>

              <article className="rounded-2xl p-6">
                <div className="mb-3 inline-flex rounded-lg bg-amber-100 p-2 text-amber-700">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Chia sẻ Kiến thức</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Tiếp cận các nghiên cứu, báo cáo và công cụ thực hành tốt nhất.
                </p>
              </article>

              <article className="rounded-2xl p-6">
                <div className="mb-3 inline-flex rounded-lg bg-amber-100 p-2 text-amber-700">
                  <Handshake className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Cơ hội Hợp tác</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Tham gia các dự án hợp tác và sáng kiến phát triển bền vững.
                </p>
              </article>
            </div>

            <div className="px-7 py-8 text-center md:px-10">
              <p className="mb-4 text-sm text-emerald-800">Sẵn sàng tham gia với vai trò doanh nghiệp?</p>
              <Link
                href={signUpBusinessHref}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Đăng ký doanh nghiệp
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
