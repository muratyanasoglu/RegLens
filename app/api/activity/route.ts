import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireOrg } from "@/lib/auth-server"

export async function GET(request: Request) {
  try {
    const organizationId = await requireOrg()
    const { searchParams } = new URL(request.url)
    const limit = Math.min(Number(searchParams.get("limit")) || 15, 30)

    const [updates, tasks, auditLogs] = await Promise.all([
      prisma.regulatoryUpdate.findMany({
        where: { source: { organizationId } },
        orderBy: { createdAt: "desc" },
        take: limit,
        select: {
          id: true,
          title: true,
          riskLevel: true,
          status: true,
          createdAt: true,
          source: { select: { name: true } },
        },
      }),
      prisma.task.findMany({
        where: { organizationId },
        orderBy: { createdAt: "desc" },
        take: limit,
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          createdAt: true,
          assignee: { select: { name: true, username: true } },
        },
      }),
      prisma.auditLog.findMany({
        where: { organizationId },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          action: true,
          resourceType: true,
          resourceId: true,
          createdAt: true,
          user: { select: { name: true, username: true } },
        },
      }),
    ])

    type ActivityItem =
      | { type: "update"; id: string; title: string; subtitle: string; href: string; createdAt: Date; riskLevel?: string }
      | { type: "task"; id: string; title: string; subtitle: string; href: string; createdAt: Date; priority?: string }
      | { type: "audit"; id: string; title: string; subtitle: string; href: string; createdAt: Date }

    const items: ActivityItem[] = []

    updates.forEach((u) => {
      items.push({
        type: "update",
        id: u.id,
        title: u.title,
        subtitle: `${u.source.name} · ${u.status}`,
        href: `/updates/${u.id}`,
        createdAt: u.createdAt,
        riskLevel: u.riskLevel,
      })
    })
    tasks.forEach((t) => {
      items.push({
        type: "task",
        id: t.id,
        title: t.title,
        subtitle: t.assignee
          ? `Atanan: ${t.assignee.name ?? t.assignee.username} · ${t.status}`
          : t.status,
        href: `/tasks/${t.id}`,
        createdAt: t.createdAt,
        priority: t.priority,
      })
    })
    const resourceTypeToPath: Record<string, string> = {
      task: "/tasks",
      update: "/updates",
      regulatoryupdate: "/updates",
      control: "/controls",
      framework: "/frameworks",
      source: "/sources",
      auditpack: "/audit-packs",
      evidence: "/evidence",
    }
    auditLogs.forEach((a) => {
      const key = a.resourceType.toLowerCase().replace(/\s/g, "")
      const pathBase = resourceTypeToPath[key] ?? "#"
      const href = a.resourceId && pathBase !== "#" ? `${pathBase}/${a.resourceId}` : pathBase
      items.push({
        type: "audit",
        id: a.id,
        title: `${a.action} · ${a.resourceType}`,
        subtitle: a.user ? `${a.user.name ?? a.user.username}` : "Sistem",
        href,
        createdAt: a.createdAt,
      })
    })

    items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    const recent = items.slice(0, limit).map((i) => ({
      ...i,
      createdAt: i.createdAt.toISOString(),
    }))

    return NextResponse.json({ activity: recent })
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
