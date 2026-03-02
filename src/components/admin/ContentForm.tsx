'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { FileUploadZone } from '@/components/upload/FileUploadZone'
import { FileManager } from '@/components/upload/FileManager'
import Image from 'next/image'
import { ContentFormProps } from '@/types/content'
import { RichTextEditor } from '@/components/admin/RichTextEditor'

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
    if (confirm('Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n xÃ³a báº£n nhÃ¡p Ä‘Ã£ lÆ°u?')) {
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
    { value: 'shrimp_farming', label: 'NuÃ´i tÃ´m' },
    { value: 'shrimp_processing', label: 'Cháº¿ biáº¿n tÃ´m' },
    { value: 'shrimp_export', label: 'Xuáº¥t kháº©u tÃ´m' },
    { value: 'rice_cultivation', label: 'Trá»“ng lÃºa' },
    { value: 'rice_processing', label: 'Cháº¿ biáº¿n lÃºa' },
    { value: 'rice_marketing', label: 'Tiáº¿p thá»‹ lÃºa' },
    { value: 'sustainable_practices', label: 'Thá»±c hÃ nh bá»n vá»¯ng' },
    { value: 'technology_innovation', label: 'CÃ´ng nghá»‡ vÃ  Ä‘á»•i má»›i' },
    { value: 'financial_support', label: 'Há»— trá»£ tÃ i chÃ­nh' },
    { value: 'market_access', label: 'Tiáº¿p cáº­n thá»‹ trÆ°á»ng' },
    { value: 'policy_guidelines', label: 'ChÃ­nh sÃ¡ch vÃ  hÆ°á»›ng dáº«n' },
    { value: 'success_stories', label: 'CÃ¢u chuyá»‡n thÃ nh cÃ´ng' }
  ]

  const contentTypes = [
    { value: 'ARTICLE', label: 'Bài viết' },
    { value: 'DOCUMENT', label: 'Tài liệu' },
    { value: 'STORY', label: 'Điển hình' },  // Using STORY for 'Điển hình' (exemplary cases)
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

      if (!plainContent) {
        alert('Vui lÃ²ng nháº­p ná»™i dung')
        setLoading(false)
        return
      }

      if (formData.type === 'EVENT' && !formData.eventStartAt) {
        alert('Vui lÃ²ng nháº­p thá»i gian báº¯t Ä‘áº§u sá»± kiá»‡n')
        setLoading(false)
        return
      }

      if (formData.type === 'PROJECT_ACTIVITY' && !formData.projectUrl) {
        alert('Vui lÃ²ng nháº­p Ä‘Æ°á»ng dáº«n dá»± Ã¡n')
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
        alert(error.error || 'ÄÃ£ xáº£y ra lá»—i')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      alert('ÄÃ£ xáº£y ra lá»—i khi lÆ°u ná»™i dung')
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
                {content ? 'Chá»‰nh sá»­a ná»™i dung' : 'ThÃªm ná»™i dung má»›i'}
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
                      Äang lÆ°u...
                    </span>
                  )}
                  {autoSaveStatus === 'saved' && (
                    <span className="text-green-600 flex items-center">
                      <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      ÄÃ£ lÆ°u báº£n nhÃ¡p
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
                  XÃ³a báº£n nhÃ¡p
                </Button>
              )}
            </div>

            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              Ã—
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
                  <strong>Báº£n nhÃ¡p Ä‘Ã£ Ä‘Æ°á»£c khÃ´i phá»¥c!</strong> Dá»¯ liá»‡u tá»« phiÃªn lÃ m viá»‡c trÆ°á»›c Ä‘Ã£ Ä‘Æ°á»£c tá»± Ä‘á»™ng khÃ´i phá»¥c.
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-600">Ná»™i dung tiáº¿ng Viá»‡t</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                TiÃªu Ä‘á» (Tiáº¿ng Viá»‡t) *
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
                MÃ´ táº£ ngáº¯n (Tiáº¿ng Viá»‡t)
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
                Ná»™i dung (Tiáº¿ng Viá»‡t) *
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
                Danh má»¥c *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Chá»n danh má»¥c</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loáº¡i ná»™i dung *
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
                Hiá»ƒn thá»‹ trÃªn trang chá»§
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
                Chá»‰ chá»n khi muá»‘n hiá»ƒn thá»‹ ná»™i dung trÃªn trang chá»§.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thá»© tá»± hiá»ƒn thá»‹
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
                Sá»‘ nhá» hiá»ƒn thá»‹ trÆ°á»›c. Bá» trá»‘ng thÃ¬ sáº¯p xáº¿p theo ngÃ y táº¡o.
              </p>
            </div>
          </div>

          {formData.type === 'PROJECT_ACTIVITY' && (
            <div className="space-y-4 rounded-lg border border-amber-200 bg-amber-50/60 p-4">
              <h3 className="text-lg font-semibold text-amber-700">ThÃ´ng tin Hoáº¡t Ä‘á»™ng dá»± Ã¡n</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TiÃªu Ä‘á» phá»¥ (Undertitle)
                </label>
                <input
                  type="text"
                  name="undertitle"
                  value={formData.undertitle}
                  onChange={handleChange}
                  placeholder="VÃ­ dá»¥: GRAISEA"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ÄÆ°á»ng dáº«n dá»± Ã¡n *
                </label>
                <input
                  type="url"
                  name="projectUrl"
                  value={formData.projectUrl}
                  onChange={handleChange}
                  required={formData.type === 'PROJECT_ACTIVITY'}
                  placeholder="https://example.com/project"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          {formData.type === 'EVENT' && (
            <div className="space-y-4 rounded-lg border border-emerald-200 bg-emerald-50/60 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-emerald-700">ThÃ´ng tin sá»± kiá»‡n</h3>
                <label className="flex items-center text-sm text-gray-700">
                  <input
                    type="checkbox"
                    name="isAllDay"
                    checked={formData.isAllDay}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="ml-2">Cáº£ ngÃ y</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.isAllDay ? 'NgÃ y báº¯t Ä‘áº§u *' : 'Thá»i gian báº¯t Ä‘áº§u *'}
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
                    {formData.isAllDay ? 'NgÃ y káº¿t thÃºc' : 'Thá»i gian káº¿t thÃºc'}
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
                    MÃºi giá»
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
                    Äá»‹a Ä‘iá»ƒm
                  </label>
                  <input
                    type="text"
                    name="eventLocation"
                    value={formData.eventLocation}
                    onChange={handleChange}
                    placeholder="Cáº§n ThÆ¡, Viá»‡t Nam"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tá»« khÃ³a (phÃ¢n cÃ¡ch báº±ng dáº¥u pháº©y)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="nuÃ´i tÃ´m, sinh thÃ¡i, bá»n vá»¯ng"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Media Content Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-purple-600">Media Content</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail (Trang chá»§)
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
                    XÃ³a thumbnail
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
                  News URL
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/news-article"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Link to news article or external source
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
            <h3 className="text-lg font-semibold text-gray-800">File Ä‘Ã­nh kÃ¨m</h3>

            {/* Upload limitations notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.485 3.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 3.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-amber-700">
                    <strong>HÃ¬nh áº£nh hiá»ƒn thá»‹:</strong> Chá»‰ nhá»¯ng hÃ¬nh áº£nh Ä‘Æ°á»£c táº£i lÃªn thá»§ cÃ´ng sáº½ hiá»ƒn thá»‹ trong carousel tin tá»©c.
                    Hiá»‡n táº¡i chá»‰ há»— trá»£ hÃ¬nh áº£nh dÆ°á»›i 1MB. TrÆ°á»ng &ldquo;News URL&rdquo; dÃ¹ng Ä‘á»ƒ liÃªn káº¿t Ä‘áº¿n bÃ i bÃ¡o gá»‘c.
                  </p>
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
                        <span className="text-xl">ðŸ“„</span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">File Ä‘Ã£ Ä‘Ã­nh kÃ¨m</div>
                      <div className="text-sm text-gray-500">
                        {formData.fileType} â€¢ {Math.round(formData.fileSize / 1024)} KB
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
                    XÃ³a file
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
                  <span className="text-gray-500">hoáº·c</span>
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowFileManager(true)}
                  className="w-full"
                >
                  Chá»n tá»« thÆ° viá»‡n file
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
                  <span className="ml-2 text-sm text-gray-700">Ná»™i dung ná»•i báº­t</span>
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
                <span className="ml-2 text-sm text-gray-700">CÃ´ng khai</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tráº¡ng thÃ¡i
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="DRAFT">Báº£n nhÃ¡p</option>
                <option value="PUBLISHED">ÄÃ£ xuáº¥t báº£n</option>
                {userRole === 'ADMIN' && <option value="ARCHIVED">LÆ°u trá»¯</option>}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
              Há»§y
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Äang lÆ°u...' : (content ? 'Cáº­p nháº­t' : 'Táº¡o má»›i')}
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
                <h3 className="text-xl font-bold">Chá»n file tá»« thÆ° viá»‡n</h3>
                <button
                  onClick={() => setShowFileManager(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  Ã—
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

