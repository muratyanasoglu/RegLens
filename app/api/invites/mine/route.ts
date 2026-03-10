import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth-server"

/** GET - Bana gelen davetler: takım davetleri (org invite) + arkadaşlık istekleri */
export async function GET() {
  try {
    const { userId } = await requireUser()
    const [orgInvites, friendRequests] = await Promise.all([
      prisma.invite.findMany({
        where: {
          inviteeUserId: userId,
          status: "pending",
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: "desc" },
        include: {
          organization: { select: { id: true, name: true } },
          invitedBy: { select: { id: true, username: true, name: true } },
        },
      }),
      prisma.friendship.findMany({
        where: { toUserId: userId, status: "pending" },
        orderBy: { createdAt: "desc" },
        include: { fromUser: { select: { id: true, username: true, name: true, email: true } } },
      }),
    ])
    return NextResponse.json({
      orgInvites,
      friendRequests: friendRequests.map((f) => ({ id: f.id, fromUser: f.fromUser, createdAt: f.createdAt })),
    })
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Davetler alınamadı." }, { status: 500 })
  }
}
