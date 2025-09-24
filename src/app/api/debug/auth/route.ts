import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password required'
      }, { status: 400 });
    }

    console.log('🔍 Debug auth attempt for:', email);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        isVerified: true,
        createdAt: true
      }
    });

    if (!user) {
      console.log('❌ User not found:', email);
      return NextResponse.json({
        success: false,
        error: 'User not found',
        debug: {
          email,
          userExists: false
        }
      });
    }

    console.log('✅ User found:', {
      id: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      hasPassword: !!user.password
    });

    // Check password
    if (!user.password) {
      console.log('❌ User has no password set');
      return NextResponse.json({
        success: false,
        error: 'User has no password set',
        debug: {
          email,
          userExists: true,
          hasPassword: false,
          role: user.role
        }
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log('🔐 Password check:', {
      isValid: isPasswordValid,
      providedPassword: password,
      hashedLength: user.password.length
    });

    return NextResponse.json({
      success: isPasswordValid,
      debug: {
        email,
        userExists: true,
        hasPassword: true,
        passwordValid: isPasswordValid,
        role: user.role,
        isVerified: user.isVerified,
        userId: user.id
      }
    });

  } catch (error) {
    console.error('❌ Auth debug error:', error);
    return NextResponse.json({
      success: false,
      error: 'Debug auth failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Test database connection
    const userCount = await prisma.user.count();
    const adminCount = await prisma.user.count({
      where: { role: 'ADMIN' }
    });

    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
        password: true // Include password to check if it exists
      }
    });

    return NextResponse.json({
      success: true,
      database: {
        connected: true,
        totalUsers: userCount,
        adminUsers: adminCount
      },
      admins: admins.map(admin => ({
        ...admin,
        hasPassword: !!admin.password,
        passwordLength: admin.password?.length || 0,
        password: undefined // Don't expose actual password
      }))
    });

  } catch (error) {
    console.error('❌ Database connection error:', error);
    return NextResponse.json({
      success: false,
      database: {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 });
  }
}