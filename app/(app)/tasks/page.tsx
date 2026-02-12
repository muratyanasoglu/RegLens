"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
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
import { StatusBadge, PriorityBadge } from "@/components/risk-badge"
import { format } from "date-fns"
import { Search, ArrowRight, Loader2 } from "lucide-react"

type Task = {
  id: string
  title: string
  controlRef: string
  priority: string
  status: string
  assignee: string | null
  dueDate: string | null
}

function mapTask(t: {
  id: string
  title: string
  priority: string
  status: string
  dueDate: Date | null
  assignee?: { name: string | null; username: string } | null
  mapping?: { control?: { controlRef: string } } | null
}): Task {
  return {
    id: t.id,
    title: t.title,
    controlRef: t.mapping?.control?.controlRef ?? "—",
    priority: t.priority,
    status: t.status,
    assignee: t.assignee?.name ?? t.assignee?.username ?? null,
    dueDate: t.dueDate ? new Date(t.dueDate).toISOString() : null,
  }
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setTasks(Array.isArray(data) ? data.map(mapTask) : []))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.controlRef.toLowerCase().includes(search.toLowerCase()) ||
      (t.assignee ?? "").toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || t.status === statusFilter
    const matchesPriority = priorityFilter === "all" || t.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const sorted = [...filtered].sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 }
    return order[a.priority as keyof typeof order] - order[b.priority as keyof typeof order]
  })

  if (loading) {
    return (
      <div className="flex flex-col">
        <PageHeader title="Tasks" description="Remediation tasks from regulatory mappings" />
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Tasks"
        description="Remediation tasks generated from regulatory mappings"
      />

      <div className="content-max flex flex-col gap-6 py-6 lg:py-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Control</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((task) => (
                <TableRow key={task.id} className="group">
                  <TableCell>
                    <Link
                      href={`/tasks/${task.id}`}
                      className="font-medium text-card-foreground hover:text-primary"
                    >
                      {task.title}
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-primary">
                    {task.controlRef}
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={task.priority as "critical" | "high" | "medium" | "low"} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={task.status as "open" | "in_progress" | "review" | "done"} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {task.assignee ?? "Unassigned"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "No date"}
                  </TableCell>
                  <TableCell>
                    <Link href={`/tasks/${task.id}`}>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {sorted.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                    No tasks match your filters. Create tasks from updates or mappings.
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
