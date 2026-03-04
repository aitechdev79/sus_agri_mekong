import { CategoryAuditAction } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { buildCategoryLabelMap, CATEGORY_SLUG_REGEX, isValidCategorySlug, normalizeCategorySlug } from '@/lib/category-utils'

export const DEFAULT_CATEGORIES = [
  { slug: 'shrimp_farming', nameVi: 'Nuôi tôm', nameEn: 'Shrimp Farming', displayOrder: 10 },
  { slug: 'shrimp_processing', nameVi: 'Chế biến tôm', nameEn: 'Shrimp Processing', displayOrder: 20 },
  { slug: 'shrimp_export', nameVi: 'Xuất khẩu tôm', nameEn: 'Shrimp Export', displayOrder: 30 },
  { slug: 'rice_cultivation', nameVi: 'Trồng lúa', nameEn: 'Rice Cultivation', displayOrder: 40 },
  { slug: 'rice_processing', nameVi: 'Chế biến lúa', nameEn: 'Rice Processing', displayOrder: 50 },
  { slug: 'rice_marketing', nameVi: 'Tiếp thị lúa', nameEn: 'Rice Marketing', displayOrder: 60 },
  { slug: 'sustainable_practices', nameVi: 'Thực hành bền vững', nameEn: 'Sustainable Practices', displayOrder: 70 },
  { slug: 'technology_innovation', nameVi: 'Công nghệ và đổi mới', nameEn: 'Technology & Innovation', displayOrder: 80 },
  { slug: 'financial_support', nameVi: 'Hỗ trợ tài chính', nameEn: 'Financial Support', displayOrder: 90 },
  { slug: 'market_access', nameVi: 'Tiếp cận thị trường', nameEn: 'Market Access', displayOrder: 100 },
  { slug: 'policy_guidelines', nameVi: 'Chính sách và hướng dẫn', nameEn: 'Policy & Guidelines', displayOrder: 110 },
  { slug: 'success_stories', nameVi: 'Câu chuyện thành công', nameEn: 'Success Stories', displayOrder: 120 }
] as const

export { buildCategoryLabelMap, CATEGORY_SLUG_REGEX, isValidCategorySlug, normalizeCategorySlug }

export async function ensureDefaultCategories() {
  for (const category of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        nameVi: category.nameVi,
        nameEn: category.nameEn,
        displayOrder: category.displayOrder
      },
      create: {
        slug: category.slug,
        nameVi: category.nameVi,
        nameEn: category.nameEn,
        displayOrder: category.displayOrder,
        isActive: true
      }
    })
  }
}

export async function getPublicCategories() {
  const [categories, groupedCounts] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: 'asc' }, { nameVi: 'asc' }]
    }),
    prisma.content.groupBy({
      by: ['category'],
      where: {
        status: 'PUBLISHED',
        isPublic: true
      },
      _count: {
        id: true
      }
    })
  ])

  const counts = new Map(groupedCounts.map((item) => [item.category, item._count.id]))

  const normalized = categories.map((category) => ({
    id: category.id,
    slug: category.slug,
    name: category.slug,
    nameVi: category.nameVi,
    nameEn: category.nameEn,
    isActive: category.isActive,
    displayOrder: category.displayOrder,
    count: counts.get(category.slug) ?? 0,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString()
  }))

  return {
    categories: normalized,
    total: normalized.reduce((sum, category) => sum + category.count, 0)
  }
}

export async function getAdminCategories() {
  const [categories, groupedCounts] = await Promise.all([
    prisma.category.findMany({
      orderBy: [{ displayOrder: 'asc' }, { nameVi: 'asc' }]
    }),
    prisma.content.groupBy({
      by: ['category'],
      _count: {
        id: true
      }
    })
  ])

  const counts = new Map(groupedCounts.map((item) => [item.category, item._count.id]))

  return categories.map((category) => ({
    id: category.id,
    slug: category.slug,
    name: category.slug,
    nameVi: category.nameVi,
    nameEn: category.nameEn,
    isActive: category.isActive,
    displayOrder: category.displayOrder,
    count: counts.get(category.slug) ?? 0,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString()
  }))
}

export async function writeCategoryAuditLog(input: {
  categoryId?: string | null
  performedById?: string | null
  action: CategoryAuditAction
  beforeData?: unknown
  afterData?: unknown
}) {
  const beforeData = input.beforeData === undefined ? undefined : JSON.parse(JSON.stringify(input.beforeData))
  const afterData = input.afterData === undefined ? undefined : JSON.parse(JSON.stringify(input.afterData))

  await prisma.categoryAuditLog.create({
    data: {
      categoryId: input.categoryId ?? null,
      performedById: input.performedById ?? null,
      action: input.action,
      beforeData: beforeData as never,
      afterData: afterData as never
    }
  })
}
