import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const adminUsers = await prisma.user.findMany({
      where: {
        role: {
          in: ['ADMIN', 'MODERATOR']
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
      }
    });

    return NextResponse.json({
      success: true,
      count: adminUsers.length,
      users: adminUsers
    });

  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}