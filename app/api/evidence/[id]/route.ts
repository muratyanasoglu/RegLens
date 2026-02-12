import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireOrg } from "@/lib/auth-server"

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  template: z.string().optional(),
  status: z.string().optional(),
  content: z.string().nullable().optional(),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const organizationId = await requireOrg()
    const { id } = await params
    const evidence = await prisma.evidenceItem.findFirst({
      where: { id, task: { organizationId } },
    })
    if (!evidence) return NextResponse.json({ error: "Not found" }, { status: 404 })
    const body = await request.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(parsed.error.flatten(), { status: 400 })
    }
    const updated = await prisma.evidenceItem.update({
      where: { id },
      data: parsed.data,
    })
    return NextResponse.json(updated)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}
