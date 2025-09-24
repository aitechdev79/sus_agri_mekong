'use client'

import { useState } from 'react'
import { Edit, Trash2, Eye, Star, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminContent, ContentTableProps } from '@/types/content'

export function ContentTable({ contents, onEdit, onDelete, onBulkAction, userRole }: ContentTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(contents.map(c => c.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id])
    } else {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id))
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      PUBLISHED: { color: 'bg-green-100 text-green-800', text: 'Xuất bản' },
      DRAFT: { color: 'bg-yellow-100 text-yellow-800', text: 'Bản nháp' },
      ARCHIVED: { color: 'bg-gray-100 text-gray-800', text: 'Lưu trữ' }
    }

    const statusStyle = statusMap[status as keyof typeof statusMap] || statusMap.DRAFT

    return (
      <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${statusStyle.color}`}>
        {statusStyle.text}
      </span>
    )
  }

  const getTypeBadge = (type: string) => {
    const typeMap = {
      ARTICLE: { color: 'bg-blue-100 text-blue-800', text: 'Bài viết' },
      DOCUMENT: { color: 'bg-purple-100 text-purple-800', text: 'Tài liệu' },
      STORY: { color: 'bg-orange-100 text-orange-800', text: 'Điển hình' },
      GUIDE: { color: 'bg-indigo-100 text-indigo-800', text: 'Hướng dẫn' },
      POLICY: { color: 'bg-pink-100 text-pink-800', text: 'Chính sách' },
      NEWS: { color: 'bg-green-100 text-green-800', text: 'Tin tức' },
      // Legacy types - map to appropriate new types
      VIDEO: { color: 'bg-red-100 text-red-800', text: 'Video' },
      INFOGRAPHIC: { color: 'bg-teal-100 text-teal-800', text: 'Infographic' }
    }

    const typeStyle = typeMap[type as keyof typeof typeMap] || typeMap.ARTICLE

    return (
      <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${typeStyle.color}`}>
        {typeStyle.text}
      </span>
    )
  }

  const getCategoryName = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      shrimp_farming: 'Nuôi tôm',
      shrimp_processing: 'Chế biến tôm',
      shrimp_export: 'Xuất khẩu tôm',
      rice_cultivation: 'Trồng lúa',
      rice_processing: 'Chế biến lúa',
      rice_marketing: 'Tiếp thị lúa',
      sustainable_practices: 'Thực hành bền vững',
      technology_innovation: 'Công nghệ và đổi mới',
      financial_support: 'Hỗ trợ tài chính',
      market_access: 'Tiếp cận thị trường',
      policy_guidelines: 'Chính sách và hướng dẫn',
      success_stories: 'Câu chuyện thành công'
    }

    return categoryMap[category] || category
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-50 border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800">
              Đã chọn {selectedIds.length} mục
            </span>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onBulkAction?.('publish', selectedIds)}
              >
                Xuất bản
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onBulkAction?.('draft', selectedIds)}
              >
                Chuyển về nháp
              </Button>
              {userRole === 'ADMIN' && (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onBulkAction?.('feature', selectedIds)}
                  >
                    Đặt nổi bật
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onBulkAction?.('archive', selectedIds)}
                  >
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
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="py-3 px-4 w-8">
                <input
                  type="checkbox"
                  checked={selectedIds.length === contents.length && contents.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Tiêu đề</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Danh mục</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Loại</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Trạng thái</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Lượt xem</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Tác giả</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {contents.map((content) => (
              <tr key={content.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(content.id)}
                    onChange={(e) => handleSelectOne(content.id, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1">
                        {content.title}
                      </div>
                      {content.titleEn && (
                        <div className="text-sm text-gray-500">
                          {content.titleEn}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-1 ml-2">
                      {content.isFeatured && (
                        <Star className="w-4 h-4 text-yellow-500" title="Nổi bật" />
                      )}
                      {!content.isPublic && (
                        <Users className="w-4 h-4 text-gray-500" title="Riêng tư" />
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {getCategoryName(content.category)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {getTypeBadge(content.type)}
                </td>
                <td className="py-3 px-4">
                  {getStatusBadge(content.status)}
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {content.viewCount.toLocaleString('vi-VN')}
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{content.author.name}</div>
                    <div className="text-gray-500">{content.author.role}</div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(content)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => window.open(`/content/${content.id}`, '_blank')}
                      className="text-green-600 hover:text-green-800 p-1"
                      title="Xem"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(content)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {contents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">Chưa có nội dung nào</div>
            <div className="text-gray-400">Nhấn &quot;Thêm Nội Dung&quot; để tạo nội dung đầu tiên</div>
          </div>
        )}
      </div>
    </div>
  )
}