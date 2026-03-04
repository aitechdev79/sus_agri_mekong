'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ContentTable } from '@/components/admin/ContentTable'
import { ContentForm } from '@/components/admin/ContentForm'
import { Plus, Tags } from 'lucide-react'
import { AdminContent } from '@/types/content'
import { useAdminCategories } from '@/hooks/use-admin-categories'

interface Stats {
  totalContent: number
  totalViews: number
  published: number
  draft: number
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const locale = useLocale()
  const [stats, setStats] = useState<Stats>({
    totalContent: 0,
    totalViews: 0,
    published: 0,
    draft: 0
  })
  const [showForm, setShowForm] = useState(false)
  const [editingContent, setEditingContent] = useState<AdminContent | null>(null)
  const [contents, setContents] = useState<AdminContent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { categories, categoryLabels, loadCategories, upsertCategory } = useAdminCategories(
    status !== 'loading' && !!session && (session.user.role === 'ADMIN' || session.user.role === 'MODERATOR')
  )

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push(`/${locale}/auth/signin`)
      return
    }

    if (session && session.user?.role !== 'ADMIN' && session.user?.role !== 'MODERATOR') {
      router.push(`/${locale}`)
      return
    }

    fetchAdminData()
  }, [session, status, router, locale])

  const fetchAdminData = async () => {
    try {
      const response = await fetch('/api/admin/content')
      if (!response.ok) {
        throw new Error('Failed to fetch admin content')
      }

      const contentData = await response.json()
      const nextContents = Array.isArray(contentData) ? contentData : contentData.contents || []

      setContents(nextContents)
      setStats({
        totalContent: nextContents.length,
        totalViews: nextContents.reduce((sum: number, item: AdminContent) => sum + item.viewCount, 0),
        published: nextContents.filter((item: AdminContent) => item.status === 'PUBLISHED').length,
        draft: nextContents.filter((item: AdminContent) => item.status === 'DRAFT').length
      })
    } catch (error) {
      console.error('Error fetching admin data:', error)
      setContents([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateContent = () => {
    setEditingContent(null)
    setShowForm(true)
  }

  const handleEditContent = (content: AdminContent) => {
    setEditingContent(content)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingContent(null)
    fetchAdminData()
    loadCategories()
  }

  const handleDeleteContent = async (content: AdminContent) => {
    if (!confirm('Ban co chac chan muon xoa noi dung nay?')) {
      return
    }

    try {
      const response = await fetch(`/api/content/${content.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchAdminData()
      } else {
        alert('Khong the xoa noi dung')
      }
    } catch (error) {
      console.error('Error deleting content:', error)
      alert('Da xay ra loi khi xoa noi dung')
    }
  }

  const handleBulkAction = async (action: string, ids: string[]) => {
    try {
      const response = await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids, action })
      })

      if (response.ok) {
        fetchAdminData()
      } else {
        const error = await response.json()
        alert(error.error || 'Khong the thuc hien hanh dong')
      }
    } catch (error) {
      console.error('Error with bulk action:', error)
      alert('Da xay ra loi')
    }
  }

  if (status === 'loading' || isLoading) {
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

  if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'MODERATOR')) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-6">
          <div className="mb-8 flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-2 text-sm text-gray-600">
                Tong {stats.totalContent} noi dung, {stats.published} da xuat ban, {stats.draft} ban nhap.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {session.user.role === 'ADMIN' && (
                <Link
                  href={`/${locale}/admin/categories`}
                  className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Tags className="mr-2 h-4 w-4" />
                  Quan ly danh muc
                </Link>
              )}
              <button
                onClick={handleCreateContent}
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Them noi dung
              </button>
            </div>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="text-sm text-gray-500">Tong noi dung</div>
              <div className="mt-2 text-3xl font-bold text-gray-900">{stats.totalContent}</div>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="text-sm text-gray-500">Luot xem</div>
              <div className="mt-2 text-3xl font-bold text-gray-900">{stats.totalViews.toLocaleString('vi-VN')}</div>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="text-sm text-gray-500">Danh muc dang dung</div>
              <div className="mt-2 text-3xl font-bold text-gray-900">{categories.filter((item) => item.isActive).length}</div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <ContentTable
              contents={contents}
              onEdit={handleEditContent}
              onDelete={handleDeleteContent}
              onBulkAction={handleBulkAction}
              userRole={session.user.role}
              categoryLabels={categoryLabels}
            />
          </div>
        </div>
      </main>

      <Footer />

      {showForm && (
        <ContentForm
          content={editingContent}
          onClose={handleFormClose}
          userRole={session.user.role}
          categories={categories}
          onCategoryCreated={upsertCategory}
        />
      )}
    </div>
  )
}
