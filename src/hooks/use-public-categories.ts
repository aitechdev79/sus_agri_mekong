'use client'

import { useEffect, useMemo, useState } from 'react'
import type { CategorySummary } from '@/types/category'
import { buildCategoryLabelMap } from '@/lib/category-utils'

export function usePublicCategories() {
  const [categories, setCategories] = useState<CategorySummary[]>([])

  useEffect(() => {
    let cancelled = false

    const loadCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()

        if (!response.ok || cancelled) {
          return
        }

        setCategories(data.categories || [])
      } catch (error) {
        console.error('Public category load error:', error)
      }
    }

    loadCategories()

    return () => {
      cancelled = true
    }
  }, [])

  const categoryLabels = useMemo(() => buildCategoryLabelMap(categories), [categories])

  return {
    categories,
    categoryLabels
  }
}
