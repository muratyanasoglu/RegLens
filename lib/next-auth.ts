import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { AuthService } from "@/lib/auth"

const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_MINUTES = 15

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        login: { label: "E-posta veya kullanıcı adı", type: "text" },
        password: { label: "Şifre", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials?.password) return null
        const login = credentials.login.trim()
        const password = credentials.password

        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: login }, { username: login }],
          },
          include: { organization: true },
        })
        if (!user || !user.passwordHash) return null

        if (user.lockedUntil && user.lockedUntil > new Date()) {
          return null
        }

        if (!AuthService.verifyPassword(password, user.passwordHash)) {
          const attempts = (user.loginAttempts ?? 0) + 1
          const updates: { loginAttempts: number; lockedUntil?: Date } = {
            loginAttempts: attempts,
          }
          if (attempts >= MAX_LOGIN_ATTEMPTS) {
            const lockUntil = new Date()
            lockUntil.setMinutes(lockUntil.getMinutes() + LOCKOUT_MINUTES)
            updates.lockedUntil = lockUntil
          }
          await prisma.user.update({
            where: { id: user.id },
            data: updates,
          })
          return null
        }

        await prisma.user.update({
          where: { id: user.id },
          data: {
            lastLoginAt: new Date(),
            loginAttempts: 0,
            lockedUntil: null,
          },
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.username,
          image: null,
          role: user.role,
          organizationId: user.organizationId,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role
        token.organizationId = (user as { organizationId?: string }).organizationId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string
        ;(session.user as { role?: string }).role = token.role as string
        ;(session.user as { organizationId?: string }).organizationId = token.organizationId as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
}
