import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { getAuditPacks } from "@/lib/db-queries"
import { requireOrg } from "@/lib/auth-server"

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().default(""),
  taskIds: z.array(z.string()).optional().default([]),
  evidenceIds: z.array(z.string()).optional().default([]),
})

export async function GET() {
  try {
    const organizationId = await requireOrg()
    const packs = await getAuditPacks(organizationId)
    return NextResponse.json(packs)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: Request) {
  try {
    const organizationId = await requireOrg()
    const body = await request.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(parsed.error.flatten(), { status: 400 })
    }
    const pack = await prisma.auditPack.create({
      data: {
        organizationId,
        title: parsed.data.title,
        description: parsed.data.description,
        ...(parsed.data.taskIds?.length
          ? { tasks: { connect: parsed.data.taskIds.map((id) => ({ id })) } }
          : {}),
        ...(parsed.data.evidenceIds?.length
          ? { evidence: { connect: parsed.data.evidenceIds.map((id) => ({ id })) } }
          : {}),
      },
    })
    return NextResponse.json(pack)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to create audit pack" }, { status: 500 })
  }
}
