import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RiskBadge, UpdateStatusBadge } from "@/components/risk-badge"
import { formatDistanceToNow } from "date-fns"

type Update = {
  id: string
  sourceName: string
  publishedAt: string
  title: string
  riskLevel: string
  status: string
}

type Props = {
  updates: Update[]
}

export function RecentUpdates({ updates }: Props) {
  return (
    <Card className="card-premium card-hover animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Recent Regulatory Updates
        </CardTitle>
        <Link href="/updates" className="text-sm font-medium text-primary hover:underline underline-offset-2">
          View all
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {updates.length === 0 ? (
            <p className="text-sm text-muted-foreground leading-relaxed">No updates yet. Add sources to track regulatory changes.</p>
          ) : (
            updates.map((update) => (
              <Link
                key={update.id}
                href={`/updates/${update.id}`}
                className="flex flex-col gap-2 rounded-2xl border border-border/70 p-4 transition-all duration-200 hover:bg-accent/50 hover:border-primary/20"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">{update.sourceName}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(update.publishedAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm font-medium leading-relaxed text-foreground">
                  {update.title}
                </p>
                <div className="flex items-center gap-2">
                  <RiskBadge level={update.riskLevel as "critical" | "high" | "medium" | "low"} />
                  <UpdateStatusBadge status={update.status as "new" | "analyzed" | "mapped" | "actioned"} />
                </div>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
