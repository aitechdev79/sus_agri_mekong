import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import {
  isValidCategorySlug,
  normalizeCategorySlug,
  writeCategoryAuditLog
} from '@/lib/category-taxonomy'
import { requireAdmin } from '@/lib/auth-middleware'

interface RouteParams {
  params: Promise<{ id: string }>
}

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

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAdmin(request)

    if (!user) {
      return NextResponse.json({ error: 'Chi ADMIN moi duoc cap nhat danh muc' }, { status: 401 })
    }

    const { id } = await params
    const existing = await prisma.category.findUnique({ where: { id } })

    if (!existing) {
      return NextResponse.json({ error: 'Khong tim thay danh muc' }, { status: 404 })
    }

    const body = await request.json()
    const slug = normalizeCategorySlug(body.slug || existing.slug)
    const nameVi = (body.nameVi || '').trim()
    const nameEn = body.nameEn?.trim() || null
    const displayOrder =
      body.displayOrder === '' || body.displayOrder === null || body.displayOrder === undefined
        ? 0
        : Number(body.displayOrder)
    const nextIsActive = body.isActive === undefined ? existing.isActive : Boolean(body.isActive)
    const usageCount = await prisma.content.count({
      where: { category: existing.slug }
    })

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

    if (existing.slug !== slug && usageCount > 0) {
      return NextResponse.json(
        { error: 'Danh muc dang duoc su dung. Chi nen doi ten hien thi, khong doi slug.' },
        { status: 409 }
      )
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        slug,
        nameVi,
        nameEn,
        displayOrder: Math.trunc(displayOrder),
        isActive: nextIsActive
      }
    })

    await writeCategoryAuditLog({
      categoryId: updated.id,
      performedById: user.id,
      action: nextIsActive !== existing.isActive ? (nextIsActive ? 'ACTIVATE' : 'DEACTIVATE') : 'UPDATE',
      beforeData: existing,
      afterData: updated
    })

    return NextResponse.json({
      category: {
        id: updated.id,
        slug: updated.slug,
        name: updated.slug,
        nameVi: updated.nameVi,
        nameEn: updated.nameEn,
        isActive: updated.isActive,
        displayOrder: updated.displayOrder,
        count: existing.slug === updated.slug ? usageCount : 0,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString()
      }
    })
  } catch (error) {
    console.error('Admin category update error:', error)
    const status =
      error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002' ? 409 : 500

    return NextResponse.json(
      { error: getCategoryRouteErrorMessage(error, 'Khong the cap nhat danh muc') },
      { status }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAdmin(request)

    if (!user) {
      return NextResponse.json({ error: 'Chi ADMIN moi duoc xoa danh muc' }, { status: 401 })
    }

    const { id } = await params
    const existing = await prisma.category.findUnique({ where: { id } })

    if (!existing) {
      return NextResponse.json({ error: 'Khong tim thay danh muc' }, { status: 404 })
    }

    const usageCount = await prisma.content.count({
      where: { category: existing.slug }
    })

    if (usageCount > 0) {
      return NextResponse.json(
        { error: 'Danh muc dang duoc su dung. Hay deactivate thay vi xoa.' },
        { status: 409 }
      )
    }

    await prisma.category.delete({ where: { id } })

    await writeCategoryAuditLog({
      categoryId: existing.id,
      performedById: user.id,
      action: 'DELETE',
      beforeData: {
        ...existing,
        usageCount
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin category delete error:', error)
    return NextResponse.json(
      { error: getCategoryRouteErrorMessage(error, 'Khong the xoa danh muc') },
      { status: 500 }
    )
  }
}
