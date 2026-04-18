'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { BarChart3, FileCheck2, FileText, FolderTree, Plus, Tags, Users } from 'lucide-react'
import NavigationBar from '@/components/NavigationBar'
import { ContentTable } from '@/components/admin/ContentTable'
import { ContentForm } from '@/components/admin/ContentForm'
import { AiNewsPanel } from '@/components/admin/AiNewsPanel'
import { HomeStatsManager } from '@/components/admin/HomeStatsManager'
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
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1
  })
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    totalViews: 0
  })

  const { categories, categoryLabels, loadCategories, upsertCategory } = useAdminCategories(
    status !== 'loading' && !!session && (session.user.role === 'ADMIN' || session.user.role === 'MODERATOR')
  )

  const loadContents = useCallback(async (nextPage = page, nextLimit = limit) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/content?page=${nextPage}&limit=${nextLimit}`)
      if (response.ok) {
        const data = await response.json()
        const contentList = Array.isArray(data) ? data : data.contents || []
        setContents(contentList)
        setPagination(data.pagination || {
          page: nextPage,
          limit: nextLimit,
          total: contentList.length,
          pages: 1
        })
        setStats(data.stats || {
          total: contentList.length,
          published: contentList.filter((content: AdminContent) => content.status === 'PUBLISHED').length,
          draft: contentList.filter((content: AdminContent) => content.status === 'DRAFT').length,
          totalViews: contentList.reduce((sum: number, content: AdminContent) => sum + (content.viewCount || 0), 0)
        })
      } else {
        setContents([])
      }
    } catch (error) {
      console.error('Error loading contents:', error)
      setContents([])
    } finally {
      setLoading(false)
    }
  }, [page, limit])

  const handleLimitChange = (nextLimit: number) => {
    setLimit(nextLimit)
    setPage(1)
  }

  useEffect(() => {
    if (status === 'loading') return

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MODERATOR')) {
      router.push('/auth/signin')
      return
    }

    loadContents()
  }, [session, status, router, loadContents])

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
        <NavigationBar />
        <div className="container mx-auto px-4 pb-12 pt-24">
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
      <NavigationBar />

      <div className="container mx-auto px-4 pb-8 pt-24 md:pb-10">
        <section className="mb-8 overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-xl">
          <div>
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

        {session.user.role === 'ADMIN' && (
          <section className="mb-8">
            <HomeStatsManager />
          </section>
        )}

        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900">Danh sách nội dung</h2>
            <p className="mt-1 text-sm text-slate-600">Quản lý chỉnh sửa, xuất bản và thao tác hàng loạt.</p>
          </div>
          <div className="mb-4 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4">
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
                Quản lý người dùng (cá nhân, doanh nghiệp)
              </Link>
            )}
            {session.user.role === 'ADMIN' && (
              <Link
                href="/admin/partners"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <Users className="mr-2 h-4 w-4" />
                Quản lý đối tác
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
          <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-600">
              Hiển thị {contents.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}
              {' - '}
              {Math.min(pagination.page * pagination.limit, pagination.total)}
              {' / '}
              {pagination.total} nội dung
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                Số dòng
                <select
                  value={limit}
                  onChange={(event) => handleLimitChange(Number(event.target.value))}
                  className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </label>
              <Button
                type="button"
                variant="secondary"
                disabled={pagination.page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                Trước
              </Button>
              <span className="text-sm text-slate-600">
                Trang {pagination.page} / {pagination.pages}
              </span>
              <Button
                type="button"
                variant="secondary"
                disabled={pagination.page >= pagination.pages}
                onClick={() => setPage((current) => Math.min(pagination.pages, current + 1))}
              >
                Sau
              </Button>
            </div>
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
