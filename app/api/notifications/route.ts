import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth-server"

export async function GET(request: Request) {
  try {
    const { userId } = await requireUser()
    const { searchParams } = new URL(request.url)
    const limit = Math.min(Number(searchParams.get("limit")) || 20, 50)
    const unreadOnly = searchParams.get("unreadOnly") === "true"

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId, ...(unreadOnly ? { readAt: null } : {}) },
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
      prisma.notification.count({ where: { userId, readAt: null } }),
    ])

    return NextResponse.json({
      notifications: notifications.map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        link: n.link,
        readAt: n.readAt?.toISOString() ?? null,
        createdAt: n.createdAt.toISOString(),
      })),
      unreadCount,
    })
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId } = await requireUser()
    const body = await request.json().catch(() => ({}))
    const { id, markAllRead } = body as { id?: string; markAllRead?: boolean }

    if (markAllRead) {
      await prisma.notification.updateMany({
        where: { userId },
        data: { readAt: new Date() },
      })
      return NextResponse.json({ success: true })
    }

    if (id) {
      const n = await prisma.notification.findFirst({
        where: { id, userId },
      })
      if (!n) return NextResponse.json({ error: "Not found" }, { status: 404 })
      await prisma.notification.update({
        where: { id },
        data: { readAt: new Date() },
      })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "id or markAllRead required" }, { status: 400 })
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
