"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useTranslations } from "@/components/locale-provider"
import { TranslatedPageHeader } from "@/components/translated-page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Rss, ExternalLink, RefreshCw, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

type Source = {
  id: string
  name: string
  url: string
  type: string
  active: boolean
  lastPolled: string | null
  createdAt: string
}

export default function SourcesPage() {
  const { data: session } = useSession()
  const t = useTranslations().t
  const organizationId = (session?.user as { organizationId?: string } | undefined)?.organizationId
  const [sourceList, setSourceList] = useState<Source[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newName, setNewName] = useState("")
  const [newUrl, setNewUrl] = useState("")
  const [polling, setPolling] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!organizationId) return
    setLoading(true)
    fetch("/api/sources")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const list = Array.isArray(data) ? (data as Source[]).map((s) => ({
          ...s,
          lastPolled: s.lastPolled ? (typeof s.lastPolled === "string" ? s.lastPolled : new Date(s.lastPolled).toISOString()) : null,
          createdAt: typeof s.createdAt === "string" ? s.createdAt : new Date(s.createdAt).toISOString(),
        })) : []
        setSourceList(list)
      })
      .catch(() => setSourceList([]))
      .finally(() => setLoading(false))
  }, [organizationId])

  async function handleAdd() {
    if (!newName.trim() || !newUrl.trim()) return
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch("/api/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), url: newUrl.trim(), type: "rss" }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error?.name?.[0] || data.error || "Failed to add source")
        setSubmitting(false)
        return
      }
      const created = await res.json()
      setSourceList((prev) => [
        {
          ...created,
          lastPolled: created.lastPolled ? new Date(created.lastPolled).toISOString() : null,
          createdAt: new Date(created.createdAt).toISOString(),
        },
        ...prev,
      ])
      setNewName("")
      setNewUrl("")
      setDialogOpen(false)
    } catch {
      setError("Failed to add source")
    }
    setSubmitting(false)
  }

  function handlePoll(sourceId: string) {
    setPolling(sourceId)
    setTimeout(() => {
      setSourceList((prev) =>
        prev.map((s) =>
          s.id === sourceId ? { ...s, lastPolled: new Date().toISOString() } : s
        )
      )
      setPolling(null)
    }, 1500)
  }

  if (loading) {
    return (
      <div className="flex flex-col">
        <TranslatedPageHeader titleKey="sources.title" descriptionKey="sources.description" />
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <TranslatedPageHeader
        title="Regulatory Sources"
        description="Manage RSS feeds and regulatory data sources"
      >
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-1 h-4 w-4" />
              Add Source
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Regulatory Source</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 pt-4">
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex flex-col gap-2">
                <Label htmlFor="source-name">Name</Label>
                <Input
                  id="source-name"
                  placeholder="e.g. EBA Regulatory Feed"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="source-url">RSS URL</Label>
                <Input
                  id="source-url"
                  placeholder="https://..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                />
              </div>
              <Button onClick={handleAdd} disabled={!newName.trim() || !newUrl.trim() || submitting}>
                {submitting ? "Adding..." : "Add Source"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </TranslatedPageHeader>

      <div className="content-max grid gap-6 py-6 sm:grid-cols-2 lg:grid-cols-3 lg:py-8">
        {sourceList.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground py-8">
            No sources yet. Add an RSS or regulatory feed to start tracking updates.
          </p>
        ) : (
          sourceList.map((source) => (
            <Card key={source.id} className="card-premium card-hover">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Rss className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-medium text-card-foreground">
                      {source.name}
                    </CardTitle>
                  </div>
                </div>
                <Badge
                  className={
                    source.active
                      ? "border-0 bg-success text-success-foreground"
                      : "border-0 bg-secondary text-secondary-foreground"
                  }
                >
                  {source.active ? "Active" : "Inactive"}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span className="truncate">{source.url}</span>
                  </a>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {source.lastPolled
                        ? `Polled ${formatDistanceToNow(new Date(source.lastPolled), { addSuffix: true })}`
                        : t("sources.neverPolled")}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePoll(source.id)}
                      disabled={polling === source.id}
                    >
                      <RefreshCw
                        className={`mr-1 h-3 w-3 ${polling === source.id ? "animate-spin" : ""}`}
                      />
                      {polling === source.id ? t("sources.polling") : t("sources.pollNow")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
