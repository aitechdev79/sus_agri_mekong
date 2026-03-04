import { NextResponse } from 'next/server'
import { ensureDefaultCategories, getPublicCategories } from '@/lib/category-taxonomy'

export async function GET() {
  try {
    await ensureDefaultCategories()
    const data = await getPublicCategories()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Categories fetch error:', error)
    return NextResponse.json(
      { error: 'Khong the tai danh muc' },
      { status: 500 }
    )
  }
}
