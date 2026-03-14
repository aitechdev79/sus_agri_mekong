'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import NavigationBar from '@/components/NavigationBar'
import Footer from '@/components/Footer'
import { UserManager } from '@/components/admin/UserManager'

export default function LocalizedAdminUsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const locale = useLocale()

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push(`/${locale}/auth/signin`)
      return
    }

    if (session && session.user.role !== 'ADMIN') {
      router.push(`/${locale}`)
    }
  }, [locale, router, session, status])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col">
        <NavigationBar />
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavigationBar />
      <main className="flex-grow pb-8 pt-24">
        <div className="container mx-auto px-6">
          <UserManager backHref={`/${locale}/admin`} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
