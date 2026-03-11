'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { PartnerManager } from '@/components/admin/PartnerManager'

export default function AdminPartnersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user.role !== 'ADMIN') {
      router.push('/auth/signin')
    }
  }, [router, session, status])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header currentPath="/admin/partners" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex h-64 items-center justify-center">
            <div className="h-24 w-24 animate-spin rounded-full border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPath="/admin/partners" />
      <div className="container mx-auto px-4 py-8">
        <PartnerManager />
      </div>
    </div>
  )
}

