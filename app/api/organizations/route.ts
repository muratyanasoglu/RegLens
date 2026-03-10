import { NextResponse } from "next/server"
import { z } from "zod"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/next-auth"
import { prisma } from "@/lib/prisma"

const createSchema = z.object({
  name: z.string().min(1).max(120),
  slug: z.string().min(1).max(60).regex(/^[a-z0-9-]+$/).optional(),
})

/** POST - Yeni organizasyon oluştur; oluşturan ADMIN üye olur ve seçili org yapılır */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 })
  }
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }
  const { name } = parsed.data
  let slug = parsed.data.slug?.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-") ?? name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "org"
  let n = 0
  while (await prisma.organization.findUnique({ where: { slug } })) {
    n += 1
    slug = `${slug.replace(/-[0-9]+$/, "")}-${n}`
  }
  const organization = await prisma.organization.create({
    data: { name, slug },
  })
  await prisma.organizationMember.create({
    data: { userId, organizationId: organization.id, role: "ADMIN" },
  })
  await prisma.user.update({
    where: { id: userId },
    data: { lastSelectedOrganizationId: organization.id },
  })
  return NextResponse.json({ id: organization.id, name: organization.name, slug: organization.slug })
}
