import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/** GET - Davet bilgisi: segment id (cuid) veya token (64 karakter hex) olabilir (kayıt sayfası token ile çağırır) */
const TOKEN_REGEX = /^[a-f0-9]{64}$/

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (!id) {
    return NextResponse.json({ error: "Gerekli parametre yok" }, { status: 400 })
  }
  const isToken = TOKEN_REGEX.test(id)
  const invite = await prisma.invite.findUnique({
    where: isToken ? { token: id } : { id },
    include: {
      organization: { select: { name: true, slug: true } },
      invitedBy: { select: { name: true, email: true } },
    },
  })
  if (!invite) {
    return NextResponse.json({ error: "Davet bulunamadı" }, { status: 404 })
  }
  if (invite.status !== "pending") {
    return NextResponse.json({ error: "Bu davet artık geçerli değil" }, { status: 400 })
  }
  if (invite.expiresAt < new Date()) {
    return NextResponse.json({ error: "Davet süresi dolmuş" }, { status: 400 })
  }
  return NextResponse.json({
    email: invite.email,
    role: invite.role,
    organizationName: invite.organization.name,
    invitedByName: invite.invitedBy.name ?? invite.invitedBy.email,
  })
}
