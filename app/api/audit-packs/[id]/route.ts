import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { getAuditPackById } from "@/lib/db-queries"
import { requireOrg } from "@/lib/auth-server"

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.string().optional(),
  taskIds: z.array(z.string()).optional(),
  evidenceIds: z.array(z.string()).optional(),
})

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const organizationId = await requireOrg()
    const { id } = await params
    const pack = await getAuditPackById(id, organizationId)
    if (!pack) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(pack)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const organizationId = await requireOrg()
    const { id } = await params
    const existing = await prisma.auditPack.findFirst({
      where: { id, organizationId },
    })
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })
    const body = await request.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(parsed.error.flatten(), { status: 400 })
    }
    const data: Record<string, unknown> = {
      title: parsed.data.title,
      description: parsed.data.description,
      status: parsed.data.status,
    }
    if (parsed.data.taskIds) {
      data.tasks = { set: parsed.data.taskIds.map((tid) => ({ id: tid })) }
    }
    if (parsed.data.evidenceIds) {
      data.evidence = { set: parsed.data.evidenceIds.map((eid) => ({ id: eid })) }
    }
    const pack = await prisma.auditPack.update({
      where: { id },
      data,
    })
    return NextResponse.json(pack)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const organizationId = await requireOrg()
    const { id } = await params
    const existing = await prisma.auditPack.findFirst({
      where: { id, organizationId },
    })
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })
    await prisma.auditPack.delete({ where: { id } })
    return new NextResponse(null, { status: 204 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
