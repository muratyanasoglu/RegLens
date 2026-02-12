"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AuditPackStatusBadge } from "@/components/risk-badge"
import { format } from "date-fns"
import { Plus, Archive, FileText, ListTodo, Loader2 } from "lucide-react"

type AuditPack = {
  id: string
  title: string
  description: string
  status: string
  createdAt: string
  tasks: { id: string; title: string; status?: string }[]
  evidence: { id: string; title: string }[]
}

export default function AuditPacksPage() {
  const [packs, setPacks] = useState<AuditPack[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/audit-packs")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setPacks(Array.isArray(data) ? data : []))
      .catch(() => setPacks([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col">
        <PageHeader title="Audit Packs" description="Audit-ready compliance packages" />
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Audit Packs"
        description="Generate and manage audit-ready compliance packages"
      >
        <Button size="sm" asChild>
          <Link href="/audit-packs/new">
            <Plus className="mr-1 h-4 w-4" />
            New Audit Pack
          </Link>
        </Button>
      </PageHeader>

      <div className="content-max flex flex-col gap-8 py-6 lg:py-8">
        {packs.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <Archive className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm">No audit packs created yet.</p>
            <p className="mt-1 text-xs">
              Create your first audit pack to bundle tasks and evidence for compliance review.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {packs.map((pack) => {
              const packTasks = pack.tasks ?? []
              const packEvidence = pack.evidence ?? []
              const completedTasks = packTasks.filter((t) => t.status === "done").length
              return (
                <Card key={pack.id} className="card-premium card-hover">
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                        <Archive className="h-4 w-4 text-primary" />
                      </div>
                      <CardTitle className="text-sm font-medium text-card-foreground">
                        {pack.title}
                      </CardTitle>
                    </div>
                    <AuditPackStatusBadge status={pack.status as "draft" | "finalized"} />
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-3">
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {pack.description}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <ListTodo className="h-3 w-3" />
                          <span>
                            {completedTasks}/{packTasks.length} tasks
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <FileText className="h-3 w-3" />
                          <span>{packEvidence.length} evidence items</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Created {format(new Date(pack.createdAt), "MMM d, yyyy")}
                        </span>
                        <Link href={`/audit-packs/${pack.id}`}>
                          <Button variant="outline" size="sm">
                            View Pack
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
