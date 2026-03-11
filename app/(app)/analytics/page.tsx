"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useTranslations } from "@/components/locale-provider"
import { TranslatedPageHeader } from "@/components/translated-page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Download, TrendingUp, AlertCircle, Loader2 } from "lucide-react"

type DashboardMetrics = {
  totalUpdates: number
  openTasks: number
  pendingMappings: number
  criticalRisks: number
  complianceScore: number
  updatesByMonth: { month: string; count: number }[]
  tasksByStatus: { status: string; count: number }[]
  riskDistribution: { level: string; count: number }[]
}

export default function AnalyticsPage() {
  const { data: session } = useSession()
  const t = useTranslations().t
  const organizationId = (session?.user as { organizationId?: string } | undefined)?.organizationId
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!organizationId) return
    setLoading(true)
    fetch("/api/dashboard")
      .then((res) => (res.ok ? res.json() : null))
      .then(setMetrics)
      .catch(() => setMetrics(null))
      .finally(() => setLoading(false))
  }, [organizationId])

  if (loading) {
    return (
      <>
        <TranslatedPageHeader titleKey="analytics.title" descriptionKey="analytics.description" />
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </>
    )
  }

  const m = metrics ?? {
    totalUpdates: 0,
    openTasks: 0,
    pendingMappings: 0,
    criticalRisks: 0,
    complianceScore: 0,
    updatesByMonth: [],
    tasksByStatus: [],
    riskDistribution: [],
  }

  const riskColors = ["#dc2626", "#f97316", "#eab308", "#22c55e"]

  return (
    <>
      <TranslatedPageHeader
titleKey="analytics.title"
    descriptionKey="analytics.description"
      />

      <div className="content-max space-y-8 py-6 lg:py-8">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-premium card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{m.totalUpdates}</div>
            <p className="mt-1 text-sm text-muted-foreground">Regulatory updates tracked</p>
          </CardContent>
        </Card>
        <Card className="card-premium card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Open Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{m.openTasks}</div>
            <p className="mt-1 text-sm text-muted-foreground">Remediation tasks pending</p>
          </CardContent>
        </Card>
        <Card className="card-premium card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Compliance Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{m.complianceScore}%</div>
            <p className="mt-1 text-sm text-muted-foreground">Tasks completed rate</p>
          </CardContent>
        </Card>
        <Card className="card-premium card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Critical Risks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{m.criticalRisks}</div>
            <p className="mt-1 text-sm text-muted-foreground">Updates with critical risk</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="updates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="updates">Updates by Month</TabsTrigger>
          <TabsTrigger value="tasks">Tasks by Status</TabsTrigger>
          <TabsTrigger value="risk">Risk Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="updates" className="space-y-4">
          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="text-sm">Updates by Month</CardTitle>
              <CardDescription>Regulatory updates from your sources</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={m.updatesByMonth.length ? m.updatesByMonth : [{ month: "-", count: 0 }]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="text-sm">Tasks by Status</CardTitle>
              <CardDescription>From your task list</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={m.tasksByStatus.length ? m.tasksByStatus : [{ status: t("common.noData"), count: 1 }]}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {m.tasksByStatus.map((_, i) => (
                      <Cell key={i} fill={["hsl(var(--primary))", "#94a3b8", "#eab308", "#22c55e"][i % 4]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="text-sm">Risk Distribution</CardTitle>
              <CardDescription>Update risk levels</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={m.riskDistribution.length ? m.riskDistribution : [{ level: t("common.noData"), count: 1 }]}
                    dataKey="count"
                    nameKey="level"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {m.riskDistribution.map((_, i) => (
                      <Cell key={i} fill={riskColors[i % 4]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </>
  )
}
