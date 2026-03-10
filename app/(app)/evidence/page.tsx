"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { TranslatedPageHeader } from "@/components/translated-page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { EvidenceStatusBadge } from "@/components/risk-badge"
import { format } from "date-fns"
import { Search, FileText, Eye, Loader2 } from "lucide-react"

type EvidenceItem = {
  id: string
  taskId: string
  title: string
  template: string
  status: string
  createdAt: string
  task?: { id: string; title: string }
}

export default function EvidencePage() {
  const { data: session } = useSession()
  const organizationId = (session?.user as { organizationId?: string } | undefined)?.organizationId
  const [items, setItems] = useState<EvidenceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [previewItem, setPreviewItem] = useState<EvidenceItem | null>(null)

  useEffect(() => {
    if (!organizationId) return
    setLoading(true)
    fetch("/api/evidence")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const list = Array.isArray(data) ? (data as EvidenceItem[]) : []
        setItems(list)
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [organizationId])

  const filtered = items.filter((ev) => {
    const taskTitle = ev.task?.title ?? ""
    const matchesSearch =
      ev.title.toLowerCase().includes(search.toLowerCase()) ||
      taskTitle.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || ev.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex flex-col">
        <TranslatedPageHeader titleKey="evidence.title" descriptionKey="evidence.description" />
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <TranslatedPageHeader
titleKey="evidence.title"
      descriptionKey="evidence.description"
      />

      <div className="content-max flex flex-col gap-6 py-6 lg:py-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search evidence..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending_review">Pending Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((ev) => (
            <Card key={ev.id} className="card-premium card-hover">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-medium text-card-foreground">
                    {ev.title}
                  </CardTitle>
                </div>
                <EvidenceStatusBadge status={ev.status as "draft" | "pending_review" | "approved"} />
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <div className="text-xs text-muted-foreground">
                    <p className="mt-1 line-clamp-2">Task: {ev.task?.title ?? "—"}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(ev.createdAt), "MMM d, yyyy")}
                    </span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setPreviewItem(ev)}>
                          <Eye className="mr-1 h-3 w-3" />
                          Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{ev.title}</DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="max-h-[60vh]">
                          <div className="prose prose-sm max-w-none whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm text-foreground">
                            {ev.template || "(No content)"}
                          </div>
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-8 text-center text-muted-foreground">
              No evidence items match your filters. Add evidence from tasks.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
