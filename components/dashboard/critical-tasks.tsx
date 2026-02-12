import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge, PriorityBadge } from "@/components/risk-badge"

type Task = {
  id: string
  controlRef: string
  assignee: string | null
  title: string
  priority: string
  status: string
}

type Props = {
  tasks: Task[]
}

export function CriticalTasks({ tasks }: Props) {
  return (
    <Card className="card-premium card-hover animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Priority Tasks
        </CardTitle>
        <Link href="/tasks" className="text-sm font-medium text-primary hover:underline underline-offset-2">
          View all
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground leading-relaxed">No priority tasks. Create tasks from mappings or updates.</p>
          ) : (
            tasks.map((task) => (
              <Link
                key={task.id}
                href={`/tasks/${task.id}`}
                className="flex flex-col gap-2 rounded-2xl border border-border/70 p-4 transition-all duration-200 hover:bg-accent/50 hover:border-primary/20"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono text-muted-foreground">
                    {task.controlRef}
                  </span>
                  {task.assignee && (
                    <span className="text-xs text-muted-foreground">{task.assignee}</span>
                  )}
                </div>
                <p className="text-sm font-medium leading-relaxed text-foreground">
                  {task.title}
                </p>
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={task.priority as "critical" | "high" | "medium" | "low"} />
                  <StatusBadge status={task.status as "open" | "in_progress" | "review" | "done"} />
                </div>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
