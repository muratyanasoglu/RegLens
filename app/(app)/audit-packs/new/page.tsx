"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { TranslatedPageHeader } from "@/components/translated-page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { StatusBadge, EvidenceStatusBadge } from "@/components/risk-badge"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

type Task = { id: string; title: string; status: string; mapping?: { control?: { controlRef: string } } }
type Evidence = { id: string; title: string; status: string }

export default function NewAuditPackPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const organizationId = (session?.user as { organizationId?: string } | undefined)?.organizationId
  const [tasks, setTasks] = useState<Task[]>([])
  const [evidence, setEvidence] = useState<Evidence[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!organizationId) return
    setLoading(true)
    Promise.all([
      fetch("/api/tasks").then((r) => (r.ok ? r.json() : [])),
      fetch("/api/evidence").then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([tasksData, evidenceData]) => {
        setTasks(Array.isArray(tasksData) ? tasksData : [])
        setEvidence(Array.isArray(evidenceData) ? evidenceData : [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [organizationId])

  function toggleTask(taskId: string) {
    setSelectedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    )
  }

  function toggleEvidence(evId: string) {
    setSelectedEvidence((prev) =>
      prev.includes(evId) ? prev.filter((id) => id !== evId) : [...prev, evId]
    )
  }

  async function handleCreate() {
    if (!title.trim()) return
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch("/api/audit-packs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          taskIds: selectedTasks,
          evidenceIds: selectedEvidence,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error?.title?.[0] || "Failed to create audit pack")
        setSubmitting(false)
        return
      }
      router.push("/audit-packs")
      router.refresh()
    } catch {
      setError("Failed to create audit pack")
    }
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="flex flex-col">
        <TranslatedPageHeader titleKey="auditPacks.create" />
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <TranslatedPageHeader titleKey="auditPacks.create">
        <Button variant="outline" size="sm" asChild>
          <Link href="/audit-packs">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Cancel
          </Link>
        </Button>
      </TranslatedPageHeader>

      <div className="flex max-w-3xl flex-col gap-6 p-6">
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Pack Details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="pack-title">Title</Label>
              <Input
                id="pack-title"
                placeholder="e.g. Q1 2026 Compliance Review"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="pack-desc">Description</Label>
              <Textarea
                id="pack-desc"
                placeholder="Describe the scope and purpose of this audit pack..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Select Tasks ({selectedTasks.length} selected)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex max-h-[300px] flex-col gap-2 overflow-y-auto">
              {tasks.map((t) => (
                <label
                  key={t.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-muted/50"
                >
                  <Checkbox
                    checked={selectedTasks.includes(t.id)}
                    onCheckedChange={() => toggleTask(t.id)}
                  />
                  <div className="flex flex-1 items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm text-card-foreground">{t.title}</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {t.mapping?.control?.controlRef ?? "—"}
                      </span>
                    </div>
                    <StatusBadge status={t.status as "open" | "in_progress" | "review" | "done"} />
                  </div>
                </label>
              ))}
              {tasks.length === 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">No tasks yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Select Evidence ({selectedEvidence.length} selected)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex max-h-[300px] flex-col gap-2 overflow-y-auto">
              {evidence.map((ev) => (
                <label
                  key={ev.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-muted/50"
                >
                  <Checkbox
                    checked={selectedEvidence.includes(ev.id)}
                    onCheckedChange={() => toggleEvidence(ev.id)}
                  />
                  <div className="flex flex-1 items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm text-card-foreground">{ev.title}</span>
                    </div>
                    <EvidenceStatusBadge status={ev.status as "draft" | "pending_review" | "approved"} />
                  </div>
                </label>
              ))}
              {evidence.length === 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">No evidence items yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleCreate}
          disabled={!title.trim() || submitting}
          className="self-end"
        >
          {submitting ? "Creating..." : "Create Audit Pack"}
        </Button>
      </div>
    </div>
  )
}
