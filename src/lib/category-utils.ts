export const CATEGORY_SLUG_REGEX = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/

export function normalizeCategorySlug(input: string) {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-_]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function isValidCategorySlug(slug: string) {
  return CATEGORY_SLUG_REGEX.test(slug)
}

export function buildCategoryLabelMap(categories: Array<{ slug: string; nameVi: string }>) {
  return Object.fromEntries(categories.map((category) => [category.slug, category.nameVi]))
}
