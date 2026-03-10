import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth-server"

const sendSchema = z.object({
  toUserId: z.string().min(1),
  body: z.string().max(10000).default(""),
  type: z.enum(["text", "image", "file"]).default("text"),
  attachmentUrl: z.string().optional(),
  attachmentName: z.string().optional(),
})

/** Arkadaş mı kontrolü */
async function areFriends(userId: string, otherId: string) {
  const fr = await prisma.friendship.findFirst({
    where: {
      status: "accepted",
      OR: [
        { fromUserId: userId, toUserId: otherId },
        { fromUserId: otherId, toUserId: userId },
      ],
    },
  })
  return !!fr
}

/** GET ?with=userId&cursor=id&limit=50 */
export async function GET(request: Request) {
  try {
    const { userId } = await requireUser()
    const { searchParams } = new URL(request.url)
    const withUserId = searchParams.get("with")
    const cursor = searchParams.get("cursor")
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10) || 50))

    if (!withUserId) {
      return NextResponse.json({ error: "with (userId) gerekli" }, { status: 400 })
    }
    const friends = await areFriends(userId, withUserId)
    if (!friends) {
      return NextResponse.json({ error: "Sadece arkadaşlarınızla sohbet edebilirsiniz." }, { status: 403 })
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: withUserId },
          { senderId: withUserId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      include: {
        sender: { select: { id: true, name: true, username: true } },
      },
    })

    const hasMore = messages.length > limit
    const list = hasMore ? messages.slice(0, limit) : messages
    const nextCursor = hasMore ? list[list.length - 1]?.id : null

    await prisma.message.updateMany({
      where: { receiverId: userId, senderId: withUserId, readAt: null },
      data: { readAt: new Date() },
    })

    return NextResponse.json({
      messages: list.reverse(),
      nextCursor,
    })
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Chat messages GET error:", e)
    return NextResponse.json({ error: "Mesajlar alınamadı." }, { status: 500 })
  }
}

/** POST - mesaj gönder (metin, resim veya dosya) */
export async function POST(request: Request) {
  try {
    const { userId } = await requireUser()
    const body = await request.json()
    const parsed = sendSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }
    const { toUserId, body: text, type, attachmentUrl, attachmentName } = parsed.data
    if (type === "text" && !text.trim()) {
      return NextResponse.json({ error: "Mesaj metni gerekli." }, { status: 400 })
    }
    if ((type === "image" || type === "file") && !attachmentUrl) {
      return NextResponse.json({ error: "Ek için attachmentUrl gerekli." }, { status: 400 })
    }

    const friends = await areFriends(userId, toUserId)
    if (!friends) {
      return NextResponse.json({ error: "Sadece arkadaşlarınızla sohbet edebilirsiniz." }, { status: 403 })
    }

    const message = await prisma.message.create({
      data: {
        senderId: userId,
        receiverId: toUserId,
        body: text || (type === "image" ? "📷 Resim" : type === "file" ? "📎 Dosya" : ""),
        type: type ?? "text",
        attachmentUrl: attachmentUrl ?? undefined,
        attachmentName: attachmentName ?? undefined,
      },
      include: {
        sender: { select: { id: true, name: true, username: true } },
      },
    })

    return NextResponse.json(message)
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Chat messages POST error:", e)
    return NextResponse.json({ error: "Mesaj gönderilemedi." }, { status: 500 })
  }
}
