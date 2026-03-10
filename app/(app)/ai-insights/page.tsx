"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { TranslatedPageHeader } from "@/components/translated-page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Lightbulb, TrendingUp, Zap, Loader2 } from "lucide-react"

export default function AIInsightsPage() {
  const { data: session } = useSession()
  const organizationId = (session?.user as { organizationId?: string } | undefined)?.organizationId
  const [mappings, setMappings] = useState<{ id: string; confidence: string; update?: { title: string }; control?: { controlRef: string } }[]>([])
  const [tasks, setTasks] = useState<{ id: string; status: string; title: string; priority: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!organizationId) return
    setLoading(true)
    Promise.all([
      fetch("/api/mappings").then((r) => (r.ok ? r.json() : [])),
      fetch("/api/tasks").then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([mapData, taskData]) => {
        setMappings(Array.isArray(mapData) ? mapData : [])
        setTasks(Array.isArray(taskData) ? taskData : [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [organizationId])

  const lowConfidenceMappings = mappings.filter((m) => m.confidence === "low")
  const openTasks = tasks.filter((t) => t.status !== "done")
  const criticalTasks = tasks.filter((t) => t.priority === "critical" && t.status !== "done")

  const recommendations = [
    ...(lowConfidenceMappings.length > 0
      ? [
          {
            id: "rev-low",
            type: "Control Mapping",
            title: "Review low-confidence mappings",
            description: `${lowConfidenceMappings.length} mapping(s) have low confidence and may need manual review.`,
            impact: "high",
            action: "Review Mappings",
            href: "/controls",
          },
        ]
      : []),
    ...(criticalTasks.length > 0
      ? [
          {
            id: "crit-tasks",
            type: "Tasks",
            title: "Critical priority tasks",
            description: `${criticalTasks.length} critical task(s) require immediate action.`,
            impact: "critical",
            action: "View Tasks",
            href: "/tasks",
          },
        ]
      : []),
    ...(openTasks.length > 5
      ? [
          {
            id: "open-many",
            type: "Automation",
            title: "Many open tasks",
            description: `${openTasks.length} open tasks. Consider assigning and prioritizing.`,
            impact: "medium",
            action: "View Tasks",
            href: "/tasks",
          },
        ]
      : []),
  ]

  if (recommendations.length === 0 && mappings.length === 0 && tasks.length === 0) {
    recommendations.push({
      id: "empty",
      type: "Getting Started",
      title: "Add data to see insights",
      description: "Add sources, updates, mappings, and tasks to get AI-driven recommendations.",
      impact: "medium",
      action: "Dashboard",
      href: "/dashboard",
    })
  }

  if (loading) {
    return (
      <>
        <TranslatedPageHeader titleKey="aiInsights.title" descriptionKey="aiInsights.description" />
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </>
    )
  }

  return (
    <>
      <TranslatedPageHeader
        titleKey="aiInsights.title"
        descriptionKey="aiInsights.description"
      />

      <div className="content-max space-y-8 py-6 lg:py-8">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="card-premium card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Mappings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mappings.length}</div>
            <p className="mt-1 text-sm text-muted-foreground">Update-to-control mappings</p>
          </CardContent>
        </Card>
        <Card className="card-premium card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Open Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{openTasks.length}</div>
            <p className="mt-1 text-sm text-muted-foreground">Pending remediation</p>
          </CardContent>
        </Card>
        <Card className="card-premium card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Low Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{lowConfidenceMappings.length}</div>
            <p className="mt-1 text-sm text-muted-foreground">Mappings to review</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recommendations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-4">
          <Card className="card-premium">
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
              <CardDescription>Based on your mappings and tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                        <Lightbulb className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{rec.title}</p>
                        <p className="text-sm text-muted-foreground">{rec.description}</p>
                        <Badge
                          variant={
                            rec.impact === "critical"
                              ? "destructive"
                              : rec.impact === "high"
                                ? "default"
                                : "secondary"
                          }
                          className="mt-2"
                        >
                          {rec.impact}
                        </Badge>
                      </div>
                    </div>
                    <Button size="sm" asChild>
                      <Link href={rec.href}>{rec.action}</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </>
  )
}
