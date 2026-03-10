import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth-server"

/** Liste: Arkadaşlar + son mesaj + okunmamış sayısı (WhatsApp gibi) */
export async function GET() {
  try {
    const { userId } = await requireUser()

    const friendships = await prisma.friendship.findMany({
      where: { status: "accepted", OR: [{ fromUserId: userId }, { toUserId: userId }] },
      include: {
        fromUser: { select: { id: true, name: true, username: true, email: true } },
        toUser: { select: { id: true, name: true, username: true, email: true } },
      },
    })
    const friends = friendships.map((f) => (f.fromUserId === userId ? f.toUser : f.fromUser))

    const lastMessages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: "desc" },
      take: 500,
    })
    const byOther = new Map<string, { body: string; type: string; attachmentUrl: string | null; createdAt: Date; readAt: Date | null; senderId: string }>()
    for (const m of lastMessages) {
      const otherId = m.senderId === userId ? m.receiverId : m.senderId
      if (!byOther.has(otherId)) {
        byOther.set(otherId, {
          body: m.body,
          type: m.type,
          attachmentUrl: m.attachmentUrl,
          createdAt: m.createdAt,
          readAt: m.readAt,
          senderId: m.senderId,
        })
      }
    }

    const unreadCounts = await prisma.message.groupBy({
      by: ["senderId"],
      where: { receiverId: userId, readAt: null },
      _count: { id: true },
    })
    const unreadBySender = new Map(unreadCounts.map((u) => [u.senderId, u._count.id]))

    const conversations = friends.map((user) => {
      const last = byOther.get(user.id)
      const unread = unreadBySender.get(user.id) ?? 0
      return {
        user,
        lastMessage: last
          ? {
              body: last.body,
              type: last.type,
              attachmentUrl: last.attachmentUrl,
              createdAt: last.createdAt,
              readAt: last.readAt,
              fromMe: last.senderId === userId,
            }
          : null,
        unreadCount: unread,
      }
    })

    return NextResponse.json(conversations)
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Chat conversations error:", e)
    return NextResponse.json({ error: "Liste alınamadı." }, { status: 500 })
  }
}
