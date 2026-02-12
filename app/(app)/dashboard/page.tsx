import { redirect } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { DashboardSortable } from "@/components/dashboard/dashboard-sortable"
import { getSessionAndOrg } from "@/lib/auth-server"
import {
  getDashboardMetrics,
  getUpdates,
  getTasks,
} from "@/lib/db-queries"

export default async function DashboardPage() {
  const { organizationId } = await getSessionAndOrg()
  if (!organizationId) redirect("/login")

  const [metrics, updatesRaw, tasksRaw] = await Promise.all([
    getDashboardMetrics(organizationId),
    getUpdates(organizationId, 5),
    getTasks(organizationId),
  ])

  const recentUpdates = updatesRaw.map((u) => ({
    id: u.id,
    sourceName: u.source.name,
    publishedAt: u.publishedAt.toISOString(),
    title: u.title,
    riskLevel: u.riskLevel,
    status: u.status,
  }))

  const criticalTasks = tasksRaw
    .filter((t) => (t.priority === "critical" || t.priority === "high") && t.status !== "done")
    .sort((a, b) => {
      const order = { critical: 0, high: 1, medium: 2, low: 3 }
      return order[a.priority as keyof typeof order] - order[b.priority as keyof typeof order]
    })
    .slice(0, 5)
    .map((t) => ({
      id: t.id,
      controlRef: t.mapping?.control?.controlRef ?? t.update?.id?.slice(0, 8) ?? "—",
      assignee: t.assignee?.name ?? t.assignee?.username ?? null,
      title: t.title,
      priority: t.priority,
      status: t.status,
    }))

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Dashboard"
        description="Regulatory compliance overview and risk metrics. Bölümleri sürükleyerek sıralayabilirsiniz."
      />
      <DashboardSortable
        metrics={metrics}
        recentUpdates={recentUpdates}
        criticalTasks={criticalTasks}
      />
    </div>
  )
}
