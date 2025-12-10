'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import NavigationBar from '@/components/NavigationBar'
import { ContentCard } from '@/components/content/ContentCard'
import { SearchFilters } from '@/components/content/SearchFilters'
import { Search, Filter, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LibraryContent } from '@/types/content'

// Resource sections data
const resourceSections = [
  {
    title: 'An toàn vệ sinh lao động',
    icon: '🦺',
    iconType: 'emoji' as const,
    links: [
      { title: 'ILO - Occupational Safety and Health', url: 'https://www.ilo.org/global/topics/safety-and-health-at-work/lang--en/index.htm' },
      { title: 'WHO - Occupational Health', url: 'https://www.who.int/health-topics/occupational-health' },
      { title: 'OSHA - Vietnam Safety Guidelines', url: 'https://www.osha.gov/international-cooperation' }
    ]
  },
  {
    title: 'ESG',
    icon: '/ESG_rice.jpg',
    iconType: 'image' as const,
    links: [
      { title: 'UN Global Compact - ESG Reporting', url: 'https://www.unglobalcompact.org/what-is-gc/our-work/environment' },
      { title: 'GRI Standards - Sustainability Reporting', url: 'https://www.globalreporting.org/standards/' },
      { title: 'SASB Standards - ESG Disclosure', url: 'https://www.sasb.org/standards/' }
    ]
  },
  {
    title: 'Chính sách và quy định',
    icon: '📋',
    iconType: 'emoji' as const,
    links: [
      { title: 'Luật Lao động Việt Nam 2019', url: 'https://thuvienphapluat.vn/van-ban/Lao-dong-Tien-luong/Bo-luat-lao-dong-2019-333670.aspx' },
      { title: 'Nghị định về An toàn lao động', url: 'https://thuvienphapluat.vn/tim-van-ban-phap-luat.html' },
      { title: 'Quy chuẩn ESG tại Việt Nam', url: 'https://www.ssc.gov.vn/' }
    ]
  },
  {
    title: 'Thực hành tốt trên thế giới',
    icon: '🌍',
    iconType: 'emoji' as const,
    links: [
      { title: 'ILO - Better Work Programme', url: 'https://betterwork.org/' },
      { title: 'Sustainable Agriculture Practices - FAO', url: 'https://www.fao.org/sustainability/en/' },
      { title: 'Global Good Agricultural Practices', url: 'https://www.globalgap.org/' }
    ]
  },
  {
    title: 'Thực hành tốt tại Việt Nam',
    icon: '/VN map icon.png',
    iconType: 'image' as const,
    links: [
      { title: 'VCCI - Doanh nghiệp bền vững', url: 'https://www.vcci.com.vn/' },
      { title: 'VnSAT - Nông nghiệp bền vững', url: 'https://www.vnsat.org.vn/' },
      { title: 'GRAISEA - Thực hành tốt Đông Nam Á', url: 'https://graisea.github.io/' }
    ]
  }
]

export default function LibraryPage() {
  const [contents, setContents] = useState<LibraryContent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedSections, setExpandedSections] = useState<{ [key: number]: boolean }>({})
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  })

  const toggleSection = (index: number) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const loadContents = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pagination.limit.toString(),
        type: selectedType || 'STORY,GUIDE,POLICY' // Default to library content types
      })

      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategory) params.append('category', selectedCategory)

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
  }, [currentPage, pagination.limit, searchTerm, selectedCategory, selectedType])

  useEffect(() => {
    loadContents()
  }, [loadContents])

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
    <div className="min-h-screen bg-gray-50 relative">
      {/* Background SVG Pattern */}
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'url(/vecteezy_topo_34242655.svg)',
          backgroundRepeat: 'repeat',
          backgroundSize: '600px 600px',
          zIndex: 0
        }}
      />

      <NavigationBar />

      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 font-montserrat">
            Thư Viện Tài Liệu
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-montserrat">
            Thư viện Nghiên cứu & Báo cáo là nơi tập hợp những tài liệu chính sách, phân tích, khảo sát và nghiên cứu chuyên sâu về chủ đề phát triển bền vững, báo cáo bền vững ESG, chuyển đổi xanh tại Việt Nam. Các tài liệu được chọn lọc và phân loại khoa học, giúp doanh nghiệp, tổ chức và nhà nghiên cứu dễ dàng tra cứu, tiếp cận tri thức tin cậy và ứng dụng vào thực tiễn.
          </p>
        </div>

        {/* Resource Sections - More Prominent */}
        <div className="mb-16 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 md:p-12 shadow-lg border-2 border-green-200">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center font-montserrat">Tài nguyên tham khảo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto">
            {resourceSections.map((section, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* Thumbnail */}
                    {section.iconType === 'image' ? (
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                          src={section.icon}
                          alt={section.title}
                          fill
                          className="object-contain rounded"
                          sizes="48px"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center text-2xl flex-shrink-0">
                        {section.icon}
                      </div>
                    )}
                    <h3 className="text-lg font-semibold text-gray-800">{section.title}</h3>
                  </div>
                  {expandedSections[index] ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </button>

                {expandedSections[index] && (
                  <div className="px-6 pb-4 pt-2 border-t bg-gray-50">
                    <div className="space-y-2">
                      {section.links.map((link, linkIndex) => (
                        <a
                          key={linkIndex}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline group"
                        >
                          <ExternalLink className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm">{link.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filters - Less Prominent */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-6 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm tài liệu, câu chuyện..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
              />
            </div>

            {/* Filter Toggle */}
            <Button
              variant="ghost"
              onClick={() => setShowFilters(!showFilters)}
              className="md:w-auto text-sm"
            >
              <Filter className="w-3 h-3 mr-2" />
              Bộ lọc
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
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
          <div className="flex justify-between items-center mb-6 max-w-4xl mx-auto">
            <p className="text-sm text-gray-500">
              Tìm thấy {pagination.total} tài liệu
              {searchTerm && ` cho "${searchTerm}"`}
            </p>
            <div className="text-xs text-gray-400">
              Trang {pagination.page} / {pagination.pages}
            </div>
          </div>
        )}

        {/* Content Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 max-w-6xl mx-auto">
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