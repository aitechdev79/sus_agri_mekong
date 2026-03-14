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

function getCategoryRouteErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2021' || error.code === 'P2022') {
      return 'Bang Category chua co trong DB. Hay chay migration moi nhat.'
    }

    if (error.code === 'P2002') {
      return 'Slug da ton tai'
    }
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return 'Khong the ket noi database'
  }

  return fallback
}

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
      { error: getCategoryRouteErrorMessage(error, 'Khong the tai danh muc') },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin(request)

    if (!user) {
      return NextResponse.json({ error: 'Chi ADMIN moi duoc tao danh muc' }, { status: 401 })
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
      return NextResponse.json({ error: 'Slug la bat buoc' }, { status: 400 })
    }

    if (!isValidCategorySlug(slug)) {
      return NextResponse.json(
        { error: 'Slug chi duoc chua chu thuong, so, dau gach ngang hoac underscore' },
        { status: 400 }
      )
    }

    if (!nameVi) {
      return NextResponse.json({ error: 'Ten danh muc la bat buoc' }, { status: 400 })
    }

    if (!Number.isFinite(displayOrder)) {
      return NextResponse.json({ error: 'Thu tu hien thi khong hop le' }, { status: 400 })
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

    return NextResponse.json(
      {
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
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Admin category create error:', error)
    const status =
      error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002' ? 409 : 500

    return NextResponse.json(
      { error: getCategoryRouteErrorMessage(error, 'Khong the tao danh muc') },
      { status }
    )
  }
}
