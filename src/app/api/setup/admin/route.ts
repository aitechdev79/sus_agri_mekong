import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    console.log('🔐 Setting up admin users...');

    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (existingAdmin) {
      return NextResponse.json({
        success: true,
        message: 'Admin users already exist',
        adminCount: await prisma.user.count({ where: { role: 'ADMIN' } })
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Create admin users
    const admin1 = await prisma.user.upsert({
      where: { email: 'admin@goodpractices.vn' },
      update: {
        password: hashedPassword,
        role: 'ADMIN',
        isVerified: true,
      },
      create: {
        name: 'Administrator',
        email: 'admin@goodpractices.vn',
        password: hashedPassword,
        role: 'ADMIN',
        province: 'Hồ Chí Minh',
        organization: 'Good Practices Platform',
        isVerified: true,
      },
    });

    const admin2 = await prisma.user.upsert({
      where: { email: 'an.nguyen@example.com' },
      update: {
        password: hashedPassword,
        role: 'ADMIN',
        isVerified: true,
      },
      create: {
        name: 'Nguyễn Văn An',
        email: 'an.nguyen@example.com',
        password: hashedPassword,
        role: 'ADMIN',
        province: 'An Giang',
        organization: 'Hợp tác xã nông nghiệp An Giang',
        isVerified: true,
      },
    });

    const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });

    console.log('✅ Admin users created successfully');

    return NextResponse.json({
      success: true,
      message: 'Admin users created successfully',
      adminCount,
      accounts: [
        { email: admin1.email, role: admin1.role },
        { email: admin2.email, role: admin2.role }
      ]
    });

  } catch (error) {
    console.error('❌ Error setting up admin users:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}