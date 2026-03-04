import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import {
  ensureDefaultCategories,
  getAdminCategories,
  isValidCategorySlug,
  normalizeCategorySlug,
  writeCategoryAuditLog
} from '@/lib/category-taxonomy'
import { requireAdmin, requireModerator } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    const user = await requireModerator(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await ensureDefaultCategories()
    const categories = await getAdminCategories()
    const query = request.nextUrl.searchParams.get('q')?.trim().toLowerCase()

    const filtered = query
      ? categories.filter((category) => {
          const haystack = `${category.slug} ${category.nameVi} ${category.nameEn || ''}`.toLowerCase()
          return haystack.includes(query)
        })
      : categories

    return NextResponse.json({ categories: filtered })
  } catch (error) {
    console.error('Admin categories fetch error:', error)
    return NextResponse.json(
      { error: 'Không thể tải danh mục' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const slug = normalizeCategorySlug(body.slug || '')
    const nameVi = (body.nameVi || '').trim()
    const nameEn = body.nameEn?.trim() || null
    const displayOrder =
      body.displayOrder === '' || body.displayOrder === null || body.displayOrder === undefined
        ? 0
        : Number(body.displayOrder)

    if (!slug) {
      return NextResponse.json({ error: 'Slug là bắt buộc' }, { status: 400 })
    }

    if (!isValidCategorySlug(slug)) {
      return NextResponse.json(
        { error: 'Slug chỉ được chứa chữ thường, số, dấu gạch ngang hoặc underscore' },
        { status: 400 }
      )
    }

    if (!nameVi) {
      return NextResponse.json({ error: 'Tên danh mục là bắt buộc' }, { status: 400 })
    }

    if (!Number.isFinite(displayOrder)) {
      return NextResponse.json({ error: 'Thứ tự hiển thị không hợp lệ' }, { status: 400 })
    }

    const created = await prisma.category.create({
      data: {
        slug,
        nameVi,
        nameEn,
        displayOrder: Math.trunc(displayOrder),
        isActive: body.isActive !== false
      }
    })

    await writeCategoryAuditLog({
      categoryId: created.id,
      performedById: user.id,
      action: 'CREATE',
      afterData: created
    })

    return NextResponse.json({
      category: {
        id: created.id,
        slug: created.slug,
        name: created.slug,
        nameVi: created.nameVi,
        nameEn: created.nameEn,
        isActive: created.isActive,
        displayOrder: created.displayOrder,
        count: 0,
        createdAt: created.createdAt.toISOString(),
        updatedAt: created.updatedAt.toISOString()
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Admin category create error:', error)

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'Slug đã tồn tại' }, { status: 409 })
    }

    return NextResponse.json(
      { error: 'Không thể tạo danh mục' },
      { status: 500 }
    )
  }
}
