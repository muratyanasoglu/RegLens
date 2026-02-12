import Link from "next/link"
import { notFound } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { StatusBadge, PriorityBadge, ConfidenceBadge, EvidenceStatusBadge } from "@/components/risk-badge"
import { format } from "date-fns"
import { ArrowLeft, User, Calendar, Shield, FileText } from "lucide-react"
import { getSessionAndOrg } from "@/lib/auth-server"
import { getTaskById } from "@/lib/db-queries"

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { organizationId } = await getSessionAndOrg()
  if (!organizationId) notFound()
  const { id } = await params
  const task = await getTaskById(id, organizationId)
  if (!task) notFound()

  const controlRef = task.mapping?.control?.controlRef ?? task.update?.id?.slice(0, 8) ?? "—"
  const assigneeName = task.assignee?.name ?? task.assignee?.username ?? null
  const evidence = task.evidence ?? []

  return (
    <div className="flex flex-col">
      <PageHeader title="Task Detail">
        <Button variant="outline" size="sm" asChild>
          <Link href="/tasks">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Tasks
          </Link>
        </Button>
      </PageHeader>

      <div className="content-max flex flex-col gap-8 py-6 lg:py-8">
        <Card className="card-premium">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <PriorityBadge priority={task.priority as "critical" | "high" | "medium" | "low"} />
                <StatusBadge status={task.status as "open" | "in_progress" | "review" | "done"} />
                <Badge variant="outline" className="bg-transparent font-mono text-xs">
                  {controlRef}
                </Badge>
              </div>
              <h2 className="text-xl font-semibold text-card-foreground">{task.title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{task.description}</p>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Assignee</p>
                    <p className="text-sm text-card-foreground">{assigneeName ?? "Unassigned"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Due Date</p>
                    <p className="text-sm text-card-foreground">
                      {task.dueDate ? format(task.dueDate, "MMM d, yyyy") : "Not set"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Control</p>
                    <p className="text-sm font-mono text-primary">{controlRef}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {task.update && (
          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Source Update
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={`/updates/${task.update.id}`}
                className="flex flex-col gap-1 rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <span className="text-sm font-medium text-card-foreground">{task.update.title}</span>
                <span className="text-xs text-muted-foreground">{task.update.summary}</span>
              </Link>
            </CardContent>
          </Card>
        )}

        {task.mapping && (
          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Control Mapping
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-medium text-primary">
                      {task.mapping.control.controlRef}
                    </span>
                    <span className="text-sm text-card-foreground">{task.mapping.control.title}</span>
                  </div>
                  <ConfidenceBadge confidence={task.mapping.confidence as "high" | "medium" | "low"} />
                </div>
                <p className="text-xs text-muted-foreground">{task.mapping.rationale}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="card-premium">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Evidence Items ({evidence.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {evidence.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No evidence items linked to this task yet.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {evidence.map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-sm font-medium text-card-foreground">{ev.title}</span>
                        <p className="text-xs text-muted-foreground">
                          {format(ev.createdAt, "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <EvidenceStatusBadge status={ev.status as "draft" | "pending_review" | "approved"} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs italic text-muted-foreground">
          Not legal advice. Human review required.
        </p>
      </div>
    </div>
  )
}
