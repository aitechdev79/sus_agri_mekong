'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { BarChart3, FileCheck2, FileText, FolderTree, Plus, Tags, Users } from 'lucide-react'
import NavigationBar from '@/components/NavigationBar'
import Footer from '@/components/Footer'
import { ContentTable } from '@/components/admin/ContentTable'
import { ContentForm } from '@/components/admin/ContentForm'
import { AiNewsPanel } from '@/components/admin/AiNewsPanel'
import { Button } from '@/components/ui/button'
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
    if (!confirm('Bạn có chắc chắn muốn xóa nội dung này?')) {
      return
    }

    try {
      const response = await fetch(`/api/content/${content.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchAdminData()
      } else {
        alert('Không thể xóa nội dung')
      }
    } catch (error) {
      console.error('Error deleting content:', error)
      alert('Đã xảy ra lỗi khi xóa nội dung')
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
        alert(error.error || 'Không thể thực hiện hành động')
      }
    } catch (error) {
      console.error('Error with bulk action:', error)
      alert('Đã xảy ra lỗi')
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 via-white to-emerald-50">
        <NavigationBar />
        <main className="flex flex-grow items-center justify-center">
          <div className="h-24 w-24 animate-spin rounded-full border-b-2 border-sky-600"></div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'MODERATOR')) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 via-white to-emerald-50">
      <NavigationBar />

      <main className="flex-grow pb-8 pt-24 md:pb-10">
        <div className="container mx-auto px-6">
          <section className="mb-8 overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-xl">
            <div className="grid md:grid-cols-[1.2fr_1fr]">
              <div className="bg-sky-700 px-6 py-8 text-sky-50 md:px-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="mt-3 max-w-xl text-sm text-sky-100">
                  Quản lý toàn bộ nội dung, danh mục và người dùng trên cùng một không gian làm việc.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-white/15 px-3 py-2">
                    <div className="text-xs uppercase tracking-wide text-sky-100">Tổng nội dung</div>
                    <div className="mt-1 text-xl font-semibold">{stats.totalContent}</div>
                  </div>
                  <div className="rounded-xl bg-white/15 px-3 py-2">
                    <div className="text-xs uppercase tracking-wide text-sky-100">Đã xuất bản</div>
                    <div className="mt-1 text-xl font-semibold">{stats.published}</div>
                  </div>
                  <div className="rounded-xl bg-white/15 px-3 py-2">
                    <div className="text-xs uppercase tracking-wide text-sky-100">Bản nháp</div>
                    <div className="mt-1 text-xl font-semibold">{stats.draft}</div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 bg-white p-6 md:p-8">
                <Button onClick={handleCreateContent} className="h-11 justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm nội dung
                </Button>
                {session.user.role === 'ADMIN' && (
                  <Link
                    href={`/${locale}/admin/users`}
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Quản lý người dùng
                  </Link>
                )}
                {session.user.role === 'ADMIN' && (
                  <Link
                    href={`/${locale}/admin/categories`}
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    <Tags className="mr-2 h-4 w-4" />
                    Quản lý danh mục
                  </Link>
                )}
                {session.user.role === 'ADMIN' && (
                  <Link
                    href={`/${locale}/admin/partners`}
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Quản lý đối tác
                  </Link>
                )}
              </div>
            </div>
          </section>

          <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-2 inline-flex rounded-lg bg-sky-100 p-2 text-sky-700">
                <FileText className="h-4 w-4" />
              </div>
              <div className="text-sm text-slate-500">Tổng nội dung</div>
              <div className="mt-1 text-3xl font-bold text-slate-900">{stats.totalContent}</div>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-2 inline-flex rounded-lg bg-emerald-100 p-2 text-emerald-700">
                <FileCheck2 className="h-4 w-4" />
              </div>
              <div className="text-sm text-slate-500">Đã xuất bản</div>
              <div className="mt-1 text-3xl font-bold text-slate-900">{stats.published}</div>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-2 inline-flex rounded-lg bg-amber-100 p-2 text-amber-700">
                <FolderTree className="h-4 w-4" />
              </div>
              <div className="text-sm text-slate-500">Danh mục đang dùng</div>
              <div className="mt-1 text-3xl font-bold text-slate-900">{categories.filter((item) => item.isActive).length}</div>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-2 inline-flex rounded-lg bg-violet-100 p-2 text-violet-700">
                <BarChart3 className="h-4 w-4" />
              </div>
              <div className="text-sm text-slate-500">Tổng lượt xem</div>
              <div className="mt-1 text-3xl font-bold text-slate-900">{stats.totalViews.toLocaleString('vi-VN')}</div>
            </article>
          </section>

          <section className="mb-8">
            <AiNewsPanel />
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Danh sách nội dung</h2>
              <p className="mt-1 text-sm text-slate-600">Quản lý chỉnh sửa, xuất bản và thao tác hàng loạt.</p>
            </div>
            <ContentTable
              contents={contents}
              onEdit={handleEditContent}
              onDelete={handleDeleteContent}
              onBulkAction={handleBulkAction}
              userRole={session.user.role}
              categoryLabels={categoryLabels}
            />
          </section>
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
