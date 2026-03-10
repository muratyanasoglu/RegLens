import { NextResponse } from "next/server"
import { z } from "zod"
import { randomBytes } from "crypto"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-server"

const createSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().min(1).optional(),
  inviteeUserId: z.string().min(1).optional(),
  role: z.enum(["ADMIN", "MANAGER", "AUDITOR", "USER", "VIEWER"]),
}).refine((d) => d.email || d.username || d.inviteeUserId, { message: "email, username veya inviteeUserId gerekli" })

export async function POST(request: Request) {
  try {
    const { userId, organizationId } = await requireAdmin()
    const body = await request.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }
    const { email, username, inviteeUserId, role } = parsed.data

    let targetUserId: string | null = null
    let targetEmail: string | null = null

    if (inviteeUserId) {
      targetUserId = inviteeUserId
      const u = await prisma.user.findUnique({ where: { id: inviteeUserId } })
      if (!u) return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 })
      targetEmail = u.email
    } else if (username) {
      const u = await prisma.user.findUnique({ where: { username: username.trim() } })
      if (!u) return NextResponse.json({ error: "Kullanıcı adı bulunamadı." }, { status: 404 })
      targetUserId = u.id
      targetEmail = u.email
    } else if (email) {
      const emailLower = email.toLowerCase().trim()
      const u = await prisma.user.findUnique({ where: { email: emailLower } })
      if (u) {
        targetUserId = u.id
        targetEmail = u.email
      } else {
        targetEmail = emailLower
      }
    }

    if (targetUserId) {
      const existingMember = await prisma.organizationMember.findUnique({
        where: { userId_organizationId: { userId: targetUserId, organizationId } },
      })
      if (existingMember) {
        return NextResponse.json({ error: "Bu kullanıcı zaten organizasyonda üye." }, { status: 409 })
      }
      const pending = await prisma.invite.findFirst({
        where: {
          organizationId,
          inviteeUserId: targetUserId,
          status: "pending",
          expiresAt: { gt: new Date() },
        },
      })
      if (pending) {
        return NextResponse.json({ error: "Bu kullanıcıya zaten bekleyen bir davet var." }, { status: 409 })
      }
    } else if (targetEmail) {
      const pending = await prisma.invite.findFirst({
        where: {
          organizationId,
          email: targetEmail,
          status: "pending",
          expiresAt: { gt: new Date() },
        },
      })
      if (pending) {
        return NextResponse.json({ error: "Bu e-postaya zaten bekleyen bir davet var." }, { status: 409 })
      }
    }

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)
    const token = randomBytes(32).toString("hex")

    const invite = await prisma.invite.create({
      data: {
        email: targetEmail ?? undefined,
        inviteeUserId: targetUserId ?? undefined,
        role,
        organizationId,
        invitedById: userId,
        token,
        status: "pending",
        expiresAt,
      },
      include: {
        organization: { select: { name: true } },
        invitedBy: { select: { name: true, username: true } },
      },
    })

    if (targetUserId) {
      await prisma.notification.create({
        data: {
          userId: targetUserId,
          type: "org_invite",
          title: "Takım daveti",
          message: `${invite.invitedBy.name || invite.invitedBy.username} sizi "${invite.organization.name}" takımına davet etti.`,
          link: "/invites",
        },
      })
    }

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
    const inviteLink = targetUserId ? null : `${baseUrl}/register?invite=${token}`

    return NextResponse.json({
      success: true,
      inviteId: invite.id,
      inviteLink,
      expiresAt: expiresAt.toISOString(),
    })
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if ((e as Error).message === "Forbidden") {
      return NextResponse.json({ error: "Sadece yöneticiler davet gönderebilir." }, { status: 403 })
    }
    console.error("Invite create error:", e)
    return NextResponse.json({ error: "Davet oluşturulamadı." }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { organizationId } = await requireAdmin()
    const invites = await prisma.invite.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      include: {
        invitedBy: { select: { id: true, name: true, email: true } },
        invitee: { select: { id: true, username: true, name: true, email: true } },
      },
    })
    return NextResponse.json(invites)
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if ((e as Error).message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    return NextResponse.json({ error: "Liste alınamadı." }, { status: 500 })
  }
}
