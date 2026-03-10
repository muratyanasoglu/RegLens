import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth-server"

const requestSchema = z.object({ toUserId: z.string().min(1) })

/** GET - Arkadaş listesi + gelen/giden bekleyen istekler */
export async function GET() {
  try {
    const { userId } = await requireUser()
    const [friends, pendingOut, pendingIn] = await Promise.all([
      prisma.friendship.findMany({
        where: { status: "accepted", OR: [{ fromUserId: userId }, { toUserId: userId }] },
        include: {
          fromUser: { select: { id: true, username: true, name: true, email: true } },
          toUser: { select: { id: true, username: true, name: true, email: true } },
        },
      }),
      prisma.friendship.findMany({
        where: { fromUserId: userId, status: "pending" },
        include: { toUser: { select: { id: true, username: true, name: true, email: true } } },
      }),
      prisma.friendship.findMany({
        where: { toUserId: userId, status: "pending" },
        include: { fromUser: { select: { id: true, username: true, name: true, email: true } } },
      }),
    ])
    const friendUsers = friends.map((f) => (f.fromUserId === userId ? f.toUser : f.fromUser))
    return NextResponse.json({
      friends: friendUsers,
      pendingOut: pendingOut.map((f) => ({ id: f.id, user: f.toUser })),
      pendingIn: pendingIn.map((f) => ({ id: f.id, user: f.fromUser })),
    })
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Liste alınamadı." }, { status: 500 })
  }
}

/** POST - Arkadaşlık isteği gönder */
export async function POST(request: Request) {
  try {
    const { userId } = await requireUser()
    const body = await request.json()
    const parsed = requestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }
    const { toUserId } = parsed.data
    if (toUserId === userId) {
      return NextResponse.json({ error: "Kendinize istek gönderemezsiniz." }, { status: 400 })
    }
    const toUser = await prisma.user.findUnique({ where: { id: toUserId } })
    if (!toUser) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 })
    }
    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { fromUserId: userId, toUserId },
          { fromUserId: toUserId, toUserId: userId },
        ],
      },
    })
    if (existing) {
      if (existing.status === "accepted") {
        return NextResponse.json({ error: "Zaten arkadaşsınız." }, { status: 409 })
      }
      if (existing.fromUserId === userId) {
        return NextResponse.json({ error: "Bekleyen istek zaten gönderildi." }, { status: 409 })
      }
      return NextResponse.json({ error: "Bu kullanıcı size zaten istek göndermiş. Davetlerden kabul edebilirsiniz." }, { status: 409 })
    }
    const friendship = await prisma.friendship.create({
      data: { fromUserId: userId, toUserId, status: "pending" },
      include: {
        fromUser: { select: { id: true, username: true, name: true } },
        toUser: { select: { id: true, username: true, name: true } },
      },
    })
    await prisma.notification.create({
      data: {
        userId: toUserId,
        type: "friend_request",
        title: "Arkadaşlık isteği",
        message: `${friendship.fromUser.name || friendship.fromUser.username || "Bir kullanıcı"} sizi arkadaş olarak eklemek istiyor.`,
        link: "/invites",
      },
    })
    return NextResponse.json(friendship)
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Friend request error:", e)
    return NextResponse.json({ error: "İstek gönderilemedi." }, { status: 500 })
  }
}
