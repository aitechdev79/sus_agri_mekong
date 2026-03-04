import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password, province, organization } = await request.json()

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email đã được sử dụng' },
        { status: 400 }
      )
    }

    if (phone) {
      const existingPhone = await prisma.user.findUnique({
        where: { phone }
      })

      if (existingPhone) {
        return NextResponse.json(
          { message: 'Số điện thoại đã được sử dụng' },
          { status: 400 }
        )
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        password: hashedPassword,
        province,
        organization,
        isVerified: true,
      }
    })

    return NextResponse.json(
      { message: 'Đăng ký thành công. Vui lòng đăng nhập.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Đã xảy ra lỗi khi đăng ký' },
      { status: 500 }
    )
  }
}
