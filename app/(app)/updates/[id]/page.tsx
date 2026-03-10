import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { TranslatedPageHeader } from "@/components/translated-page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { RiskBadge, UpdateStatusBadge, ConfidenceBadge, StatusBadge } from "@/components/risk-badge"
import { format } from "date-fns"
import { ArrowLeft, Plus, Minus, Pencil } from "lucide-react"
import { getSessionAndOrg } from "@/lib/auth-server"
import { getUpdateById } from "@/lib/db-queries"

export default async function UpdateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { organizationId } = await getSessionAndOrg()
  if (!organizationId) redirect("/organizations")
  const { id } = await params
  const update = await getUpdateById(id, organizationId)
  if (!update) notFound()

  const diffs = update.diffs ?? []
  const relatedMappings = (update.mappings ?? []).map((m) => ({
    id: m.id,
    controlRef: m.control.controlRef,
    controlTitle: m.control.title,
    rationale: m.rationale,
    confidence: m.confidence,
    aiGenerated: m.aiGenerated,
  }))
  const relatedTasks = (update.tasks ?? []).map((t) => ({
    id: t.id,
    title: t.title,
    controlRef: t.mapping?.control?.controlRef ?? "—",
    assignee: t.assignee?.name ?? t.assignee?.username ?? null,
    status: t.status,
  }))

  const diffIcons = {
    addition: <Plus className="h-4 w-4 text-success" />,
    modification: <Pencil className="h-4 w-4 text-warning" />,
    deletion: <Minus className="h-4 w-4 text-destructive" />,
  }

  return (
    <div className="flex flex-col">
      <TranslatedPageHeader titleKey="updatesDetail.title">
        <Button variant="outline" size="sm" asChild>
          <Link href="/updates">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Updates
          </Link>
        </Button>
      </TranslatedPageHeader>

      <div className="content-max flex flex-col gap-8 py-6 lg:py-8">
        <Card className="card-premium">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <RiskBadge level={update.riskLevel as "critical" | "high" | "medium" | "low"} />
                <UpdateStatusBadge status={update.status as "new" | "analyzed" | "mapped" | "actioned"} />
                <Badge variant="outline" className="bg-transparent">
                  {update.source?.name ?? ""}
                </Badge>
              </div>
              <h2 className="text-xl font-semibold text-card-foreground">{update.title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{update.summary}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Published: {format(update.publishedAt, "MMM d, yyyy")}</span>
                <span>Hash: {update.hash}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {diffs.length > 0 && (
          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Change Diffs ({diffs.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {diffs.map((diff) => (
                  <div key={diff.id} className="rounded-lg border p-4">
                    <div className="mb-3 flex items-center gap-2">
                      {diffIcons[diff.diffType as keyof typeof diffIcons] ?? null}
                      <span className="text-sm font-medium text-card-foreground">{diff.section}</span>
                      <Badge variant="outline" className="ml-auto bg-transparent capitalize">
                        {diff.diffType}
                      </Badge>
                    </div>
                    {diff.oldText && (
                      <div className="mb-2 rounded-md bg-destructive/10 p-3">
                        <p className="text-xs font-mono leading-relaxed text-destructive">
                          - {diff.oldText}
                        </p>
                      </div>
                    )}
                    {diff.newText && (
                      <div className="mb-2 rounded-md bg-success/10 p-3">
                        <p className="text-xs font-mono leading-relaxed text-success">
                          + {diff.newText}
                        </p>
                      </div>
                    )}
                    <Separator className="my-2" />
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Impact: </span>
                      {diff.impact}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Control Mappings ({relatedMappings.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {relatedMappings.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No control mappings yet. AI mapping will generate these automatically.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {relatedMappings.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-start justify-between rounded-lg border p-3"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-medium text-primary">
                          {m.controlRef}
                        </span>
                        <span className="text-sm text-card-foreground">{m.controlTitle}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{m.rationale}</p>
                    </div>
                    <div className="ml-4 flex shrink-0 items-center gap-2">
                      <ConfidenceBadge confidence={m.confidence as "high" | "medium" | "low"} />
                      {m.aiGenerated && (
                        <Badge variant="outline" className="bg-transparent text-xs">
                          AI
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Related Tasks ({relatedTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {relatedTasks.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No tasks generated yet.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {relatedTasks.map((t) => (
                  <Link
                    key={t.id}
                    href={`/tasks/${t.id}`}
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-card-foreground">{t.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {t.controlRef} {t.assignee ? ` · ${t.assignee}` : ""}
                      </span>
                    </div>
                    <StatusBadge status={t.status as "open" | "in_progress" | "review" | "done"} />
                  </Link>
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
