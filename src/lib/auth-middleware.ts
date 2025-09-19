import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { prisma } from '@/lib/prisma'

export async function requireAuth(request: NextRequest) {
  const token = await getToken({ req: request })

  if (!token?.sub) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: token.sub },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isVerified: true
    }
  })

  return user
}

export async function requireAdmin(request: NextRequest) {
  const user = await requireAuth(request)

  if (!user || user.role !== 'ADMIN') {
    return null
  }

  return user
}

export async function requireModerator(request: NextRequest) {
  const user = await requireAuth(request)

  if (!user || (user.role !== 'ADMIN' && user.role !== 'MODERATOR')) {
    return null
  }

  return user
}