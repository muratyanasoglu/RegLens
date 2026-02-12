"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  Bell,
  CheckCheck,
  ListTodo,
  AlertTriangle,
  Calendar,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

type NotificationItem = {
  id: string
  type: string
  title: string
  message: string
  link: string | null
  readAt: string | null
  createdAt: string
}

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications?limit=15")
      if (!res.ok) return
      const data = await res.json()
      setNotifications(data.notifications ?? [])
      setUnreadCount(data.unreadCount ?? 0)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
    const t = setInterval(fetchNotifications, 60_000)
    return () => clearInterval(t)
  }, [fetchNotifications])

  const markOneRead = async (id: string) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, readAt: new Date().toISOString() } : n
      )
    )
    setUnreadCount((c) => Math.max(0, c - 1))
  }

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    })
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() }))
    )
    setUnreadCount(0)
  }

  const iconForType = (type: string) => {
    switch (type) {
      case "task_assigned":
        return <ListTodo className="h-4 w-4 shrink-0" />
      case "update_critical":
        return <AlertTriangle className="h-4 w-4 shrink-0" />
      case "task_due_soon":
        return <Calendar className="h-4 w-4 shrink-0" />
      default:
        return <Bell className="h-4 w-4 shrink-0" />
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="right"
        className="w-[320px] p-0"
        sideOffset={8}
      >
        <div className="flex items-center justify-between border-b px-3 py-2">
          <span className="text-sm font-semibold">Bildirimler</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={markAllRead}
            >
              <CheckCheck className="mr-1 h-3.5 w-3.5" />
              Tümünü okundu işaretle
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-[320px]">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Bildirim yok
            </div>
          ) : (
            <div className="p-1">
              {notifications.map((n) => (
                <DropdownMenuItem key={n.id} asChild>
                  <Link
                    href={n.link ?? "#"}
                    onClick={() => {
                      if (!n.readAt) markOneRead(n.id)
                      setOpen(false)
                    }}
                    className={cn(
                      "flex cursor-pointer flex-col gap-0.5 rounded-md px-2 py-2",
                      !n.readAt && "bg-sidebar-accent/50"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {iconForType(n.type)}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium leading-tight">
                          {n.title}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                          {n.message}
                        </p>
                        <p className="mt-1 text-[10px] text-muted-foreground/80">
                          {new Date(n.createdAt).toLocaleDateString("tr-TR", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
