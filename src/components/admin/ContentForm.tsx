'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { FileUploadZone } from '@/components/upload/FileUploadZone'
import { FileManager } from '@/components/upload/FileManager'
import Image from 'next/image'
import { ContentFormProps } from '@/types/content'
import { RichTextEditor } from '@/components/admin/RichTextEditor'

const HOME_DIEN_HINH_MIN_CONTENT_LENGTH = 120

function toDateTimeLocalValue(value?: string | null) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60 * 1000)
  return localDate.toISOString().slice(0, 16)
}

function toDateValue(value?: string | null) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60 * 1000)
  return localDate.toISOString().slice(0, 10)
}

export function ContentForm({ content, onClose, userRole }: ContentFormProps) {
  const [loading, setLoading] = useState(false)
  const [showFileManager, setShowFileManager] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [showRestoredNotice, setShowRestoredNotice] = useState(false)

  // Generate a unique key for this form session
  const formStorageKey = `content-form-${content?.id || 'new'}`

  // Initialize form data with content or from localStorage
  const getInitialFormData = () => {
    if (content) {
      // If editing existing content, use content data
      return {
        title: content.title || '',
        description: content.description || '',
        content: content.content || '',
        category: content.category || '',
        type: content.type || 'ARTICLE',
        tags: content.tags || '',
        sectionKey: content.sectionKey || '',
        displayOrder: content.displayOrder ?? '',
        undertitle: content.undertitle || '',
        projectUrl: content.projectUrl || '',
        isFeatured: content.isFeatured || false,
        isPublic: content.isPublic !== false,
        status: content.status || 'DRAFT',
        fileUrl: content.fileUrl || '',
        fileType: content.fileType || '',
        fileSize: content.fileSize || 0,
        thumbnailUrl: content.thumbnailUrl || '',
        imageUrl: content.imageUrl || '',
        videoUrl: content.videoUrl || '',
        eventStartAt: content.isAllDay ? toDateValue(content.eventStartAt) : toDateTimeLocalValue(content.eventStartAt),
        eventEndAt: content.isAllDay ? toDateValue(content.eventEndAt) : toDateTimeLocalValue(content.eventEndAt),
        eventTimezone: content.eventTimezone || 'Asia/Ho_Chi_Minh',
        eventLocation: content.eventLocation || '',
        isAllDay: content.isAllDay || false
      }
    } else {
      // If creating new content, try to restore from localStorage
      try {
        const saved = localStorage.getItem(formStorageKey)
        if (saved) {
          const parsedData = JSON.parse(saved)
          if (parsedData.title) {
            // Show notice that data was restored
            setTimeout(() => setShowRestoredNotice(true), 500)
            setTimeout(() => setShowRestoredNotice(false), 5000)
          }
          return parsedData
        }
      } catch (error) {
        console.error('Error loading saved form data:', error)
      }

      // Default values for new content
      return {
        title: '',
        description: '',
        content: '',
        category: '',
        type: 'ARTICLE',
        tags: '',
        sectionKey: '',
        displayOrder: '',
        undertitle: '',
        projectUrl: '',
        isFeatured: false,
        isPublic: true,
        status: 'DRAFT',
        fileUrl: '',
        fileType: '',
        fileSize: 0,
        thumbnailUrl: '',
        imageUrl: '',
        videoUrl: '',
        eventStartAt: '',
        eventEndAt: '',
        eventTimezone: 'Asia/Ho_Chi_Minh',
        eventLocation: '',
        isAllDay: false
      }
    }
  }

  const [formData, setFormData] = useState(getInitialFormData)

  // Auto-save to localStorage when form data changes (debounced)
  const saveToLocalStorage = useCallback(() => {
    if (!content) { // Only save drafts for new content
      try {
        setAutoSaveStatus('saving')
        localStorage.setItem(formStorageKey, JSON.stringify(formData))
        setTimeout(() => setAutoSaveStatus('saved'), 500)
        setTimeout(() => setAutoSaveStatus('idle'), 3000)
      } catch (error) {
        console.error('Error saving form data:', error)
        setAutoSaveStatus('idle')
      }
    }
  }, [formData, formStorageKey, content])

  // Auto-save effect with debouncing
  useEffect(() => {
    const timer = setTimeout(saveToLocalStorage, 1000) // Save after 1 second of inactivity
    return () => clearTimeout(timer)
  }, [saveToLocalStorage])

  // Clear saved data when form is successfully submitted
  const clearSavedData = () => {
    try {
      localStorage.removeItem(formStorageKey)
    } catch (error) {
      console.error('Error clearing saved data:', error)
    }
  }

  // Check if there's saved data
  const hasSavedData = () => {
    if (content) return false // Don't show for existing content
    try {
      const saved = localStorage.getItem(formStorageKey)
      return saved && saved !== '{}' && JSON.parse(saved).title
    } catch {
      return false
    }
  }

  // Clear draft data
  const clearDraft = () => {
    if (confirm('Bạn có chắc chắn muốn xóa bản nháp đã lưu?')) {
      clearSavedData()
      setFormData({
        title: '',
        description: '',
        content: '',
        category: '',
        type: 'ARTICLE',
        tags: '',
        sectionKey: '',
        displayOrder: '',
        undertitle: '',
        projectUrl: '',
        isFeatured: false,
        isPublic: true,
        status: 'DRAFT',
        fileUrl: '',
        fileType: '',
        fileSize: 0,
        thumbnailUrl: '',
        imageUrl: '',
        videoUrl: '',
        eventStartAt: '',
        eventEndAt: '',
        eventTimezone: 'Asia/Ho_Chi_Minh',
        eventLocation: '',
        isAllDay: false
      })
    }
  }

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
    { value: 'STORY', label: 'Điển hình' },  // Using STORY for "�i?n h�nh" (exemplary cases)
    { value: 'PROJECT_ACTIVITY', label: 'Hoạt động dự án' },
    { value: 'GUIDE', label: 'Hướng dẫn' },
    { value: 'POLICY', label: 'Chính sách' },
    { value: 'NEWS', label: 'Tin tức' },
    { value: 'EVENT', label: 'Sự kiện' }
  ]

  const sectionOptions = [
    { value: '', label: 'Không hiển thị trên trang chủ' },
    { value: 'HOME_DIEN_HINH', label: 'Thực hành điển hình' },
    { value: 'HOME_HOAT_DONG_DU_AN', label: 'Hoạt động dự án' }
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
      const plainContent = (formData.content || '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .trim()
      const hasPdfAttachment = !!formData.fileUrl && (
        formData.fileType === 'application/pdf' ||
        formData.fileUrl.toLowerCase().endsWith('.pdf')
      )
      const isHomeDienHinhStory =
        formData.type === 'STORY' && formData.sectionKey === 'HOME_DIEN_HINH'

      if (!plainContent && !(isHomeDienHinhStory && hasPdfAttachment)) {
        alert('Vui lòng nhập nội dung')
        setLoading(false)
        return
      }

      if (
        isHomeDienHinhStory &&
        !hasPdfAttachment &&
        plainContent.length < HOME_DIEN_HINH_MIN_CONTENT_LENGTH
      ) {
        alert('Thực hành điển hình cần có PDF đính kèm hoặc phần giới thiệu đủ chi tiết.')
        setLoading(false)
        return
      }

      if (formData.type === 'EVENT' && !formData.eventStartAt) {
        alert('Vui lòng nhập thời gian bắt đầu sự kiện')
        setLoading(false)
        return
      }

      if (formData.type === 'PROJECT_ACTIVITY' && !formData.projectUrl) {
        alert('Vui lòng nhập đường dẫn dự án')
        setLoading(false)
        return
      }

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
        clearSavedData() // Clear saved draft after successful submission
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
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-bold">
                {content ? 'Chỉnh sửa nội dung' : 'Thêm nội dung mới'}
              </h2>

              {/* Auto-save indicator */}
              {!content && (
                <div className="flex items-center text-sm">
                  {autoSaveStatus === 'saving' && (
                    <span className="text-blue-600 flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang lưu...
                    </span>
                  )}
                  {autoSaveStatus === 'saved' && (
                    <span className="text-green-600 flex items-center">
                      <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Đã lưu bản nháp
                    </span>
                  )}
                </div>
              )}

              {/* Clear draft button for new content with saved data */}
              {!content && hasSavedData() && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearDraft}
                  className="text-red-600 hover:text-red-700 text-xs"
                >
                  Xóa bản nháp
                </Button>
              )}
            </div>

            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Restored data notification */}
        {showRestoredNotice && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mx-6 mt-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Bản nháp đã được khôi phục!</strong> Dữ liệu từ phiên làm việc trước đã được tự động khôi phục.
                </p>
              </div>
            </div>
          </div>
        )}

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
              <RichTextEditor
                value={formData.content}
                onChange={(nextValue) => setFormData({ ...formData, content: nextValue })}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hiển thị trên trang chủ
              </label>
              <select
                name="sectionKey"
                value={formData.sectionKey}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {sectionOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Chỉ chọn khi muốn hiển thị nội dung trên trang chủ.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thứ tự hiển thị
              </label>
              <input
                type="number"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Số nhỏ hiển thị trước. Bỏ trống thì sắp xếp theo ngày tạo.
              </p>
            </div>
          </div>

          {formData.type === 'PROJECT_ACTIVITY' && (
            <div className="space-y-4 rounded-lg border border-amber-200 bg-amber-50/60 p-4">
              <h3 className="text-lg font-semibold text-amber-700">Thông tin Hoạt động dự án</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề phụ (Undertitle)
                </label>
                <input
                  type="text"
                  name="undertitle"
                  value={formData.undertitle}
                  onChange={handleChange}
                  placeholder="Ví dụ: GRAISEA"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <p className="text-sm text-amber-800">
                  Dien truong Content URL ben duoi de card mo lien ket ngoai. Truong nay bat buoc voi hoat dong du an.
                </p>
              </div>
            </div>
          )}

          {formData.type === 'EVENT' && (
            <div className="space-y-4 rounded-lg border border-emerald-200 bg-emerald-50/60 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-emerald-700">Thông tin sự kiện</h3>
                <label className="flex items-center text-sm text-gray-700">
                  <input
                    type="checkbox"
                    name="isAllDay"
                    checked={formData.isAllDay}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="ml-2">Cả ngày</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.isAllDay ? 'Ngày bắt đầu *' : 'Thời gian bắt đầu *'}
                  </label>
                  <input
                    type={formData.isAllDay ? 'date' : 'datetime-local'}
                    name="eventStartAt"
                    value={formData.eventStartAt}
                    onChange={handleChange}
                    required={formData.type === 'EVENT'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.isAllDay ? 'Ngày kết thúc' : 'Thời gian kết thúc'}
                  </label>
                  <input
                    type={formData.isAllDay ? 'date' : 'datetime-local'}
                    name="eventEndAt"
                    value={formData.eventEndAt}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Múi giờ
                  </label>
                  <input
                    type="text"
                    name="eventTimezone"
                    value={formData.eventTimezone}
                    onChange={handleChange}
                    placeholder="Asia/Ho_Chi_Minh"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa điểm
                  </label>
                  <input
                    type="text"
                    name="eventLocation"
                    value={formData.eventLocation}
                    onChange={handleChange}
                    placeholder="Cần Thơ, Việt Nam"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail (Trang chủ)
              </label>
              {formData.thumbnailUrl && (
                <div className="mb-3 flex items-center gap-4">
                  <Image
                    src={formData.thumbnailUrl}
                    alt="Thumbnail preview"
                    width={120}
                    height={80}
                    className="rounded-md object-cover border"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFormData((prev: typeof formData) => ({ ...prev, thumbnailUrl: '' }))}
                    className="text-red-600 hover:text-red-700"
                  >
                    Xóa thumbnail
                  </Button>
                </div>
              )}

              {!formData.thumbnailUrl && (
                <FileUploadZone
                  multiple={false}
                  fileOnly={true}
                  accept="image/*"
                  maxSize={1}
                  onUploadComplete={(files) => {
                    if (files.length > 0) {
                      const file = files[0]
                      setFormData((prev: typeof formData) => ({
                        ...prev,
                        thumbnailUrl: file.url || ''
                      }))
                    }
                  }}
                  onUploadError={(error) => alert(error)}
                />
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content URL {formData.type === 'PROJECT_ACTIVITY' ? '*' : '(tuy chon)'}
                </label>
                <input
                  type="url"
                  name="projectUrl"
                  value={formData.projectUrl}
                  onChange={handleChange}
                  required={formData.type === 'PROJECT_ACTIVITY'}
                  placeholder="https://example.com/article-or-pdf"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Neu nhap, card se mo lien ket ngoai (PDF/bai viet). Neu bo trong, card se mo trang chi tiet noi dung.
                </p>
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

            {/* Upload limitations notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.485 3.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 3.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <div className="space-y-1 text-sm text-amber-700">
                    <p><strong>Thumbnail và image chỉ dùng cho ảnh hiển thị.</strong></p>
                    <p>File đính kèm nội bộ hiện hạn chế trên Vercel.</p>
                    <p>Khuyến nghị dùng Content URL cho PDF ngoài, bài viết, hoặc cloud link.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Current File */}
            {formData.fileUrl && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white rounded border flex items-center justify-center">
                      {formData.thumbnailUrl ? (
                        <Image
                          src={formData.thumbnailUrl}
                          alt="Thumbnail"
                          width={48}
                          height={48}
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
                      setFormData((prev: typeof formData) => ({
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
                      setFormData((prev: typeof formData) => ({
                        ...prev,
                        fileUrl: file.url,
                        fileType: file.type || '',
                        fileSize: file.size || 0,
                        thumbnailUrl: file.thumbnailUrl || (file.type?.startsWith('image/') ? file.url : '')
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
                  variant="secondary"
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
                onSelectFile={(file) => {
                  setFormData((prev: typeof formData) => ({
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

