import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import { prisma } from "@/lib/prisma"
import { AuthService } from "@/lib/auth"

function uniqueUsernameFromEmail(email: string): string {
  const local = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "_").slice(0, 24) || "user"
  return local
}

async function ensureUniqueUsername(base: string): Promise<string> {
  let username = base
  let n = 0
  while (await prisma.user.findUnique({ where: { username } })) {
    n += 1
    username = `${base.slice(0, 20)}_${n}`
  }
  return username
}

const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_MINUTES = 15

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          }),
        ]
      : []),
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
          include: { organizationMembers: { include: { organization: true } } },
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

        const memberships = user.organizationMembers
        const selectedId = user.lastSelectedOrganizationId
        const membership = selectedId
          ? memberships.find((m) => m.organizationId === selectedId)
          : memberships[0]
        const organizationId = membership?.organizationId ?? null
        const role = membership?.role ?? null

        await prisma.user.update({
          where: { id: user.id },
          data: {
            lastLoginAt: new Date(),
            loginAttempts: 0,
            lockedUntil: null,
            ...(memberships.length > 0 && !user.lastSelectedOrganizationId
              ? { lastSelectedOrganizationId: memberships[0].organizationId }
              : {}),
          },
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.username,
          image: null,
          role: role as string,
          organizationId: organizationId as string,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account?.provider && (account.provider === "google" || account.provider === "github")) {
        const email = (user as { email?: string }).email?.toLowerCase()
        if (!email) return token
        const providerId = account.providerAccountId
        let dbUser =
          (await prisma.user.findFirst({
            where: { email },
            include: { organizationMembers: { include: { organization: true } } },
          })) ??
          (account.provider === "google"
            ? await prisma.user.findFirst({
                where: { oidcId: providerId },
                include: { organizationMembers: { include: { organization: true } } },
              })
            : await prisma.user.findFirst({
                where: { samlId: providerId },
                include: { organizationMembers: { include: { organization: true } } },
              }))
        if (!dbUser) {
          const username = await ensureUniqueUsername(uniqueUsernameFromEmail(email))
          const name = (user as { name?: string }).name ?? null
          dbUser = await prisma.user.create({
            data: {
              username,
              email,
              name,
              ...(account.provider === "google" ? { oidcId: providerId } : { samlId: providerId }),
            },
            include: { organizationMembers: { include: { organization: true } } },
          })
          const slug = username.slice(0, 40).replace(/[^a-z0-9-]/g, "-") || "org"
          let orgSlug = slug
          let n = 0
          while (await prisma.organization.findUnique({ where: { slug: orgSlug } })) {
            n += 1
            orgSlug = `${slug.replace(/-[0-9]+$/, "")}-${n}`
          }
          const org = await prisma.organization.create({
            data: { name: `${dbUser.name ?? username}'s Organization`, slug: orgSlug },
          })
          await prisma.organizationMember.create({
            data: { userId: dbUser.id, organizationId: org.id, role: "ADMIN" },
          })
          await prisma.user.update({
            where: { id: dbUser.id },
            data: { lastSelectedOrganizationId: org.id },
          })
          dbUser = await prisma.user.findFirstOrThrow({
            where: { id: dbUser.id },
            include: { organizationMembers: { include: { organization: true } } },
          })
        } else {
          if (account.provider === "google" && !dbUser.oidcId) {
            await prisma.user.update({ where: { id: dbUser.id }, data: { oidcId: providerId } })
          }
          if (account.provider === "github" && !dbUser.samlId) {
            await prisma.user.update({ where: { id: dbUser.id }, data: { samlId: providerId } })
          }
        }
        const memberships = dbUser.organizationMembers
        const selectedId = dbUser.lastSelectedOrganizationId
        const membership = selectedId
          ? memberships.find((m) => m.organizationId === selectedId)
          : memberships[0]
        const organizationId = membership?.organizationId ?? null
        const role = membership?.role ?? null
        token.id = dbUser.id
        token.role = role as string
        token.organizationId = organizationId as string
        return token
      }
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role
        token.organizationId = (user as { organizationId?: string }).organizationId
      }
      return token
    },
    async session({ session, token }) {
      if (!session.user || !token.id) return session
      const userId = token.id as string
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { lastSelectedOrganizationId: true },
      })
      if (user?.lastSelectedOrganizationId) {
        const member = await prisma.organizationMember.findUnique({
          where: {
            userId_organizationId: { userId, organizationId: user.lastSelectedOrganizationId },
          },
          select: { role: true },
        })
        if (member) {
          (session.user as { id?: string }).id = userId
          ;(session.user as { role?: string }).role = member.role
          ;(session.user as { organizationId?: string }).organizationId = user.lastSelectedOrganizationId
          return session
        }
      }
      // Seçili org artık geçerli değil (üyelik kaldırılmış vb.); ilk üyeliğe geç veya orgsuz devam et
      const firstMembership = await prisma.organizationMember.findFirst({
        where: { userId },
        select: { organizationId: true, role: true },
      })
      if (firstMembership && user) {
        await prisma.user.update({
          where: { id: userId },
          data: { lastSelectedOrganizationId: firstMembership.organizationId },
        })
        ;(session.user as { id?: string }).id = userId
        ;(session.user as { role?: string }).role = firstMembership.role
        ;(session.user as { organizationId?: string }).organizationId = firstMembership.organizationId
        return session
      }
      if (user && user.lastSelectedOrganizationId) {
        await prisma.user.update({
          where: { id: userId },
          data: { lastSelectedOrganizationId: null },
        })
      }
      (session.user as { id?: string }).id = userId
      ;(session.user as { role?: string }).role = undefined
      ;(session.user as { organizationId?: string }).organizationId = undefined
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
