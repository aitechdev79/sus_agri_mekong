'use client'

import { useState, useEffect } from 'react'

interface SearchFiltersProps {
  selectedCategory: string
  selectedType: string
  onFilterChange: (filters: { category: string; type: string }) => void
}

export function SearchFilters({ selectedCategory, selectedType, onFilterChange }: SearchFiltersProps) {
  const [categories, setCategories] = useState<{ name: string; nameVi: string; count: number }[]>([])
  const [loading, setLoading] = useState(true)

  const contentTypes = [
    { value: '', label: 'Tất cả loại' },
    { value: 'ARTICLE', label: 'Bài viết' },
    { value: 'VIDEO', label: 'Video' },
    { value: 'DOCUMENT', label: 'Tài liệu' },
    { value: 'STORY', label: 'Câu chuyện' },
    { value: 'GUIDE', label: 'Hướng dẫn' },
    { value: 'POLICY', label: 'Chính sách' },
    { value: 'INFOGRAPHIC', label: 'Infographic' },
    { value: 'NEWS', label: 'Tin tức' }
  ]

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (category: string) => {
    onFilterChange({ category, type: selectedType })
  }

  const handleTypeChange = (type: string) => {
    onFilterChange({ category: selectedCategory, type })
  }

  const clearFilters = () => {
    onFilterChange({ category: '', type: '' })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Danh mục
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={loading}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.nameVi} ({category.count})
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loại nội dung
          </label>
          <select
            value={selectedType}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {contentTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        <div className="flex items-end">
          <button
            onClick={clearFilters}
            className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* Active Filters */}
      {(selectedCategory || selectedType) && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <span className="text-sm text-gray-600">Bộ lọc đang áp dụng:</span>
          {selectedCategory && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {categories.find(c => c.name === selectedCategory)?.nameVi}
              <button
                onClick={() => handleCategoryChange('')}
                className="ml-1 text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </span>
          )}
          {selectedType && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {contentTypes.find(t => t.value === selectedType)?.label}
              <button
                onClick={() => handleTypeChange('')}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}