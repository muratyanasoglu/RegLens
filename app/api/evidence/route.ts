import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { getEvidenceItems } from "@/lib/db-queries"
import { requireOrg } from "@/lib/auth-server"

const createSchema = z.object({
  taskId: z.string().min(1),
  title: z.string().min(1),
  template: z.string().default("document"),
  status: z.string().optional().default("draft"),
})

export async function GET() {
  try {
    const organizationId = await requireOrg()
    const items = await getEvidenceItems(organizationId)
    return NextResponse.json(items)
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
    const task = await prisma.task.findFirst({
      where: { id: parsed.data.taskId, organizationId },
    })
    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 })
    const item = await prisma.evidenceItem.create({
      data: {
        taskId: parsed.data.taskId,
        title: parsed.data.title,
        template: parsed.data.template,
        status: parsed.data.status,
      },
    })
    return NextResponse.json(item)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to create evidence" }, { status: 500 })
  }
}
