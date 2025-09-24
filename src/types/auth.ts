import { User as PrismaUser } from "@prisma/client"

export type UserRole = "USER" | "MODERATOR" | "ADMIN"

export interface User extends Omit<PrismaUser, 'password'> {
  role: UserRole
}

declare module "next-auth" {
  interface Session {
    user: User & {
      id: string
    }
  }

  interface User {
    role: UserRole
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole
  }
}