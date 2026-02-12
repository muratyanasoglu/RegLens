import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { getTaskById } from "@/lib/db-queries"
import { requireOrg, requireUser } from "@/lib/auth-server"
import { createNotification } from "@/lib/notifications"

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  assigneeId: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
})

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const organizationId = await requireOrg()
    const { id } = await params
    const task = await getTaskById(id, organizationId)
    if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(task)
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
    const existing = await prisma.task.findFirst({
      where: { id, organizationId },
    })
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })
    const body = await request.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(parsed.error.flatten(), { status: 400 })
    }
    const data: Record<string, unknown> = { ...parsed.data }
    if (parsed.data.dueDate !== undefined) {
      data.dueDate = parsed.data.dueDate ? new Date(parsed.data.dueDate) : null
    }
    const task = await prisma.task.update({
      where: { id },
      data,
      include: {
        assignee: { select: { id: true, name: true, username: true } },
      },
    })
    if (
      parsed.data.assigneeId != null &&
      parsed.data.assigneeId !== existing.assigneeId &&
      task.assignee
    ) {
      try {
        const { userId: _actor } = await requireUser()
        await createNotification(
          task.assignee.id,
          "task_assigned",
          "Yeni görev atandı",
          `"${task.title}" görevi size atandı.`,
          `/tasks/${task.id}`
        )
      } catch {
        // ignore if notification creation fails
      }
    }
    return NextResponse.json(task)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}
