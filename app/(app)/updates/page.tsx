"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { TranslatedPageHeader } from "@/components/translated-page-header"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RiskBadge, UpdateStatusBadge } from "@/components/risk-badge"
import { format } from "date-fns"
import { Search, ArrowRight, Loader2 } from "lucide-react"

type Update = {
  id: string
  title: string
  summary: string
  sourceName: string
  riskLevel: string
  status: string
  publishedAt: string
  _count?: { mappings: number }
}

export default function UpdatesPage() {
  const { data: session } = useSession()
  const organizationId = (session?.user as { organizationId?: string } | undefined)?.organizationId
  const [updates, setUpdates] = useState<Update[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [riskFilter, setRiskFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    if (!organizationId) return
    setLoading(true)
    fetch("/api/updates")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const list = Array.isArray(data)
          ? (data as (Update & { source?: { name: string } })[]).map((u) => ({
              id: u.id,
              title: u.title,
              summary: u.summary ?? "",
              sourceName: u.source?.name ?? "",
              riskLevel: u.riskLevel,
              status: u.status,
              publishedAt: u.publishedAt,
              _count: u._count,
            }))
          : []
        setUpdates(list)
      })
      .catch(() => setUpdates([]))
      .finally(() => setLoading(false))
  }, [organizationId])

  const filtered = updates.filter((u) => {
    const matchesSearch =
      u.title.toLowerCase().includes(search.toLowerCase()) ||
      u.summary.toLowerCase().includes(search.toLowerCase())
    const matchesRisk = riskFilter === "all" || u.riskLevel === riskFilter
    const matchesStatus = statusFilter === "all" || u.status === statusFilter
    return matchesSearch && matchesRisk && matchesStatus
  })

  const mappingCount = (u: Update) => u._count?.mappings ?? 0

  if (loading) {
    return (
      <div className="flex flex-col">
        <TranslatedPageHeader titleKey="updates.title" descriptionKey="updates.description" />
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <TranslatedPageHeader
        title="Regulatory Updates"
        description="Track and analyze regulatory changes across all sources"
      />

      <div className="content-max flex flex-col gap-6 py-6 lg:py-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search updates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Risk Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risks</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="analyzed">Analyzed</SelectItem>
              <SelectItem value="mapped">Mapped</SelectItem>
              <SelectItem value="actioned">Actioned</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="card-premium overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Mappings</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((update) => (
                <TableRow key={update.id} className="group">
                  <TableCell>
                    <Link
                      href={`/updates/${update.id}`}
                      className="font-medium text-card-foreground hover:text-primary"
                    >
                      {update.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {update.sourceName}
                  </TableCell>
                  <TableCell>
                    <RiskBadge level={update.riskLevel as "critical" | "high" | "medium" | "low"} />
                  </TableCell>
                  <TableCell>
                    <UpdateStatusBadge status={update.status as "new" | "analyzed" | "mapped" | "actioned"} />
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {mappingCount(update)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(update.publishedAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Link href={`/updates/${update.id}`}>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                    No updates match your filters. Add sources and run polling to fetch updates.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
