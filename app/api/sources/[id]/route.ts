import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireOrg } from "@/lib/auth-server"

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  url: z.string().url().optional(),
  type: z.string().optional(),
  active: z.boolean().optional(),
  pollInterval: z.number().optional(),
})

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const organizationId = await requireOrg()
    const { id } = await params
    const source = await prisma.source.findFirst({
      where: { id, organizationId },
    })
    if (!source) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(source)
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
    const existing = await prisma.source.findFirst({
      where: { id, organizationId },
    })
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })
    const body = await request.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(parsed.error.flatten(), { status: 400 })
    }
    const source = await prisma.source.update({
      where: { id },
      data: parsed.data,
    })
    return NextResponse.json(source)
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
    const existing = await prisma.source.findFirst({
      where: { id, organizationId },
    })
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })
    await prisma.source.delete({ where: { id } })
    return new NextResponse(null, { status: 204 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
