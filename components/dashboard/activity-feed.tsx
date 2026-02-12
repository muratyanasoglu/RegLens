"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { FileText, ListTodo, Activity, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

type ActivityItem = {
  type: "update" | "task" | "audit"
  id: string
  title: string
  subtitle: string
  href: string
  createdAt: string
  riskLevel?: string
  priority?: string
}

function formatTime(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 1) return "Az önce"
  if (diffMins < 60) return `${diffMins} dk önce`
  if (diffHours < 24) return `${diffHours} saat önce`
  if (diffDays < 7) return `${diffDays} gün önce`
  return d.toLocaleDateString("tr-TR", { day: "numeric", month: "short" })
}

export function ActivityFeed() {
  const [items, setItems] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch("/api/activity?limit=12")
      .then((res) => (res.ok ? res.json() : { activity: [] }))
      .then((data) => {
        if (!cancelled) setItems(data.activity ?? [])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const icon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "update":
        return <FileText className="h-4 w-4 shrink-0 text-blue-600" />
      case "task":
        return <ListTodo className="h-4 w-4 shrink-0 text-amber-600" />
      case "audit":
        return <Activity className="h-4 w-4 shrink-0 text-muted-foreground" />
      default:
        return <Activity className="h-4 w-4 shrink-0" />
    }
  }

  return (
    <Card className="card-premium card-hover animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Son Aktiviteler
        </CardTitle>
        <span className="text-xs text-muted-foreground">
          Güncellemeler, görevler ve işlemler
        </span>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Henüz aktivite yok.
          </p>
        ) : (
          <ScrollArea className="h-[280px] pr-4">
            <div className="flex flex-col gap-1">
              {items.map((item) => (
                <Link
                  key={`${item.type}-${item.id}`}
                  href={item.href}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border border-transparent px-3 py-2 transition-colors",
                    "hover:bg-accent/50 hover:border-border/80"
                  )}
                >
                  {icon(item.type)}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-tight truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                  <span className="shrink-0 text-[10px] text-muted-foreground">
                    {formatTime(item.createdAt)}
                  </span>
                </Link>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
