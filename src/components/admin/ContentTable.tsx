'use client'

import { useState } from 'react'
import { Edit, Trash2, Eye, Star, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ContentTableProps } from '@/types/content'

function formatEventDate(content: ContentTableProps['contents'][number]) {
  if (!content.eventStartAt) return '-'

  const start = new Date(content.eventStartAt)
  if (Number.isNaN(start.getTime())) return '-'

  if (content.isAllDay) {
    return start.toLocaleDateString('vi-VN')
  }

  return start.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function ContentTable({
  contents,
  onEdit,
  onDelete,
  onBulkAction,
  userRole,
  categoryLabels = {}
}: ContentTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? contents.map((content) => content.id) : [])
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds((current) => (checked ? [...current, id] : current.filter((value) => value !== id)))
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      PUBLISHED: { color: 'bg-green-100 text-green-800', text: 'Xuất bản' },
      DRAFT: { color: 'bg-yellow-100 text-yellow-800', text: 'Bản nháp' },
      ARCHIVED: { color: 'bg-gray-100 text-gray-800', text: 'Lưu trữ' }
    }

    const statusStyle = statusMap[status as keyof typeof statusMap] || statusMap.DRAFT

    return (
      <span className={`rounded px-2.5 py-0.5 text-xs font-medium ${statusStyle.color}`}>
        {statusStyle.text}
      </span>
    )
  }

  const getTypeBadge = (type: string) => {
    const typeMap = {
      ARTICLE: { color: 'bg-blue-100 text-blue-800', text: 'Bài viết' },
      DOCUMENT: { color: 'bg-purple-100 text-purple-800', text: 'Tài liệu' },
      STORY: { color: 'bg-orange-100 text-orange-800', text: 'Điển hình' },
      PROJECT_ACTIVITY: { color: 'bg-amber-100 text-amber-800', text: 'Hoạt động dự án' },
      GUIDE: { color: 'bg-indigo-100 text-indigo-800', text: 'Hướng dẫn' },
      POLICY: { color: 'bg-pink-100 text-pink-800', text: 'Chính sách' },
      NEWS: { color: 'bg-green-100 text-green-800', text: 'Tin tức' },
      EVENT: { color: 'bg-emerald-100 text-emerald-800', text: 'Sự kiện' },
      VIDEO: { color: 'bg-red-100 text-red-800', text: 'Video' },
      INFOGRAPHIC: { color: 'bg-teal-100 text-teal-800', text: 'Infographic' }
    }

    const typeStyle = typeMap[type as keyof typeof typeMap] || typeMap.ARTICLE

    return (
      <span className={`rounded px-2.5 py-0.5 text-xs font-medium ${typeStyle.color}`}>
        {typeStyle.text}
      </span>
    )
  }

  const getCategoryName = (category: string) => categoryLabels[category] || category

  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
      {selectedIds.length > 0 && (
        <div className="border-b bg-blue-50 px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800">Đã chọn {selectedIds.length} mục</span>
            <div className="flex space-x-2">
              <Button size="sm" variant="ghost" onClick={() => onBulkAction?.('publish', selectedIds)}>
                Xuất bản
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onBulkAction?.('draft', selectedIds)}>
                Chuyển về nháp
              </Button>
              {userRole === 'ADMIN' && (
                <>
                  <Button size="sm" variant="ghost" onClick={() => onBulkAction?.('feature', selectedIds)}>
                    Đặt nổi bật
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onBulkAction?.('archive', selectedIds)}>
                    Lưu trữ
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="w-8 py-3 px-4">
                <input
                  type="checkbox"
                  checked={selectedIds.length === contents.length && contents.length > 0}
                  onChange={(event) => handleSelectAll(event.target.checked)}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Tiêu đề</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Danh mục</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Loại</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Ngày sự kiện</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Trạng thái</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Lượt xem</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Tác giả</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {contents.map((content) => (
              <tr key={content.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(content.id)}
                    onChange={(event) => handleSelectOne(content.id, event.target.checked)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <div className="mb-1 font-medium text-gray-900">{content.title}</div>
                      {content.titleEn && <div className="text-sm text-gray-500">{content.titleEn}</div>}
                    </div>
                    <div className="ml-2 flex space-x-1">
                      {content.isFeatured && <Star className="h-4 w-4 text-yellow-500" />}
                      {!content.isPublic && <Users className="h-4 w-4 text-gray-500" />}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                    {getCategoryName(content.category)}
                  </span>
                </td>
                <td className="px-4 py-3">{getTypeBadge(content.type)}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{formatEventDate(content)}</td>
                <td className="px-4 py-3">{getStatusBadge(content.status)}</td>
                <td className="px-4 py-3 text-gray-600">{content.viewCount.toLocaleString('vi-VN')}</td>
                <td className="px-4 py-3">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{content.author.name}</div>
                    <div className="text-gray-500">{content.author.role}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(content)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                      title="Chỉnh sửa"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => window.open(`/content/${content.id}`, '_blank')}
                      className="p-1 text-green-600 hover:text-green-800"
                      title="Xem"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(content)}
                      className="p-1 text-red-600 hover:text-red-800"
                      title="Xóa"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {contents.length === 0 && (
          <div className="py-12 text-center">
            <div className="mb-2 text-lg text-gray-500">Chưa có nội dung nào</div>
            <div className="text-gray-400">Nh???n &quot;Th??m N???i Dung&quot; ????? t???o n???i dung ?????u ti??n</div>
          </div>
        )}
      </div>
    </div>
  )
}

