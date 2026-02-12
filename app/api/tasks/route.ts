import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { getTasks } from "@/lib/db-queries"
import { requireOrg } from "@/lib/auth-server"

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().default(""),
  status: z.string().optional().default("open"),
  priority: z.string().optional().default("medium"),
  assigneeId: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  updateId: z.string().nullable().optional(),
  mappingId: z.string().nullable().optional(),
})

export async function GET() {
  try {
    const organizationId = await requireOrg()
    const tasks = await getTasks(organizationId)
    return NextResponse.json(tasks)
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
    const dueDate = parsed.data.dueDate
      ? new Date(parsed.data.dueDate)
      : undefined
    const task = await prisma.task.create({
      data: {
        organizationId,
        title: parsed.data.title,
        description: parsed.data.description,
        status: parsed.data.status,
        priority: parsed.data.priority,
        assigneeId: parsed.data.assigneeId ?? undefined,
        dueDate,
        updateId: parsed.data.updateId ?? undefined,
        mappingId: parsed.data.mappingId ?? undefined,
      },
    })
    return NextResponse.json(task)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
