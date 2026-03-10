"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { TranslatedPageHeader } from "@/components/translated-page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AuditPackStatusBadge, StatusBadge, PriorityBadge, EvidenceStatusBadge } from "@/components/risk-badge"
import { format } from "date-fns"
import { ArrowLeft, Printer, FileText, ListTodo, Loader2 } from "lucide-react"
import { useTranslations } from "@/components/locale-provider"

type PackTask = { id: string; title: string; priority: string; status: string; assignee?: { name: string | null; username: string } | null; mapping?: { control?: { controlRef: string } } }
type PackEvidence = { id: string; title: string; status: string; template: string }
type Pack = {
  id: string
  title: string
  description: string
  status: string
  createdAt: string
  finalizedAt: string | null
  tasks: PackTask[]
  evidence: PackEvidence[]
}

export default function AuditPackDetailPage() {
  const params = useParams()
  const t = useTranslations().t
  const [pack, setPack] = useState<Pack | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!params.id) return
    fetch(`/api/audit-packs/${params.id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then(setPack)
      .catch(() => setPack(null))
      .finally(() => setLoading(false))
  }, [params.id])

  function handlePrint() {
    window.print()
  }

  if (loading) {
    return (
      <div className="flex flex-col">
        <TranslatedPageHeader titleKey="auditPacks.detail" />
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (!pack) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-muted-foreground">{t("auditPack.notFound")}</p>
        <Link href="/audit-packs" className="mt-2 text-sm text-primary hover:underline">
          {t("auditPack.backToPacks")}
        </Link>
      </div>
    )
  }

  const packTasks = pack.tasks ?? []
  const packEvidence = pack.evidence ?? []

  return (
    <div className="flex flex-col">
      <TranslatedPageHeader titleKey="auditPacks.detail">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-1 h-4 w-4" />
            {t("auditPack.exportPrint")}
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/audit-packs">
              <ArrowLeft className="mr-1 h-4 w-4" />
              {t("common.back")}
            </Link>
          </Button>
        </div>
      </TranslatedPageHeader>

      <div className="flex flex-col gap-6 p-6 print:p-0">
        <Card className="card-premium print:border-0 print:shadow-none">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <AuditPackStatusBadge status={pack.status as "draft" | "finalized"} />
              </div>
              <h2 className="text-xl font-semibold text-card-foreground">{pack.title}</h2>
              <p className="text-sm text-muted-foreground">{pack.description}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{t("auditPack.created")}: {format(new Date(pack.createdAt), "MMM d, yyyy")}</span>
                {pack.finalizedAt && (
                  <span>{t("auditPack.finalized")}: {format(new Date(pack.finalizedAt), "MMM d, yyyy")}</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium print:border-0 print:shadow-none">
          <CardHeader className="flex flex-row items-center gap-2">
            <ListTodo className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tasks ({packTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {packTasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-card-foreground">{t.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {t.mapping?.control?.controlRef ?? "—"}{" "}
                      {t.assignee?.name ?? t.assignee?.username ? ` · ${t.assignee.name ?? t.assignee.username}` : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={t.priority as "critical" | "high" | "medium" | "low"} />
                    <StatusBadge status={t.status as "open" | "in_progress" | "review" | "done"} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium print:border-0 print:shadow-none">
          <CardHeader className="flex flex-row items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Evidence Items ({packEvidence.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {packEvidence.map((ev) => (
                <div key={ev.id} className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-card-foreground">{ev.title}</span>
                    <EvidenceStatusBadge status={ev.status as "draft" | "pending_review" | "approved"} />
                  </div>
                  <div className="rounded-md bg-muted p-3">
                    <pre className="whitespace-pre-wrap font-mono text-xs text-foreground">
                      {ev.template || "(No content)"}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="text-center print:mt-4">
          <p className="text-xs italic text-muted-foreground">
            RegLens - {t("auditPack.generated")} {format(new Date(), "MMM d, yyyy")}
          </p>
          <p className="mt-1 text-xs italic text-muted-foreground">Not legal advice. Human review required.</p>
        </div>
      </div>

      <style>{`
        @media print {
          nav, [data-sidebar], header button, .print\\:hidden {
            display: none !important;
          }
          body {
            background: white;
          }
        }
      `}</style>
    </div>
  )
}
