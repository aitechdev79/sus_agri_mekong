'use client'

import { useEffect, useMemo, useState } from 'react'
import { Pencil, Power, Search, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CategorySummary } from '@/types/category'
import { normalizeCategorySlug } from '@/lib/category-utils'

interface CategoryManagerProps {
  categories?: CategorySummary[]
  onCategoriesChange?: (categories: CategorySummary[]) => void
}

function sortCategories(categories: CategorySummary[]) {
  return [...categories].sort((a, b) => {
    if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder
    return a.nameVi.localeCompare(b.nameVi, 'vi')
  })
}

export function CategoryManager({ categories = [], onCategoriesChange }: CategoryManagerProps) {
  const [loading, setLoading] = useState(categories.length === 0)
  const [saving, setSaving] = useState(false)
  const [query, setQuery] = useState('')
  const [localCategories, setLocalCategories] = useState<CategorySummary[]>(categories)
  const [editingCategory, setEditingCategory] = useState<CategorySummary | null>(null)
  const [formState, setFormState] = useState({
    slug: '',
    nameVi: '',
    nameEn: '',
    displayOrder: 10,
    isActive: true
  })

  useEffect(() => {
    setLocalCategories(categories)
    setLoading(categories.length === 0)
  }, [categories])

  useEffect(() => {
    if (categories.length > 0) return

    const loadCategories = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/categories')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Không thể tải danh mục')
        }

        const nextCategories = sortCategories(data.categories || [])
        setLocalCategories(nextCategories)
        onCategoriesChange?.(nextCategories)
      } catch (error) {
        console.error('Category manager fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [categories.length, onCategoriesChange])

  const filteredCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return localCategories

    return localCategories.filter((category) => {
      const haystack = `${category.slug} ${category.nameVi} ${category.nameEn || ''}`.toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [localCategories, query])

  const resetForm = () => {
    const suggestedDisplayOrder =
      localCategories.length > 0 ? Math.max(...localCategories.map((category) => category.displayOrder), 0) + 10 : 10

    setFormState({
      slug: '',
      nameVi: '',
      nameEn: '',
      displayOrder: suggestedDisplayOrder,
      isActive: true
    })
    setEditingCategory(null)
  }

  const openCreate = () => {
    resetForm()
  }

  const openEdit = (category: CategorySummary) => {
    setEditingCategory(category)
    setFormState({
      slug: category.slug,
      nameVi: category.nameVi,
      nameEn: category.nameEn || '',
      displayOrder: category.displayOrder,
      isActive: category.isActive
    })
  }

  const syncCategories = (nextCategories: CategorySummary[]) => {
    const sorted = sortCategories(nextCategories)
    setLocalCategories(sorted)
    onCategoriesChange?.(sorted)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(
        editingCategory ? `/api/admin/categories/${editingCategory.id}` : '/api/admin/categories',
        {
          method: editingCategory ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...formState,
            slug: normalizeCategorySlug(formState.slug)
          })
        }
      )

      const data = await response.json()
      if (!response.ok) {
        alert(data.error || 'Không thể lưu danh mục')
        return
      }

      if (editingCategory) {
        syncCategories(localCategories.map((category) => (category.id === data.category.id ? data.category : category)))
      } else {
        syncCategories([...localCategories, data.category])
      }

      resetForm()
    } catch (error) {
      console.error('Category save error:', error)
      alert('Không thể lưu danh mục')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (category: CategorySummary) => {
    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          slug: category.slug,
          nameVi: category.nameVi,
          nameEn: category.nameEn || '',
          displayOrder: category.displayOrder,
          isActive: !category.isActive
        })
      })

      const data = await response.json()
      if (!response.ok) {
        alert(data.error || 'Không thể cập nhật trạng thái')
        return
      }

      syncCategories(localCategories.map((item) => (item.id === category.id ? data.category : item)))
    } catch (error) {
      console.error('Category toggle error:', error)
      alert('Không thể cập nhật trạng thái')
    }
  }

  const handleDelete = async (category: CategorySummary) => {
    if (!confirm(`Xóa danh mục "${category.nameVi}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'DELETE'
      })
      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Không thể xóa danh mục')
        return
      }

      syncCategories(localCategories.filter((item) => item.id !== category.id))
      if (editingCategory?.id === category.id) {
        resetForm()
      }
    } catch (error) {
      console.error('Category delete error:', error)
      alert('Không thể xóa danh mục')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý danh mục</h2>
          <p className="text-sm text-gray-600">Admin có thể tạo, sửa, khóa và xóa danh mục chưa được sử dụng.</p>
        </div>
        <Button type="button" onClick={openCreate}>
          Tạo danh mục
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="border-b px-5 py-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm theo tên hoặc slug"
                className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-sm font-medium text-gray-700">Danh mục</th>
                  <th className="px-5 py-3 text-left text-sm font-medium text-gray-700">Slug</th>
                  <th className="px-5 py-3 text-left text-sm font-medium text-gray-700">Thứ tự</th>
                  <th className="px-5 py-3 text-left text-sm font-medium text-gray-700">Số nội dung</th>
                  <th className="px-5 py-3 text-left text-sm font-medium text-gray-700">Trạng thái</th>
                  <th className="px-5 py-3 text-left text-sm font-medium text-gray-700">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="border-b align-top">
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-900">{category.nameVi}</div>
                      {category.nameEn && <div className="text-sm text-gray-500">{category.nameEn}</div>}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700">{category.slug}</td>
                    <td className="px-5 py-4 text-sm text-gray-700">{category.displayOrder}</td>
                    <td className="px-5 py-4 text-sm text-gray-700">{category.count}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {category.isActive ? 'Đang hoạt động' : 'Đã khóa'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(category)}
                          className="rounded p-2 text-blue-600 hover:bg-blue-50"
                          title="Sửa"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(category)}
                          className="rounded p-2 text-amber-600 hover:bg-amber-50"
                          title={category.isActive ? 'Ngừng hoạt động' : 'Kích hoạt'}
                        >
                          <Power className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(category)}
                          disabled={category.count > 0}
                          className="rounded p-2 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:text-gray-300"
                          title={category.count > 0 ? 'Danh mục đang được sử dụng' : 'Xóa'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!loading && filteredCategories.length === 0 && (
              <div className="px-5 py-10 text-center text-sm text-gray-500">Không tìm thấy danh mục nào.</div>
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-gray-900">{editingCategory ? 'Sửa danh mục' : 'Tạo danh mục'}</h3>
            <p className="text-sm text-gray-600">Slug nên cố định sau khi đưa vào sử dụng. Khi cần đổi tên, ưu tiên sửa label.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Tên danh mục *</label>
              <input
                type="text"
                value={formState.nameVi}
                onChange={(event) =>
                  setFormState((current) => {
                    const nextNameVi = event.target.value
                    const shouldSyncSlug = !current.slug || current.slug === normalizeCategorySlug(current.nameVi)
                    return {
                      ...current,
                      nameVi: nextNameVi,
                      slug: shouldSyncSlug ? normalizeCategorySlug(nextNameVi) : current.slug
                    }
                  })
                }
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Slug *</label>
              <input
                type="text"
                value={formState.slug}
                onChange={(event) => setFormState((current) => ({ ...current, slug: normalizeCategorySlug(event.target.value) }))}
                required
                pattern="[a-z0-9]+(?:[-_][a-z0-9]+)*"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Tên tiếng Anh</label>
              <input
                type="text"
                value={formState.nameEn}
                onChange={(event) => setFormState((current) => ({ ...current, nameEn: event.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Thứ tự hiển thị</label>
              <input
                type="number"
                value={formState.displayOrder}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, displayOrder: Number(event.target.value || 0) }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={formState.isActive}
                onChange={(event) => setFormState((current) => ({ ...current, isActive: event.target.checked }))}
                className="rounded border-gray-300"
              />
              Đang hoạt động
            </label>

            <div className="flex justify-end gap-3 border-t pt-4">
              {editingCategory && (
                <Button type="button" variant="ghost" onClick={resetForm}>
                  Hủy chỉnh sửa
                </Button>
              )}
              <Button type="submit" disabled={saving}>
                {saving ? 'Đang lưu...' : editingCategory ? 'Cập nhật' : 'Tạo danh mục'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
