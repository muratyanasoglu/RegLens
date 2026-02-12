"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DashboardMetricsResult } from "@/lib/db-queries"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

const RISK_COLORS = ["hsl(0, 72%, 51%)", "hsl(38, 92%, 50%)", "hsl(199, 89%, 48%)", "hsl(160, 60%, 42%)"]
const TASK_COLORS = ["hsl(220, 14%, 70%)", "hsl(199, 89%, 48%)", "hsl(38, 92%, 50%)", "hsl(160, 60%, 42%)"]

type Props = {
  metrics: DashboardMetricsResult
}

export function DashboardCharts({ metrics }: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="card-premium animate-fade-in lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Updates by Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={metrics.updatesByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(199, 89%, 48%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="card-premium animate-fade-in">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Risk Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={metrics.riskDistribution}
                dataKey="count"
                nameKey="level"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={45}
              >
                {metrics.riskDistribution.map((_, index) => (
                  <Cell key={`risk-${index}`} fill={RISK_COLORS[index % RISK_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend fontSize={12} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="card-premium animate-fade-in">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Tasks by Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={metrics.tasksByStatus}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={45}
              >
                {metrics.tasksByStatus.map((_, index) => (
                  <Cell key={`task-${index}`} fill={TASK_COLORS[index % TASK_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend fontSize={12} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
