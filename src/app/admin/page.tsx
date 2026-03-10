'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { ContentTable } from '@/components/admin/ContentTable'
import { ContentForm } from '@/components/admin/ContentForm'
import { StatsCards } from '@/components/admin/StatsCards'
import { AiNewsPanel } from '@/components/admin/AiNewsPanel'
import { Plus, Tags, Users } from 'lucide-react'
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
        console.error('Failed to fetch contents:', response.status)
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
      <div className="min-h-screen bg-gray-50">
        <Header currentPath="/admin" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex h-64 items-center justify-center">
            <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MODERATOR')) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPath="/admin" />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Quản lý nội dung</h1>
            <p className="mt-2 text-sm text-gray-600">Danh mục đã được tách sang taxonomy động và dùng chung từ database.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {session.user.role === 'ADMIN' && (
              <Link
                href="/admin/users"
                className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Users className="mr-2 h-4 w-4" />
                Quản lý người dùng
              </Link>
            )}
            {session.user.role === 'ADMIN' && (
              <Link
                href="/admin/categories"
                className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Tags className="mr-2 h-4 w-4" />
                Quản lý danh mục
              </Link>
            )}
            <Button onClick={handleCreateContent}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm nội dung
            </Button>
          </div>
        </div>

        <StatsCards stats={stats} />
        <AiNewsPanel />

        <ContentTable
          contents={contents}
          onEdit={handleEditContent}
          onDelete={handleDeleteContent}
          onBulkAction={handleBulkAction}
          userRole={session.user.role}
          categoryLabels={categoryLabels}
        />

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
