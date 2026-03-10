import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/next-auth"
import { prisma } from "@/lib/prisma"

/** POST - Seçili organizasyonu değiştir */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  let body: { organizationId?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 })
  }
  const organizationId = body.organizationId
  if (!organizationId) {
    return NextResponse.json({ error: "organizationId gerekli" }, { status: 400 })
  }
  const member = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: { userId, organizationId },
    },
  })
  if (!member) {
    return NextResponse.json({ error: "Bu organizasyona üye değilsiniz" }, { status: 403 })
  }
  await prisma.user.update({
    where: { id: userId },
    data: { lastSelectedOrganizationId: organizationId },
  })
  return NextResponse.json({ success: true, organizationId })
}
