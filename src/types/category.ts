export interface CategorySummary {
  id: string
  slug: string
  name: string
  nameVi: string
  nameEn?: string | null
  isActive: boolean
  displayOrder: number
  count: number
  createdAt?: string
  updatedAt?: string
}

export interface CategoryLabelMap {
  [slug: string]: string
}
