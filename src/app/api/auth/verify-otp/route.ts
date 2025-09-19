import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { phone, code } = await request.json()

    const otpRecord = await prisma.oTPVerification.findFirst({
      where: {
        phone,
        code,
        verified: false,
        expires: {
          gt: new Date()
        }
      }
    })

    if (!otpRecord) {
      return NextResponse.json(
        { message: 'Mã OTP không hợp lệ hoặc đã hết hạn' },
        { status: 400 }
      )
    }

    await prisma.oTPVerification.update({
      where: { id: otpRecord.id },
      data: { verified: true }
    })

    await prisma.user.update({
      where: { phone },
      data: { isVerified: true }
    })

    return NextResponse.json(
      { message: 'Xác thực thành công' },
      { status: 200 }
    )
  } catch (error) {
    console.error('OTP verification error:', error)
    return NextResponse.json(
      { message: 'Đã xảy ra lỗi khi xác thực OTP' },
      { status: 500 }
    )
  }
}