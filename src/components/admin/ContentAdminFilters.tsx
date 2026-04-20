'use client'

import { Filter, Loader2, Search, X } from 'lucide-react'
import type { CategorySummary } from '@/types/category'

export interface AdminContentFilters {
  search: string
  category: string
  type: string
  status: string
}

interface ContentAdminFiltersProps {
  filters: AdminContentFilters
  searchInput: string
  categories: CategorySummary[]
  isLoading?: boolean
  onSearchInputChange: (value: string) => void
  onFilterChange: (filters: AdminContentFilters) => void
  onClear: () => void
}

const contentTypes = [
  { value: '', label: 'Tất cả loại' },
  { value: 'ARTICLE', label: 'Bài viết' },
  { value: 'DOCUMENT', label: 'Tài liệu' },
  { value: 'STORY', label: 'Điển hình' },
  { value: 'PROJECT_ACTIVITY', label: 'Hoạt động dự án' },
  { value: 'GUIDE', label: 'Hướng dẫn' },
  { value: 'POLICY', label: 'Chính sách' },
  { value: 'NEWS', label: 'Tin tức' },
  { value: 'EVENT', label: 'Sự kiện' },
]

const creatableContentTypeValues = new Set([
  '',
  'DOCUMENT',
  'STORY',
  'PROJECT_ACTIVITY',
  'POLICY',
  'NEWS',
  'EVENT',
])

const contentStatuses = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'PUBLISHED', label: 'Xuất bản' },
  { value: 'DRAFT', label: 'Bản nháp' },
  { value: 'ARCHIVED', label: 'Lưu trữ' },
]

export function ContentAdminFilters({
  filters,
  searchInput,
  categories,
  isLoading = false,
  onSearchInputChange,
  onFilterChange,
  onClear,
}: ContentAdminFiltersProps) {
  const hasActiveFilters = Boolean(filters.search || filters.category || filters.type || filters.status)

  const updateFilter = (key: keyof AdminContentFilters, value: string) => {
    onFilterChange({ ...filters, [key]: value })
  }

  return (
    <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Filter className="h-4 w-4 text-emerald-700" />
        Tìm kiếm và bộ lọc nội dung
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(240px,1.4fr)_1fr_1fr_1fr_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchInput}
            onChange={(event) => onSearchInputChange(event.target.value)}
            placeholder="Tìm theo tiêu đề, mô tả, tag, tác giả..."
            className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-10 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {isLoading && (
            <Loader2 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-emerald-700" />
          )}
        </div>

        <select
          value={filters.category}
          onChange={(event) => updateFilter('category', event.target.value)}
          className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.nameVi || category.nameEn || category.slug}
            </option>
          ))}
        </select>

        <select
          value={filters.type}
          onChange={(event) => updateFilter('type', event.target.value)}
          className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {contentTypes.filter((type) => creatableContentTypeValues.has(type.value)).map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(event) => updateFilter('status', event.target.value)}
          className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {contentStatuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onClear}
          disabled={!hasActiveFilters && !searchInput}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X className="h-4 w-4" />
          Xóa lọc
        </button>
      </div>
    </div>
  )
}
