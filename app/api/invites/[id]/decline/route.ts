import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth-server"

/** POST - Takım davetini reddet */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireUser()
    const { id } = await params
    const invite = await prisma.invite.findUnique({ where: { id } })
    if (!invite || invite.status !== "pending") {
      return NextResponse.json({ error: "Davet bulunamadı." }, { status: 404 })
    }
    if (invite.inviteeUserId !== userId) {
      return NextResponse.json({ error: "Bu davet size ait değil." }, { status: 403 })
    }
    await prisma.invite.update({
      where: { id },
      data: { status: "cancelled" },
    })
    return NextResponse.json({ success: true })
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Reddedilemedi." }, { status: 500 })
  }
}
