'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import NavigationBar from '@/components/NavigationBar'
import { CategoryManager } from '@/components/admin/CategoryManager'
import { useAdminCategories } from '@/hooks/use-admin-categories'

export default function AdminCategoriesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { categories, setCategories } = useAdminCategories(status !== 'loading' && !!session && session.user.role === 'ADMIN')

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user.role !== 'ADMIN') {
      router.push('/auth/signin')
    }
  }, [router, session, status])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationBar />
        <div className="container mx-auto px-4 pb-8 pt-24">
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
      <NavigationBar />
      <div className="container mx-auto px-4 pb-8 pt-24">
        <div className="mb-6">
          <Link href="/admin" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lai dashboard
          </Link>
        </div>

        <CategoryManager categories={categories} onCategoriesChange={setCategories} />
      </div>
    </div>
  )
}
