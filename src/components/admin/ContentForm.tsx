'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileUploadZone } from '@/components/upload/FileUploadZone'
import { FileManager } from '@/components/upload/FileManager'

interface ContentFormProps {
  content?: any
  onClose: () => void
  userRole: string
}

export function ContentForm({ content, onClose, userRole }: ContentFormProps) {
  const [loading, setLoading] = useState(false)
  const [showFileManager, setShowFileManager] = useState(false)
  const [formData, setFormData] = useState({
    title: content?.title || '',
    description: content?.description || '',
    content: content?.content || '',
    category: content?.category || '',
    type: content?.type || 'ARTICLE',
    tags: content?.tags || '',
    isFeatured: content?.isFeatured || false,
    isPublic: content?.isPublic !== false,
    status: content?.status || 'DRAFT',
    fileUrl: content?.fileUrl || '',
    fileType: content?.fileType || '',
    fileSize: content?.fileSize || 0,
    thumbnailUrl: content?.thumbnailUrl || '',
    imageUrl: content?.imageUrl || '',
    videoUrl: content?.videoUrl || ''
  })

  const categories = [
    { value: 'shrimp_farming', label: 'Nuôi tôm' },
    { value: 'shrimp_processing', label: 'Chế biến tôm' },
    { value: 'shrimp_export', label: 'Xuất khẩu tôm' },
    { value: 'rice_cultivation', label: 'Trồng lúa' },
    { value: 'rice_processing', label: 'Chế biến lúa' },
    { value: 'rice_marketing', label: 'Tiếp thị lúa' },
    { value: 'sustainable_practices', label: 'Thực hành bền vững' },
    { value: 'technology_innovation', label: 'Công nghệ và đổi mới' },
    { value: 'financial_support', label: 'Hỗ trợ tài chính' },
    { value: 'market_access', label: 'Tiếp cận thị trường' },
    { value: 'policy_guidelines', label: 'Chính sách và hướng dẫn' },
    { value: 'success_stories', label: 'Câu chuyện thành công' }
  ]

  const contentTypes = [
    { value: 'ARTICLE', label: 'Bài viết' },
    { value: 'DOCUMENT', label: 'Tài liệu' },
    { value: 'STORY', label: 'Điển hình' },  // Using STORY for "Điển hình" (exemplary cases)
    { value: 'GUIDE', label: 'Hướng dẫn' },
    { value: 'POLICY', label: 'Chính sách' },
    { value: 'NEWS', label: 'Tin tức' }
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData({ ...formData, [name]: checked })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitData = {
        ...formData,
        tags: formData.tags
      }

      const url = content ? `/api/content/${content.id}` : '/api/content'
      const method = content ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      })

      if (response.ok) {
        onClose()
      } else {
        const error = await response.json()
        alert(error.error || 'Đã xảy ra lỗi')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      alert('Đã xảy ra lỗi khi lưu nội dung')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">
              {content ? 'Chỉnh sửa nội dung' : 'Thêm nội dung mới'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-600">Nội dung tiếng Việt</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề (Tiếng Việt) *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả ngắn (Tiếng Việt)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung (Tiếng Việt) *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-600">English Content</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title (English)
              </label>
              <input
                type="text"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content (English)
              </label>
              <textarea
                onChange={handleChange}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Chọn danh mục</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại nội dung *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {contentTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Từ khóa (phân cách bằng dấu phẩy)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="nuôi tôm, sinh thái, bền vững"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Media Content Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-purple-600">Media Content</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Link to image that will be displayed in the content
                </p>
                {formData.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-32 h-24 object-cover rounded-md border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube Video URL
                </label>
                <input
                  type="url"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  YouTube video link that will be embedded in the content
                </p>
                {formData.videoUrl && (
                  <div className="mt-2">
                    <div className="w-32 h-20 bg-gray-100 rounded-md border flex items-center justify-center">
                      <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* File Attachments */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">File đính kèm</h3>

            {/* Current File */}
            {formData.fileUrl && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white rounded border flex items-center justify-center">
                      {formData.thumbnailUrl ? (
                        <img
                          src={formData.thumbnailUrl}
                          alt="Thumbnail"
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <span className="text-xl">📄</span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">File đã đính kèm</div>
                      <div className="text-sm text-gray-500">
                        {formData.fileType} • {Math.round(formData.fileSize / 1024)} KB
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        fileUrl: '',
                        fileType: '',
                        fileSize: 0,
                        thumbnailUrl: ''
                      }))
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    Xóa file
                  </Button>
                </div>
              </div>
            )}

            {/* Upload New File */}
            {!formData.fileUrl && (
              <div className="space-y-4">
                <FileUploadZone
                  multiple={false}
                  fileOnly={true}
                  onUploadComplete={(files) => {
                    if (files.length > 0) {
                      const file = files[0]
                      setFormData(prev => ({
                        ...prev,
                        fileUrl: file.url,
                        fileType: file.type,
                        fileSize: file.size,
                        thumbnailUrl: file.thumbnailUrl || (file.type.startsWith('image/') ? file.url : '')
                      }))
                    }
                  }}
                  onUploadError={(error) => alert(error)}
                />

                <div className="text-center">
                  <span className="text-gray-500">hoặc</span>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFileManager(true)}
                  className="w-full"
                >
                  Chọn từ thư viện file
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-6">
              {userRole === 'ADMIN' && (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Nội dung nổi bật</span>
                </label>
              )}

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">Công khai</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="DRAFT">Bản nháp</option>
                <option value="PUBLISHED">Đã xuất bản</option>
                {userRole === 'ADMIN' && <option value="ARCHIVED">Lưu trữ</option>}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang lưu...' : (content ? 'Cập nhật' : 'Tạo mới')}
            </Button>
          </div>
        </form>
      </div>

      {/* File Manager Modal */}
      {showFileManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Chọn file từ thư viện</h3>
                <button
                  onClick={() => setShowFileManager(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <FileManager
                onSelectFile={(file: any) => {
                  setFormData(prev => ({
                    ...prev,
                    fileUrl: file.fileUrl,
                    fileType: file.fileType,
                    fileSize: file.fileSize,
                    thumbnailUrl: file.thumbnailUrl || ''
                  }))
                  setShowFileManager(false)
                }}
                multiple={false}
                showUpload={false}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}