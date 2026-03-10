import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth-server"

/** POST - Takım davetini kabul et (organizasyona katıl) */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireUser()
    const { id } = await params
    const invite = await prisma.invite.findUnique({
      where: { id },
      include: { organization: true },
    })
    if (!invite || invite.status !== "pending" || invite.expiresAt < new Date()) {
      return NextResponse.json({ error: "Davet bulunamadı veya süresi dolmuş." }, { status: 404 })
    }
    if (invite.inviteeUserId !== userId) {
      return NextResponse.json({ error: "Bu davet size ait değil." }, { status: 403 })
    }
    const existing = await prisma.organizationMember.findUnique({
      where: { userId_organizationId: { userId, organizationId: invite.organizationId } },
    })
    if (existing) {
      await prisma.invite.update({
        where: { id },
        data: { status: "accepted", acceptedAt: new Date() },
      })
      return NextResponse.json({ success: true, organizationId: invite.organizationId })
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { lastSelectedOrganizationId: true },
    })
    await prisma.$transaction([
      prisma.organizationMember.create({
        data: { userId, organizationId: invite.organizationId, role: invite.role },
      }),
      prisma.invite.update({
        where: { id },
        data: { status: "accepted", acceptedAt: new Date() },
      }),
      ...(user && !user.lastSelectedOrganizationId
        ? [prisma.user.update({
            where: { id: userId },
            data: { lastSelectedOrganizationId: invite.organizationId },
          })]
        : []),
    ])
    return NextResponse.json({ success: true, organizationId: invite.organizationId })
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Invite accept error:", e)
    return NextResponse.json({ error: "Davet kabul edilemedi." }, { status: 500 })
  }
}
