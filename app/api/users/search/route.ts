import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth-server"

/** GET ?q=username - Kullanıcı adına göre ara (arkadaş ekle / takım daveti için) */
export async function GET(request: Request) {
  try {
    const { userId } = await requireUser()
    const { searchParams } = new URL(request.url)
    const q = (searchParams.get("q") ?? "").trim()
    if (q.length < 2) {
      return NextResponse.json([])
    }
    const limit = Math.min(20, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10) || 20))
    const users = await prisma.user.findMany({
      where: {
        id: { not: userId },
        OR: [
          { username: { contains: q } },
          { name: { contains: q } },
          { email: { contains: q } },
        ],
      },
      select: { id: true, username: true, name: true, email: true },
      take: limit,
    })
    return NextResponse.json(users)
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Arama yapılamadı." }, { status: 500 })
  }
}
