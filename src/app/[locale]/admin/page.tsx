'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { BarChart3, Building2, FileCheck2, FileText, FolderTree, Plus, Tags, Users } from 'lucide-react'
import NavigationBar from '@/components/NavigationBar'
import Footer from '@/components/Footer'
import { ContentTable } from '@/components/admin/ContentTable'
import { ContentForm } from '@/components/admin/ContentForm'
import { AiNewsPanel } from '@/components/admin/AiNewsPanel'
import { HomeStatsManager } from '@/components/admin/HomeStatsManager'
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
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1
  })
  const [managementStats, setManagementStats] = useState({
    totalUsers: 0,
    personalUsers: 0,
    businessUsers: 0,
    verifiedUsers: 0,
    totalPartners: 0,
    publicPartners: 0,
    verifiedPartners: 0,
    pendingPartners: 0
  })
  const { categories, categoryLabels, loadCategories, upsertCategory } = useAdminCategories(
    status !== 'loading' && !!session && (session.user.role === 'ADMIN' || session.user.role === 'MODERATOR')
  )

  const fetchAdminData = useCallback(async (nextPage = page, nextLimit = limit) => {
    try {
      const response = await fetch(`/api/admin/content?page=${nextPage}&limit=${nextLimit}`)
      if (!response.ok) {
        throw new Error('Failed to fetch admin content')
      }

      const contentData = await response.json()
      const nextContents = Array.isArray(contentData) ? contentData : contentData.contents || []
      setContents(nextContents)
      setPagination(contentData.pagination || {
        page: nextPage,
        limit: nextLimit,
        total: nextContents.length,
        pages: 1
      })
      setStats(contentData.stats ? {
        totalContent: contentData.stats.total,
        totalViews: contentData.stats.totalViews,
        published: contentData.stats.published,
        draft: contentData.stats.draft
      } : {
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
  }, [page, limit])

  const fetchManagementStats = useCallback(async () => {
    try {
      const [usersResponse, partnersResponse] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/partners')
      ])

      if (!usersResponse.ok || !partnersResponse.ok) {
        return
      }

      const [usersData, partnersData] = await Promise.all([
        usersResponse.json(),
        partnersResponse.json()
      ])
      const users: Array<{ role?: string; isVerified?: boolean }> = Array.isArray(usersData.users) ? usersData.users : []
      const partners: Array<{ status?: string; isPublic?: boolean; isVerified?: boolean }> = Array.isArray(partnersData.partners) ? partnersData.partners : []

      setManagementStats({
        totalUsers: users.length,
        personalUsers: users.filter((user) => user.role === 'USER').length,
        businessUsers: users.filter((user) => user.role === 'BUSINESS').length,
        verifiedUsers: users.filter((user) => user.isVerified).length,
        totalPartners: partners.length,
        publicPartners: partners.filter((partner) => partner.isPublic).length,
        verifiedPartners: partners.filter((partner) => partner.isVerified).length,
        pendingPartners: partners.filter((partner) => partner.status === 'PENDING').length
      })
    } catch (error) {
      console.error('Error fetching management stats:', error)
    }
  }, [])

  const handleLimitChange = (nextLimit: number) => {
    setLimit(nextLimit)
    setPage(1)
  }

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
    if (session?.user?.role === 'ADMIN') {
      fetchManagementStats()
    }
  }, [session, status, router, locale, fetchAdminData, fetchManagementStats])

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
            <div>
              <div className="bg-sky-700 px-6 py-8 text-sky-50 md:px-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="mt-3 max-w-xl text-sm text-sky-100">
                  Quản lý toàn bộ nội dung, danh mục và người dùng trên cùng một không gian làm việc.
                </p>
              </div>
            </div>
          </section>

          {session.user.role === 'ADMIN' && (
            <section className="mb-8">
              <HomeStatsManager />
            </section>
          )}

          <section className="mb-8">
            <AiNewsPanel />
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
            <div className="mb-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Danh sách nội dung</h2>
                <p className="mt-1 text-sm text-slate-600">Quản lý chỉnh sửa, xuất bản và thao tác hàng loạt.</p>
              </div>
            </div>
            <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 text-sm font-semibold text-slate-700">Tổng quan nội dung</div>
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-semibold text-slate-700">Nội dung</div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm text-slate-500">Tổng nội dung</div>
                          <div className="mt-1 text-2xl font-bold text-slate-900">{stats.totalContent}</div>
                        </div>
                        <div className="inline-flex rounded-lg bg-sky-100 p-2 text-sky-700">
                          <FileText className="h-4 w-4" />
                        </div>
                      </div>
                    </article>
                    <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm text-slate-500">Đã xuất bản</div>
                          <div className="mt-1 text-2xl font-bold text-slate-900">{stats.published}</div>
                        </div>
                        <div className="inline-flex rounded-lg bg-emerald-100 p-2 text-emerald-700">
                          <FileCheck2 className="h-4 w-4" />
                        </div>
                      </div>
                    </article>
                    <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm text-slate-500">Tổng lượt xem</div>
                          <div className="mt-1 text-2xl font-bold text-slate-900">{stats.totalViews.toLocaleString('vi-VN')}</div>
                        </div>
                        <div className="inline-flex rounded-lg bg-violet-100 p-2 text-violet-700">
                          <BarChart3 className="h-4 w-4" />
                        </div>
                      </div>
                    </article>
                  </div>
                  <Button onClick={handleCreateContent} className="h-11 justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm nội dung
                  </Button>
                </div>
                <div className="grid gap-3 rounded-2xl border border-amber-100 bg-white p-4">
                  <div className="text-sm font-semibold text-slate-700">Danh mục</div>
                  <article className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm text-slate-500">Danh mục đang dùng</div>
                        <div className="mt-1 text-2xl font-bold text-slate-900">{categories.filter((item) => item.isActive).length}</div>
                      </div>
                      <div className="inline-flex rounded-lg bg-amber-100 p-2 text-amber-700">
                        <FolderTree className="h-4 w-4" />
                      </div>
                    </div>
                  </article>
                  {session.user.role === 'ADMIN' && (
                    <Link
                      href={`/${locale}/admin/categories`}
                      className="inline-flex h-11 items-center justify-center rounded-xl border border-amber-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-amber-50"
                    >
                      <Tags className="mr-2 h-4 w-4" />
                      Quản lý danh mục
                    </Link>
                  )}
                </div>
              </div>
            </div>
            {session.user.role === 'ADMIN' && (
              <div className="mb-4 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="grid gap-4 lg:grid-cols-2">
                  <Link
                    href={`/${locale}/admin/users`}
                    className="rounded-2xl border border-sky-100 bg-sky-50 p-4 transition hover:border-sky-200 hover:bg-sky-100/70"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-white p-2 text-sky-700">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-base font-semibold text-slate-900">Quản lý người dùng</div>
                        <p className="mt-1 text-sm text-slate-600">Cá nhân, doanh nghiệp và trạng thái xác thực.</p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
                      <div className="rounded-lg bg-white p-3">
                        <div className="text-xl font-bold text-slate-900">{managementStats.totalUsers}</div>
                        <div className="mt-1 text-xs text-slate-500">Tài khoản</div>
                      </div>
                      <div className="rounded-lg bg-white p-3">
                        <div className="text-xl font-bold text-slate-900">{managementStats.personalUsers}</div>
                        <div className="mt-1 text-xs text-slate-500">Cá nhân</div>
                      </div>
                      <div className="rounded-lg bg-white p-3">
                        <div className="text-xl font-bold text-slate-900">{managementStats.businessUsers}</div>
                        <div className="mt-1 text-xs text-slate-500">Doanh nghiệp</div>
                      </div>
                      <div className="rounded-lg bg-white p-3">
                        <div className="text-xl font-bold text-slate-900">{managementStats.verifiedUsers}</div>
                        <div className="mt-1 text-xs text-slate-500">Đã xác thực</div>
                      </div>
                    </div>
                  </Link>
                  <Link
                    href={`/${locale}/admin/partners`}
                    className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 transition hover:border-emerald-200 hover:bg-emerald-100/70"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-white p-2 text-emerald-700">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-base font-semibold text-slate-900">Quản lý đối tác</div>
                        <p className="mt-1 text-sm text-slate-600">Hồ sơ đối tác, trạng thái công khai và duyệt hiển thị.</p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
                      <div className="rounded-lg bg-white p-3">
                        <div className="text-xl font-bold text-slate-900">{managementStats.totalPartners}</div>
                        <div className="mt-1 text-xs text-slate-500">Đối tác</div>
                      </div>
                      <div className="rounded-lg bg-white p-3">
                        <div className="text-xl font-bold text-slate-900">{managementStats.publicPartners}</div>
                        <div className="mt-1 text-xs text-slate-500">Công khai</div>
                      </div>
                      <div className="rounded-lg bg-white p-3">
                        <div className="text-xl font-bold text-slate-900">{managementStats.verifiedPartners}</div>
                        <div className="mt-1 text-xs text-slate-500">Đã xác thực</div>
                      </div>
                      <div className="rounded-lg bg-white p-3">
                        <div className="text-xl font-bold text-slate-900">{managementStats.pendingPartners}</div>
                        <div className="mt-1 text-xs text-slate-500">Chờ duyệt</div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
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
