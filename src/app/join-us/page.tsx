'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Handshake, Network, BookOpen } from 'lucide-react'
import NavigationBar from '@/components/NavigationBar'
import Footer from '@/components/Footer'
import { getLocaleFromPathname, withLocalePrefix } from '@/lib/content-locale'

interface PartnerItem {
  id: string
  companyName: string
  logoUrl: string | null
  website: string | null
}

const FALLBACK_PARTNERS: PartnerItem[] = [
  { id: 'vinamilk', companyName: 'Vinamilk', logoUrl: '/Logo_Vinamilk_(2023).png', website: null },
  { id: 'john-deere', companyName: 'John Deere', logoUrl: '/John_Deere_logo.svg.png', website: null },
  { id: 'loctroi', companyName: 'Loc Troi', logoUrl: '/06-loctroi.png', website: null },
  { id: 'binhdien', companyName: 'Binh Dien', logoUrl: '/03-binhdien.jpg', website: null },
  { id: 'cp', companyName: 'CP', logoUrl: '/02-CP.jpg', website: null },
]

export default function JoinUsPage() {
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname)
  const isEn = locale === 'en'
  const signUpBusinessHref = `${withLocalePrefix('/auth/signup', locale)}?role=business`
  const [partners, setPartners] = useState<PartnerItem[]>([])
  const [loadingPartners, setLoadingPartners] = useState(true)

  useEffect(() => {
    const loadPartners = async () => {
      try {
        setLoadingPartners(true)
        const response = await fetch('/api/partners?all=1')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load partners')
        }

        const list = Array.isArray(data.partners) ? data.partners : []
        setPartners(
          list
            .filter((item: PartnerItem) => item.logoUrl)
            .map((item: PartnerItem) => ({
              id: item.id,
              companyName: item.companyName,
              logoUrl: item.logoUrl,
              website: item.website ?? null,
            })),
        )
      } catch (error) {
        console.error('Join-us partners fetch error:', error)
        setPartners([])
      } finally {
        setLoadingPartners(false)
      }
    }

    void loadPartners()
  }, [])

  const displayPartners = useMemo(() => {
    if (partners.length > 0) return partners
    return FALLBACK_PARTNERS
  }, [partners])

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50 font-montserrat">
      <NavigationBar />

      <main className="pt-24">
        <section className="container mx-auto max-w-5xl px-6 py-10 pb-16">
          <div className="overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-xl">
            <div className="grid gap-0 md:grid-cols-[1.1fr_1fr]">
              <div className="px-7 py-9 md:px-10 md:py-12">
                <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                  {isEn ? 'Join the Partner Network' : 'Tham gia mạng lưới đối tác'}
                </h1>

                <p className="mt-5 text-base leading-relaxed text-slate-700">
                  {isEn
                    ? 'Become a member of our collaboration network to advance business goals in innovation and sustainable development. We connect industry leaders to create positive solutions for Vietnam’s agricultural community.'
                    : 'Trở thành thành viên của mạng lưới hợp tác để thúc đẩy các mục tiêu kinh doanh trong lĩnh vực đổi mới và phát triển bền vững. Chúng tôi kết nối các nhà lãnh đạo ngành để tạo ra những giải pháp tích cực cho cộng đồng nông nghiệp Việt Nam.'}
                </p>
                <p className="mt-4 text-base leading-relaxed text-slate-700">
                  {isEn
                    ? 'By joining this global initiative, you can collaborate with leading organizations, share knowledge, and help build a more sustainable agricultural value chain.'
                    : 'Bằng cách tham gia vào sáng kiến toàn cầu này, bạn sẽ có cơ hội hợp tác với các tổ chức hàng đầu, chia sẻ kiến thức và cùng nhau xây dựng một chuỗi cung ứng nông nghiệp bền vững.'}
                </p>
              </div>

              <div className="relative min-h-72">
                <Image
                  src="/hero_members.jpg"
                  alt={isEn ? 'Join the collaboration network' : 'Tham gia mạng lưới hợp tác'}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="grid gap-4 bg-slate-50 px-7 py-7 md:grid-cols-3 md:px-10 md:py-8">
              <article className="rounded-2xl p-6">
                <div className="mb-3 inline-flex rounded-lg bg-amber-100 p-2 text-amber-700">
                  <Network className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">{isEn ? 'Connect' : 'Kết nối'}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {isEn
                    ? 'Connect with leading businesses and experts in the industry.'
                    : 'Kết nối với các doanh nghiệp và chuyên gia hàng đầu trong ngành.'}
                </p>
              </article>

              <article className="rounded-2xl p-6">
                <div className="mb-3 inline-flex rounded-lg bg-amber-100 p-2 text-amber-700">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">{isEn ? 'Share' : 'Chia sẻ'}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {isEn
                    ? 'Access research, reports, and best-practice toolkits.'
                    : 'Tiếp cận các nghiên cứu, báo cáo và công cụ thực hành tốt nhất.'}
                </p>
              </article>

              <article className="rounded-2xl p-6">
                <div className="mb-3 inline-flex rounded-lg bg-amber-100 p-2 text-amber-700">
                  <Handshake className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">{isEn ? 'Collaborate' : 'Hợp tác'}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {isEn
                    ? 'Join collaborative projects and sustainable development initiatives.'
                    : 'Tham gia các dự án hợp tác và sáng kiến phát triển bền vững.'}
                </p>
              </article>
            </div>

            <div className="px-7 py-8 text-center md:px-10">
              <Link
                href={signUpBusinessHref}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                {isEn ? 'Register business account' : 'Đăng ký doanh nghiệp'}
              </Link>
            </div>

            <div className="border-t border-slate-200 bg-vn-rice-white px-7 py-8 md:px-10">
              <h3 className="mb-5 text-center text-lg font-semibold text-slate-900">
                {isEn ? 'Platform Partners' : 'Đối tác của nền tảng'}
              </h3>

              {loadingPartners && partners.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white px-6 py-8 text-center text-sm text-gray-500">
                  {isEn ? 'Loading partners...' : 'Đang tải đối tác...'}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {displayPartners.map((partner) => (
                    <div
                      key={partner.id}
                      className="flex items-center justify-center rounded-lg bg-white p-4 transition-all duration-300 hover:scale-105"
                      style={{ border: '1px solid rgba(0, 0, 0, 0.1)', minHeight: '92px' }}
                    >
                      <div className="relative flex h-14 w-full items-center justify-center">
                        <Image
                          src={partner.logoUrl || '/Logo_Vinamilk_(2023).png'}
                          alt={partner.companyName}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
