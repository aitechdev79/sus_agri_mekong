'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { ContentCard } from '@/components/content/ContentCard'
import { SearchFilters } from '@/components/content/SearchFilters'
import { Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Content {
  id: string
  title: string
  titleEn?: string
  description?: string
  descriptionEn?: string
  type: string
  category: string
  viewCount: number
  downloadCount: number
  isFeatured: boolean
  author: {
    name: string
    role: string
  }
  createdAt: string
  _count: {
    comments: number
    bookmarks: number
  }
}

export default function LibraryPage() {
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  })

  useEffect(() => {
    loadContents()
  }, [searchTerm, selectedCategory, selectedType, currentPage])

  const loadContents = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pagination.limit.toString()
      })

      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategory) params.append('category', selectedCategory)
      if (selectedType) params.append('type', selectedType)

      const response = await fetch(`/api/content?${params}`)
      if (response.ok) {
        const data = await response.json()
        setContents(data.contents)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error loading contents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  const handleFilterChange = (filters: { category: string; type: string }) => {
    setSelectedCategory(filters.category)
    setSelectedType(filters.type)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPath="/library" />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Thư Viện Tài Liệu
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá kho tài liệu phong phú về các thực hành tốt trong chuỗi giá trị tôm và lúa
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm tài liệu, câu chuyện..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Filter Toggle */}
            <Button
              variant="ghost"
              onClick={() => setShowFilters(!showFilters)}
              className="md:w-auto"
            >
              <Filter className="w-4 h-4 mr-2" />
              Bộ lọc
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t">
              <SearchFilters
                selectedCategory={selectedCategory}
                selectedType={selectedType}
                onFilterChange={handleFilterChange}
              />
            </div>
          )}
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Tìm thấy {pagination.total} tài liệu
              {searchTerm && ` cho "${searchTerm}"`}
            </p>
            <div className="text-sm text-gray-500">
              Trang {pagination.page} / {pagination.pages}
            </div>
          </div>
        )}

        {/* Content Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : contents.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {contents.map((content) => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Trước
                </Button>

                {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                  const page = i + Math.max(1, currentPage - 2)
                  if (page > pagination.pages) return null

                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "ghost"}
                      onClick={() => handlePageChange(page)}
                      className="w-10"
                    >
                      {page}
                    </Button>
                  )
                })}

                <Button
                  variant="ghost"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.pages}
                >
                  Sau
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">
              {searchTerm || selectedCategory || selectedType
                ? 'Không tìm thấy tài liệu phù hợp'
                : 'Chưa có tài liệu nào'}
            </div>
            <div className="text-gray-400">
              {searchTerm || selectedCategory || selectedType
                ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc'
                : 'Vui lòng quay lại sau để khám phá thêm tài liệu mới'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}