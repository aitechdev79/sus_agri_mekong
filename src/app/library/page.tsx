'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import NavigationBar from '@/components/NavigationBar'
import Footer from '@/components/Footer'
import { SearchFilters } from '@/components/content/SearchFilters'
import { Search, Filter, ExternalLink, FileText, BarChart3, Globe2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LibraryContent } from '@/types/content'
import { usePublicCategories } from '@/hooks/use-public-categories'
import { usePathname } from 'next/navigation'
import { getLocaleFromPathname, pickLocalizedText, withLocalePrefix } from '@/lib/content-locale'

const quickAccessCards = [
  {
    id: 'policy',
    title: 'Chính sách và quy định',
    description: 'Cập nhật các chính sách, quy định và văn bản pháp luật liên quan đến doanh nghiệp',
    href: '/policy',
    icon: FileText,
    accentClassName: 'bg-[#FFB81C] text-[#3C3C3B]',
  },
  {
    id: 'reports',
    title: 'Nghiên cứu và Báo cáo',
    description: 'Khám phá các nghiên cứu, báo cáo và phân tích chuyên sâu về phát triển bền vững',
    href: '/reports',
    icon: BarChart3,
    accentClassName: 'bg-[#FFB81C] text-[#3C3C3B]',
  },
  {
    id: 'global',
    title: 'Thực hành tốt trên thế giới',
    description: 'Học hỏi từ các mô hình phát triển bền vững thành công của doanh nghiệp toàn cầu',
    href: '/global_best_practice',
    icon: Globe2,
    accentClassName: 'bg-[#FFB81C] text-[#3C3C3B]',
  },
  {
    id: 'vietnam',
    title: 'Thực hành tốt tại Việt Nam',
    description: 'Khám phá các điển hình ESG xuất sắc trong doanh nghiệp và cộng đồng Việt Nam',
    href: '/VN_best_practice',
    icon: Globe2,
    accentClassName: 'bg-[#FFB81C] text-[#3C3C3B]',
    imageIcon: '/VN map icon.png',
  },
] as const

const resourceSections = [
  {
    title: 'An toàn vệ sinh lao động',
    icon: '🦺',
    iconType: 'emoji' as const,
    links: [
      { title: 'ILO - Occupational Safety and Health', url: 'https://www.ilo.org/global/topics/safety-and-health-at-work/lang--en/index.htm' },
      { title: 'WHO - Occupational Health', url: 'https://www.who.int/health-topics/occupational-health' },
      { title: 'OSHA - Vietnam Safety Guidelines', url: 'https://www.osha.gov/international-cooperation' },
    ],
  },
  {
    title: 'ESG',
    icon: '/ESG_rice.jpg',
    iconType: 'image' as const,
    links: [
      { title: 'UN Global Compact - ESG Reporting', url: 'https://www.unglobalcompact.org/what-is-gc/our-work/environment' },
      { title: 'GRI Standards - Sustainability Reporting', url: 'https://www.globalreporting.org/standards/' },
      { title: 'SASB Standards - ESG Disclosure', url: 'https://www.sasb.org/standards/' },
    ],
  },
  {
    title: 'Chính sách và quy định',
    icon: '📋',
    iconType: 'emoji' as const,
    links: [
      { title: 'Luật Lao động Việt Nam 2019', url: 'https://thuvienphapluat.vn/van-ban/Lao-dong-Tien-luong/Bo-luat-lao-dong-2019-333670.aspx' },
      { title: 'Nghị định về An toàn lao động', url: 'https://thuvienphapluat.vn/tim-van-ban-phap-luat.html' },
      { title: 'Quy chuẩn ESG tại Việt Nam', url: 'https://www.ssc.gov.vn/' },
    ],
  },
  {
    title: 'Thực hành tốt trên thế giới',
    icon: '🌍',
    iconType: 'emoji' as const,
    links: [
      { title: 'ILO - Better Work Programme', url: 'https://betterwork.org/' },
      { title: 'Sustainable Agriculture Practices - FAO', url: 'https://www.fao.org/sustainability/en/' },
      { title: 'Global Good Agricultural Practices', url: 'https://www.globalgap.org/' },
    ],
  },
  {
    title: 'Thực hành tốt tại Việt Nam',
    icon: '/VN map icon.png',
    iconType: 'image' as const,
    links: [
      { title: 'VCCI - Doanh nghiệp bền vững', url: 'https://www.vcci.com.vn/' },
      { title: 'VnSAT - Nông nghiệp bền vững', url: 'https://www.vnsat.org.vn/' },
      { title: 'GRAISEA - Thực hành tốt Đông Nam Á', url: 'https://graisea.github.io/' },
    ],
  },
]

