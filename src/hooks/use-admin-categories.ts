'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { CategorySummary } from '@/types/category'
import { buildCategoryLabelMap } from '@/lib/category-utils'

function sortCategories(categories: CategorySummary[]) {
  return [...categories].sort((a, b) => {
    if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder
    return a.nameVi.localeCompare(b.nameVi, 'vi')
  })
}

export function useAdminCategories(enabled = true) {
  const [categories, setCategories] = useState<CategorySummary[]>([])
  const [loading, setLoading] = useState(enabled)

  const loadCategories = useCallback(async () => {
    if (!enabled) return

    try {
      setLoading(true)
      const response = await fetch('/api/admin/categories')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Không thể tải danh mục')
      }

      setCategories(sortCategories(data.categories || []))
    } catch (error) {
      console.error('Admin category load error:', error)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }, [enabled])

  useEffect(() => {
    if (enabled) {
      loadCategories()
    }
  }, [enabled, loadCategories])

  const categoryLabels = useMemo(() => buildCategoryLabelMap(categories), [categories])

  const upsertCategory = useCallback((category: CategorySummary) => {
    setCategories((current) => {
      const next = current.some((item) => item.id === category.id)
        ? current.map((item) => (item.id === category.id ? category : item))
        : [...current, category]

      return sortCategories(next)
    })
  }, [])

  return {
    categories,
    categoryLabels,
    loading,
    setCategories,
    loadCategories,
    upsertCategory
  }
}
