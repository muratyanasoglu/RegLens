import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireOrg } from "@/lib/auth-server"

export async function GET(request: Request) {
  try {
    const organizationId = await requireOrg()
    const { searchParams } = new URL(request.url)
    const q = (searchParams.get("q") ?? "").trim()
    if (!q || q.length < 2) {
      return NextResponse.json({
        updates: [],
        tasks: [],
        controls: [],
        frameworks: [],
      })
    }

    const [updates, tasks, controls, frameworks] = await Promise.all([
      prisma.regulatoryUpdate.findMany({
        where: {
          source: { organizationId },
          OR: [
            { title: { contains: q } },
            { summary: { contains: q } },
          ],
        },
        take: 8,
        orderBy: { publishedAt: "desc" },
        select: {
          id: true,
          title: true,
          riskLevel: true,
          status: true,
          publishedAt: true,
        },
      }),
      prisma.task.findMany({
        where: {
          organizationId,
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
          ],
        },
        take: 8,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          assignee: { select: { name: true, username: true } },
        },
      }),
      prisma.control.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { controlRef: { contains: q } },
            { description: { contains: q } },
          ],
        },
        take: 8,
        include: { framework: { select: { name: true } } },
      }),
      prisma.framework.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { description: { contains: q } },
          ],
        },
        take: 5,
        select: { id: true, name: true, version: true },
      }),
    ])

    return NextResponse.json({
      updates: updates.map((u) => ({
        id: u.id,
        title: u.title,
        riskLevel: u.riskLevel,
        status: u.status,
        publishedAt: u.publishedAt.toISOString(),
        href: `/updates/${u.id}`,
      })),
      tasks: tasks.map((t) => ({
        id: t.id,
        title: t.title,
        status: t.status,
        priority: t.priority,
        assignee: t.assignee?.name ?? t.assignee?.username ?? null,
        href: `/tasks/${t.id}`,
      })),
      controls: controls.map((c) => ({
        id: c.id,
        controlRef: c.controlRef,
        title: c.title,
        frameworkName: c.framework.name,
        href: `/controls`,
      })),
      frameworks: frameworks.map((f) => ({
        id: f.id,
        name: f.name,
        version: f.version,
        href: `/frameworks/${f.id}`,
      })),
    })
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
