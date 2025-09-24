'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { ContentTable } from '@/components/admin/ContentTable'
import { ContentForm } from '@/components/admin/ContentForm'
import { StatsCards } from '@/components/admin/StatsCards'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ContentItem {
  id: string
  title: string
  description: string
  content: string
  type: string
  category: string
  tags: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  viewCount: number
  isPublic: boolean
  isFeatured: boolean
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
    email: string
  }
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null)
  const [contents, setContents] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    totalViews: 0
  })

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
        // The API returns an array directly, not an object with contents property
        const contentList = Array.isArray(data) ? data : (data.contents || [])
        setContents(contentList)

        // Calculate stats with null checks
        const total = contentList.length
        const published = contentList.filter((c: ContentItem) => c.status === 'PUBLISHED').length
        const draft = contentList.filter((c: ContentItem) => c.status === 'DRAFT').length
        const totalViews = contentList.reduce((sum: number, c: ContentItem) => sum + (c.viewCount || 0), 0)

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

  const handleEditContent = (content: ContentItem) => {
    setEditingContent(content)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingContent(null)
    loadContents()
  }

  const handleDeleteContent = async (contentId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa nội dung này?')) {
      return
    }

    try {
      const response = await fetch(`/api/content/${contentId}`, {
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

  const handleBulkAction = async (ids: string[], action: string) => {
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
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Quản Lý Nội Dung</h1>
          <Button onClick={handleCreateContent}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm Nội Dung
          </Button>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Content Table */}
        <ContentTable
          contents={contents}
          onEdit={handleEditContent}
          onDelete={handleDeleteContent}
          onBulkAction={handleBulkAction}
          userRole={session.user.role}
        />

        {/* Content Form Modal */}
        {showForm && (
          <ContentForm
            content={editingContent}
            onClose={handleFormClose}
            userRole={session.user.role}
          />
        )}
      </div>
    </div>
  )
}