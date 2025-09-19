import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { generateOTP, sendSMS } from '@/lib/otp'

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

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        province,
        organization,
      }
    })

    const otpCode = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await prisma.oTPVerification.create({
      data: {
        phone,
        code: otpCode,
        expires: expiresAt,
      }
    })

    await sendSMS(phone, `Mã xác thực của bạn là: ${otpCode}. Mã này có hiệu lực trong 10 phút.`)

    return NextResponse.json(
      { message: 'Đăng ký thành công. Vui lòng kiểm tra tin nhắn để xác thực số điện thoại.' },
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