function getTypeLabel(type: string) {
  const typeMap: Record<string, string> = {
    STORY: 'Điển hình',
    GUIDE: 'Hướng dẫn',
    POLICY: 'Chính sách',
    ARTICLE: 'Bài viết',
    DOCUMENT: 'Tài liệu',
  }

  return typeMap[type] || type
}

function getTypeAccent(type: string) {
  const accentMap: Record<string, string> = {
    STORY: 'bg-[#E8F5E9] text-[#0A7029]',
    GUIDE: 'bg-[#E8EEF9] text-[#1D4ED8]',
    POLICY: 'bg-[#FDE7D2] text-[#C65A00]',
    ARTICLE: 'bg-[#E6F4FF] text-[#2563EB]',
    DOCUMENT: 'bg-[#F3E8FF] text-[#7C3AED]',
  }

  return accentMap[type] || 'bg-[#E8F5E9] text-[#0A7029]'
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default function LibraryPage() {
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname)
  const contentDetailPrefix = withLocalePrefix('/content', locale)
  const [contents, setContents] = useState<LibraryContent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })
  const { categoryLabels } = usePublicCategories()

  const loadContents = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pagination.limit.toString(),
        sort: 'newest',
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
  const getCategoryLabel = (category?: string | null) => {
    if (!category) return 'Chưa phân loại'
    return categoryLabels[category] || category
  }
  return (
    <div className="min-h-screen bg-vn-rice-white">
      <NavigationBar />

      <main className="pt-16">
        <section className="bg-vn-gold-light py-16">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="mb-4 font-montserrat text-sm font-semibold uppercase tracking-[0.22em] text-[#0A7029]">
                  Knowledge Hub
                </p>
                <h1 className="mb-6 font-montserrat text-4xl font-bold text-[#3C3C3B] md:text-5xl">
                  Thư viện nội dung cho hành trình phát triển bền vững
                </h1>
                <p className="max-w-3xl font-montserrat text-lg leading-relaxed text-[#5F6368]">
                  Tập hợp báo cáo, hướng dẫn, chính sách và các thực hành đáng chú ý để doanh nghiệp, tổ chức và nhà nghiên cứu có thể tra cứu nhanh, đọc sâu và áp dụng vào thực tiễn.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 shadow-sm">
                  <div className="mb-2 font-montserrat text-sm uppercase tracking-wide text-[#6B7280]">Tổng tài liệu</div>
                  <div className="font-montserrat text-4xl font-bold text-[#0A7029]">{pagination.total}</div>
                </div>
                <div className="bg-white p-5 shadow-sm">
                  <div className="mb-2 font-montserrat text-sm uppercase tracking-wide text-[#6B7280]">Nhóm nội dung</div>
                  <div className="font-montserrat text-4xl font-bold text-[#C28A00]">{quickAccessCards.length}</div>
                </div>
                <div className="bg-white p-5 shadow-sm">
                  <div className="mb-2 font-montserrat text-sm uppercase tracking-wide text-[#6B7280]">Trang hiện tại</div>
                  <div className="font-montserrat text-4xl font-bold text-[#3C3C3B]">{pagination.page}</div>
                </div>
                <div className="bg-white p-5 shadow-sm">
                  <div className="mb-2 font-montserrat text-sm uppercase tracking-wide text-[#6B7280]">Tài liệu / trang</div>
                  <div className="font-montserrat text-4xl font-bold text-[#3C3C3B]">{pagination.limit}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-vn-rice-white py-16">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {quickAccessCards.map((card) => {
                const Icon = card.icon

                return (
                  <Link
                    key={card.id}
                    href={withLocalePrefix(card.href, locale)}
                    className="group block overflow-hidden bg-white transition-all duration-500"
                    style={{
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    <div className="flex flex-col items-center p-6 text-center transition-transform duration-500 group-hover:scale-105">
                      <div
                        className={`mb-4 flex h-16 w-16 items-center justify-center transition-transform duration-500 ${card.accentClassName}`}
                      >
                        {'imageIcon' in card ? (
                          <Image
                            src={card.imageIcon}
                            alt="Vietnam map"
                            width={48}
                            height={48}
                          />
                        ) : (
                          <Icon className="h-10 w-10" />
                        )}
                      </div>
                      <h3 className="mb-3 font-montserrat text-lg font-bold text-[#3C3C3B] md:text-xl">
                        {card.title}
                      </h3>
                      <p className="font-montserrat text-sm leading-relaxed text-[#6B7280] md:text-base">
                        {card.description}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="mb-3 font-montserrat text-3xl font-bold text-[#3C3C3B] md:text-4xl">
                  Kho tài liệu
                </h2>
                <p className="max-w-3xl font-montserrat text-lg text-[#6B7280]">
                  Tìm theo chủ đề, loại nội dung hoặc truy cập trực tiếp các tài liệu mới nhất.
                </p>
              </div>

              <div className="text-sm font-montserrat text-[#6B7280]">
                {!loading && (
                  <span>
                    Tìm thấy {pagination.total} tài liệu
                    {searchTerm && ` cho "${searchTerm}"`}
                  </span>
                )}
              </div>
            </div>

            <div className="mb-10 border border-[#E5E7EB] bg-[#FAFAF7] p-5 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm tài liệu, câu chuyện, hướng dẫn..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full border border-gray-300 bg-white py-3 pl-11 pr-4 font-montserrat text-sm focus:outline-none focus:ring-1 focus:ring-[#0A7029]"
                  />
                </div>

                <Button
                  variant="ghost"
                  onClick={() => setShowFilters(!showFilters)}
                  className="border border-[#FFC107] bg-transparent px-5 py-3 font-montserrat text-sm font-semibold text-[#C28A00] hover:bg-[#FFF7DA]"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Bộ lọc
                </Button>
              </div>

              {showFilters && (
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <SearchFilters
                    selectedCategory={selectedCategory}
                    selectedType={selectedType}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              )}
            </div>

            {loading ? (
              <div className="overflow-hidden border border-[#E5E7EB] bg-white shadow-sm">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="animate-pulse border-b border-[#E5E7EB] px-5 py-4 last:border-b-0">
                    <div className="flex items-center gap-4">
                      <div className="h-6 w-8 bg-gray-200" />
                      <div className="flex-1">
                        <div className="mb-2 h-5 bg-gray-200" />
                        <div className="h-4 w-2/3 bg-gray-100" />
                      </div>
                      <div className="h-6 w-20 bg-gray-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : contents.length > 0 ? (
              <>
                <div className="overflow-hidden border border-[#E5E7EB] bg-white shadow-sm">
                  <div className="hidden grid-cols-[72px_minmax(0,1fr)_160px_140px] gap-4 border-b border-[#E5E7EB] bg-[#FAFAF7] px-5 py-3 text-sm font-semibold text-[#6B7280] md:grid">
                    <div>STT</div>
                    <div>Nội dung</div>
                    <div>Loại</div>
                    <div>Ngày tạo</div>
                  </div>

                  {contents.map((content, index) => {
                    const itemNumber = (currentPage - 1) * pagination.limit + index + 1
                    const localizedTitle = pickLocalizedText(locale, content.title, content.titleEn)
                    const localizedDescription = pickLocalizedText(locale, content.description, content.descriptionEn)

                    return (
                      <Link
                        key={content.id}
                        href={`${contentDetailPrefix}/${content.id}`}
                        className="group block border-b border-[#E5E7EB] px-5 py-4 last:border-b-0 hover:bg-[#FAFAF7]"
                        aria-label={`${localizedTitle} - ${localizedDescription || ''}`}
                      >
                        <div className="flex flex-col gap-3 md:grid md:grid-cols-[72px_minmax(0,1fr)_160px_140px] md:items-center md:gap-4">
                          <div className="font-montserrat text-base font-bold text-[#0A7029] md:text-lg">
                            {itemNumber.toString().padStart(2, '0')}
                          </div>

                          <div className="min-w-0">
                            <h3 className="mb-1 font-montserrat text-lg font-bold text-[#3C3C3B] transition-colors group-hover:text-[#0A7029]">
                              {localizedTitle}
                            </h3>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[#6B7280]">
                              <span>{getCategoryLabel(content.category)}</span>
                              {localizedDescription && (
                                <span className="max-w-2xl truncate">
                                  {localizedDescription}
                                </span>
                              )}
                            </div>
                          </div>

                          <div>
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold ${getTypeAccent(content.type)}`}>
                              {getTypeLabel(content.type)}
                            </span>
                          </div>

                          <div className="font-montserrat text-sm text-[#6B7280]">
                            {formatDate(content.createdAt)}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>

                {pagination.pages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`border p-2 ${
                          currentPage === 1 ? 'cursor-not-allowed text-gray-400' : 'hover:bg-gray-100'
                        }`}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                        const page = i + Math.max(1, currentPage - 2)
                        if (page > pagination.pages) return null

                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`border px-4 py-2 font-montserrat text-sm ${
                              currentPage === page
                                ? 'border-[#0A7029] bg-[#0A7029] text-white'
                                : 'hover:bg-gray-100'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      })}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === pagination.pages}
                        className={`border p-2 ${
                          currentPage === pagination.pages ? 'cursor-not-allowed text-gray-400' : 'hover:bg-gray-100'
                        }`}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="py-16 text-center">
                <p className="mb-2 font-montserrat text-lg text-[#6B7280]">
                  {searchTerm || selectedCategory || selectedType
                    ? 'Không tìm thấy tài liệu phù hợp'
                    : 'Chưa có tài liệu nào'}
                </p>
                <p className="font-montserrat text-sm text-[#9CA3AF]">
                  {searchTerm || selectedCategory || selectedType
                    ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.'
                    : 'Vui lòng quay lại sau để khám phá thêm tài liệu mới.'}
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="bg-vn-rice-white py-16">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="mb-12">
              <h2 className="mb-4 font-montserrat text-3xl font-bold text-[#3C3C3B] md:text-4xl">
                Tài nguyên tham khảo
              </h2>
              <p className="max-w-3xl font-montserrat text-lg text-[#6B7280]">
                Một số nguồn tra cứu nhanh để mở rộng việc học tập và đối chiếu thông tin.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {resourceSections.map((section, index) => (
                <div key={index} className="bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center gap-4">
                    {section.iconType === 'image' ? (
                      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden bg-gray-100">
                        <Image
                          src={section.icon}
                          alt={section.title}
                          fill
                          className="object-contain"
                          sizes="56px"
                        />
                      </div>
                    ) : (
                      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center bg-[#FFF7DA] text-2xl">
                        {section.icon}
                      </div>
                    )}

                    <h3 className="font-montserrat text-xl font-bold text-[#3C3C3B]">
                      {section.title}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <a
                        key={linkIndex}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-3 border-t border-gray-100 pt-3 text-[#2563EB] hover:text-[#1D4ED8]"
                      >
                        <ExternalLink className="mt-0.5 h-4 w-4 flex-shrink-0" />
                        <span className="font-montserrat text-sm leading-relaxed group-hover:underline">
                          {link.title}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
