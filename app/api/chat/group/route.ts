import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireOrg, requireUser } from "@/lib/auth-server"

const sendSchema = z.object({
  body: z.string().max(10000).default(""),
  type: z.enum(["text", "image", "file"]).default("text"),
  attachmentUrl: z.string().optional(),
  attachmentName: z.string().optional(),
})

/** GET - Organizasyon grup sohbeti mesajları (sadece üyeler) */
export async function GET(request: Request) {
  try {
    const organizationId = await requireOrg()
    const { searchParams } = new URL(request.url)
    const cursor = searchParams.get("cursor")
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10) || 50))

    const messages = await prisma.organizationGroupMessage.findMany({
      where: { organizationId },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { createdAt: "desc" },
      include: {
        sender: { select: { id: true, name: true, username: true } },
      },
    })

    const hasMore = messages.length > limit
    const list = hasMore ? messages.slice(0, limit) : messages
    const nextCursor = hasMore ? list[list.length - 1]?.id : null

    return NextResponse.json({
      messages: list.reverse(),
      nextCursor,
    })
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Mesajlar alınamadı." }, { status: 500 })
  }
}

/** POST - Organizasyon grup sohbetine mesaj gönder (sadece üyeler) */
export async function POST(request: Request) {
  try {
    const { userId, organizationId } = await requireUser()
    if (!organizationId) {
      return NextResponse.json({ error: "Organizasyon seçin." }, { status: 400 })
    }
    const member = await prisma.organizationMember.findUnique({
      where: { userId_organizationId: { userId, organizationId } },
    })
    if (!member) {
      return NextResponse.json({ error: "Bu organizasyonda üye değilsiniz." }, { status: 403 })
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 })
    }
    const parsed = sendSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const msg = await prisma.organizationGroupMessage.create({
      data: {
        organizationId,
        senderId: userId,
        body: parsed.data.body.trim() || "",
        type: parsed.data.type,
        attachmentUrl: parsed.data.attachmentUrl ?? null,
        attachmentName: parsed.data.attachmentName ?? null,
      },
      include: {
        sender: { select: { id: true, name: true, username: true } },
      },
    })
    return NextResponse.json(msg)
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Group chat send error:", e)
    return NextResponse.json({ error: "Mesaj gönderilemedi." }, { status: 500 })
  }
}
