import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-middleware'

function normalizeOptional(value: unknown): string | null {
  const text = String(value ?? '').trim()
  return text.length ? text : null
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request)

    if (!admin) {
      return NextResponse.json(
        { error: 'Chỉ ADMIN mới được xem danh sách người dùng' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')?.trim()

    const users = await prisma.user.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search, mode: 'insensitive' } },
              { province: { contains: search, mode: 'insensitive' } },
              { organization: { contains: search, mode: 'insensitive' } }
            ]
          }
        : undefined,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        province: true,
        organization: true,
        isVerified: true,
        createdAt: true,
        _count: {
          select: {
            contents: true,
            submissions: true,
            comments: true,
            bookmarks: true
          }
        }
      },
      orderBy: [
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({
      users
    })
  } catch (error) {
    console.error('Admin users fetch error:', error)
    return NextResponse.json(
      { error: 'Không thể tải danh sách người dùng' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request)

    if (!admin) {
      return NextResponse.json(
        { error: 'Chỉ ADMIN mới được tạo tài khoản' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const name = String(body.name ?? '').trim()
    const email = String(body.email ?? '').trim().toLowerCase()
    const phone = normalizeOptional(body.phone)
    const province = normalizeOptional(body.province)
    const organization = normalizeOptional(body.organization)
    const password = String(body.password ?? '')
    const role = String(body.role ?? '').trim().toUpperCase() === 'BUSINESS' ? 'BUSINESS' : 'USER'
    const isVerified = body.isVerified === undefined ? true : Boolean(body.isVerified)
    const createPartnerProfile = role === 'BUSINESS' && Boolean(body.createPartnerProfile)
    const companyName = String(body.companyName || organization || name).trim()

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    if (role === 'BUSINESS' && !organization) {
      return NextResponse.json({ error: 'Organization is required for business accounts' }, { status: 400 })
    }

    if (createPartnerProfile && !companyName) {
      return NextResponse.json({ error: 'Company name is required for partner profile' }, { status: 400 })
    }

    const existingEmail = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    if (existingEmail) {
      return NextResponse.json({ error: 'Email is already used' }, { status: 409 })
    }

    if (phone) {
      const existingPhone = await prisma.user.findUnique({
        where: { phone },
        select: { id: true },
      })

      if (existingPhone) {
        return NextResponse.json({ error: 'Phone number is already used' }, { status: 409 })
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const result = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          name,
          email,
          phone,
          password: hashedPassword,
          province,
          organization,
          role,
          isVerified,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          province: true,
          organization: true,
          isVerified: true,
          createdAt: true,
          _count: {
            select: {
              contents: true,
              submissions: true,
              comments: true,
              bookmarks: true,
            },
          },
        },
      })

      if (!createPartnerProfile) {
        return { user: createdUser, partner: null }
      }

      const baseSlug = slugify(String(body.slug || companyName))
      if (!baseSlug) {
        throw new Error('Invalid partner slug')
      }

      const existingSlug = await tx.businessProfile.findUnique({
        where: { slug: baseSlug },
        select: { id: true },
      })

      const partner = await tx.businessProfile.create({
        data: {
          ownerUserId: createdUser.id,
          companyName,
          slug: existingSlug ? `${baseSlug}-${Date.now()}` : baseSlug,
          contactEmail: email,
          phone,
          province,
          status: 'APPROVED',
          isPublic: true,
          isVerified: true,
          displayOrder: Number.isFinite(Number(body.displayOrder)) ? Math.trunc(Number(body.displayOrder)) : 0,
          reviewedById: admin.id,
          reviewedAt: new Date(),
        },
      })

      return { user: createdUser, partner }
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Admin user create error:', error)
    const message = error instanceof Error && error.message === 'Invalid partner slug'
      ? 'Invalid partner slug'
      : 'Failed to create user'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
