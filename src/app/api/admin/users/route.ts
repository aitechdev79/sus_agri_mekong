import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-middleware'

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
