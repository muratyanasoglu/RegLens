"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { TranslatedPageHeader } from "@/components/translated-page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Filter, Loader2 } from "lucide-react"

type AuditLogEntry = {
  id: string
  timestamp: string
  user: string
  action: string
  resource: string
  resourceId?: string
  status: string
  ipAddress: string | null
}

export default function AuditLogsPage() {
  const { data: session } = useSession()
  const organizationId = (session?.user as { organizationId?: string } | undefined)?.organizationId
  const [logs, setLogs] = useState<AuditLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (!organizationId) return
    setLoading(true)
    fetch("/api/audit-logs")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const list = Array.isArray(data)
          ? (data as AuditLogEntry[]).map((l) => ({
              ...l,
              timestamp:
                typeof l.timestamp === "string"
                  ? l.timestamp
                  : new Date((l as { timestamp: string | number | Date }).timestamp).toISOString().replace("T", " ").slice(0, 19),
            }))
          : []
        setLogs(list)
      })
      .catch(() => setLogs([]))
      .finally(() => setLoading(false))
  }, [organizationId])

  const filtered = logs.filter(
    (log) =>
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.resource.toLowerCase().includes(search.toLowerCase())
  )

  const getActionBadge = (action: string): "default" | "secondary" | "destructive" | "outline" => {
    const map: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      login: "default",
      logout: "default",
      data_access: "secondary",
      data_export: "outline",
      config_change: "outline",
      user_created: "default",
      user_deleted: "destructive",
      permission_change: "outline",
    }
    return map[action] ?? "default"
  }

  if (loading) {
    return (
      <>
        <TranslatedPageHeader titleKey="security.auditLogs" descriptionKey="security.auditLogsDesc" />
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </>
    )
  }

  return (
    <>
      <TranslatedPageHeader
        titleKey="security.auditLogs"
        descriptionKey="security.auditLogsDesc"
      />

      <div className="content-max py-6 lg:py-8">
      <Card className="card-premium overflow-hidden rounded-2xl">
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>Organization audit log from database</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search by user, action, or resource..."
              className="flex-1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-semibold">Timestamp</th>
                  <th className="px-4 py-3 text-left font-semibold">User</th>
                  <th className="px-4 py-3 text-left font-semibold">Action</th>
                  <th className="px-4 py-3 text-left font-semibold">Resource</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      {logs.length === 0
                        ? "No audit logs yet. Actions (login, config changes, etc.) will appear here when logged."
                        : "No logs match your search."}
                    </td>
                  </tr>
                ) : (
                  filtered.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-3 text-xs">{log.timestamp}</td>
                      <td className="px-4 py-3 text-xs">{log.user}</td>
                      <td className="px-4 py-3">
                        <Badge variant={getActionBadge(log.action)}>
                          {log.action.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs">{log.resource}</td>
                      <td className="px-4 py-3">
                        <Badge variant={log.status === "success" ? "default" : "destructive"}>
                          {log.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{log.ipAddress ?? "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      </div>
    </>
  )
}
