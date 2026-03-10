import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth-server"

/** GET ?q=username - Arkadaşlar arasında kullanıcı adına göre ara (sohbet başlatmak için) */
export async function GET(request: Request) {
  try {
    const { userId } = await requireUser()
    const { searchParams } = new URL(request.url)
    const q = (searchParams.get("q") ?? "").trim()
    if (q.length < 1) {
      return NextResponse.json([])
    }
    const friendships = await prisma.friendship.findMany({
      where: {
        status: "accepted",
        OR: [{ fromUserId: userId }, { toUserId: userId }],
      },
      include: {
        fromUser: { select: { id: true, name: true, username: true, email: true } },
        toUser: { select: { id: true, name: true, username: true, email: true } },
      },
    })
    const friends = friendships.map((f) => (f.fromUserId === userId ? f.toUser : f.fromUser))
    const lower = q.toLowerCase()
    const filtered = friends.filter(
      (u) =>
        u.username.toLowerCase().includes(lower) ||
        (u.name?.toLowerCase().includes(lower)) ||
        u.email.toLowerCase().includes(lower)
    )
    return NextResponse.json(filtered)
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Arama yapılamadı." }, { status: 500 })
  }
}
