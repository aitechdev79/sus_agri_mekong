'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { BarChart3, FileCheck2, FileText, FolderTree, Plus, Tags, Users } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { ContentTable } from '@/components/admin/ContentTable'
import { ContentForm } from '@/components/admin/ContentForm'
import { AiNewsPanel } from '@/components/admin/AiNewsPanel'
import { Button } from '@/components/ui/button'
import { AdminContent } from '@/types/content'
import { useAdminCategories } from '@/hooks/use-admin-categories'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [editingContent, setEditingContent] = useState<AdminContent | null>(null)
  const [contents, setContents] = useState<AdminContent[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    totalViews: 0
  })

  const { categories, categoryLabels, loadCategories, upsertCategory } = useAdminCategories(
    status !== 'loading' && !!session && (session.user.role === 'ADMIN' || session.user.role === 'MODERATOR')
  )

  useEffect(() => {
    if (status === 'loading') return

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MODERATOR')) {
      router.push('/auth/signin')
      return
    }

    loadContents()
  }, [session, status, router])

  const loadContents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/content')
      if (response.ok) {
        const data = await response.json()
        const contentList = Array.isArray(data) ? data : data.contents || []
        setContents(contentList)

        const total = contentList.length
        const published = contentList.filter((content: AdminContent) => content.status === 'PUBLISHED').length
        const draft = contentList.filter((content: AdminContent) => content.status === 'DRAFT').length
        const totalViews = contentList.reduce((sum: number, content: AdminContent) => sum + (content.viewCount || 0), 0)

        setStats({ total, published, draft, totalViews })
      } else {
        setContents([])
      }
    } catch (error) {
      console.error('Error loading contents:', error)
      setContents([])
    } finally {
      setLoading(false)
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
    loadContents()
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
        loadContents()
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
        loadContents()
      } else {
        const error = await response.json()
        alert(error.error || 'Không thể thực hiện hành động')
      }
    } catch (error) {
      console.error('Error with bulk action:', error)
      alert('Đã xảy ra lỗi')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50">
        <Header currentPath="/admin" />
        <div className="container mx-auto px-4 py-12">
          <div className="flex h-64 items-center justify-center">
            <div className="h-24 w-24 animate-spin rounded-full border-b-2 border-sky-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MODERATOR')) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50">
      <Header currentPath="/admin" />

      <div className="container mx-auto px-4 py-8 md:py-10">
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
                  <div className="mt-1 text-xl font-semibold">{stats.total}</div>
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
                  href="/admin/users"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Quản lý người dùng
                </Link>
              )}
              {session.user.role === 'ADMIN' && (
                <Link
                  href="/admin/categories"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <Tags className="mr-2 h-4 w-4" />
                  Quản lý danh mục
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
            <div className="mt-1 text-3xl font-bold text-slate-900">{stats.total}</div>
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
    </div>
  )
}
