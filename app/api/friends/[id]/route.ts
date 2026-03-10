import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth-server"

/** POST - Arkadaşlık isteğini kabul et */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireUser()
    const { id } = await params
    const fr = await prisma.friendship.findUnique({ where: { id } })
    if (!fr || fr.toUserId !== userId || fr.status !== "pending") {
      return NextResponse.json({ error: "İstek bulunamadı veya zaten işlendi." }, { status: 404 })
    }
    await prisma.friendship.update({
      where: { id },
      data: { status: "accepted" },
    })
    return NextResponse.json({ success: true })
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Kabul edilemedi." }, { status: 500 })
  }
}

/** DELETE - Arkadaşlık isteğini reddet (veya arkadaşlıktan çık) */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireUser()
    const { id } = await params
    const fr = await prisma.friendship.findUnique({ where: { id } })
    if (!fr) {
      return NextResponse.json({ error: "Bulunamadı." }, { status: 404 })
    }
    const isReceiver = fr.toUserId === userId
    const isSender = fr.fromUserId === userId
    if (!isReceiver && !isSender) {
      return NextResponse.json({ error: "Yetkisiz." }, { status: 403 })
    }
    await prisma.friendship.update({
      where: { id },
      data: { status: isReceiver && fr.status === "pending" ? "declined" : fr.status },
    })
    if (fr.status === "accepted") {
      await prisma.friendship.delete({ where: { id } })
    }
    return NextResponse.json({ success: true })
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "İşlem yapılamadı." }, { status: 500 })
  }
}
