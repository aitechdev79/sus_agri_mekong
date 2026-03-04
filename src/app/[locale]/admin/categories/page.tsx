'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { ArrowLeft } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CategoryManager } from '@/components/admin/CategoryManager'
import { useAdminCategories } from '@/hooks/use-admin-categories'

export default function LocalizedAdminCategoriesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const locale = useLocale()
  const { categories, setCategories } = useAdminCategories(status !== 'loading' && !!session && session.user.role === 'ADMIN')

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user.role !== 'ADMIN') {
      router.push(`/${locale}/auth/signin`)
    }
  }, [locale, router, session, status])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex flex-grow items-center justify-center">
          <div className="h-24 w-24 animate-spin rounded-full border-b-2 border-blue-600"></div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-6">
          <div className="mb-6">
            <Link
              href={`/${locale}/admin`}
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lai dashboard
            </Link>
          </div>

          <CategoryManager categories={categories} onCategoriesChange={setCategories} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
