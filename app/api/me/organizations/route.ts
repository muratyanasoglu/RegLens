import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/next-auth"
import { prisma } from "@/lib/prisma"

/** GET - Kullanıcının üye olduğu organizasyonlar (sidebar seçici için) */
export async function GET() {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const memberships = await prisma.organizationMember.findMany({
    where: { userId },
    include: { organization: { select: { id: true, name: true, slug: true } } },
    orderBy: { organization: { name: "asc" } },
  })
  const organizations = memberships.map((m) => ({
    id: m.organization.id,
    name: m.organization.name,
    slug: m.organization.slug,
    role: m.role,
  }))
  return NextResponse.json(organizations)
}
