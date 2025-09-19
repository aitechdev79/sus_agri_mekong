import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('🔐 Auth attempt:', credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials');
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user) {
          console.log('❌ User not found:', credentials.email);
          return null
        }

        console.log('✅ User found:', user.email, 'Role:', user.role);

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password || ""
        )

        if (!isPasswordValid) {
          console.log('❌ Invalid password for:', credentials.email);
          return null
        }

        console.log('✅ Authentication successful for:', user.email);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT callback - user:', user ? 'exists' : 'null', 'token.role before:', token.role);
      if (user) {
        token.role = user.role
        console.log('JWT callback - set token.role to:', token.role);
      }
      return token
    },
    async session({ session, token }) {
      console.log('Session callback - token.role:', token.role, 'session.user before:', session.user);
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        console.log('Session callback - session.user.role set to:', session.user.role);
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/signin",
  }
}