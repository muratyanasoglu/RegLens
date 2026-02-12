import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DashboardMetricsResult } from "@/lib/db-queries"
import { FileText, ListTodo, AlertTriangle, ShieldCheck, Link2 } from "lucide-react"

type Props = {
  metrics: DashboardMetricsResult
}

export function DashboardMetrics({ metrics }: Props) {
  const cards = [
    {
      title: "Total Updates",
      value: metrics.totalUpdates,
      icon: FileText,
      description: "Regulatory updates tracked",
    },
    {
      title: "Open Tasks",
      value: metrics.openTasks,
      icon: ListTodo,
      description: "Remediation tasks pending",
    },
    {
      title: "Pending Mappings",
      value: metrics.pendingMappings,
      icon: Link2,
      description: "Low confidence mappings",
    },
    {
      title: "Critical Risks",
      value: metrics.criticalRisks,
      icon: AlertTriangle,
      description: "Require immediate action",
    },
    {
      title: "Compliance Score",
      value: `${metrics.complianceScore}%`,
      icon: ShieldCheck,
      description: "Tasks completed rate",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => (
        <Card
          key={card.title}
          className="card-premium card-hover animate-fade-in"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/20">
              <card.icon className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {card.value}
            </div>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
