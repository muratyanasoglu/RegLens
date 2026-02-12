"use client"

import { useState, useEffect, useCallback } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import type { DashboardMetricsResult } from "@/lib/db-queries"
import { SortableSection, type SectionId } from "./sortable-section"
import { DashboardMetrics } from "./dashboard-metrics"
import { DashboardCharts } from "./dashboard-charts"
import { RecentUpdates } from "./recent-updates"
import { CriticalTasks } from "./critical-tasks"
import { ActivityFeed } from "./activity-feed"

const STORAGE_KEY = "reglens-dashboard-section-order"
const DEFAULT_ORDER: SectionId[] = [
  "metrics",
  "charts",
  "recent-updates",
  "critical-tasks",
  "activity-feed",
]

function loadOrder(): SectionId[] {
  if (typeof window === "undefined") return DEFAULT_ORDER
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_ORDER
    const parsed = JSON.parse(raw) as string[]
    const valid = DEFAULT_ORDER.filter((id) => parsed.includes(id))
    const missing = DEFAULT_ORDER.filter((id) => !parsed.includes(id))
    return [...valid, ...missing]
  } catch {
    return DEFAULT_ORDER
  }
}

function saveOrder(order: SectionId[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(order))
  } catch {}
}

export type RecentUpdateItem = {
  id: string
  sourceName: string
  publishedAt: string
  title: string
  riskLevel: string
  status: string
}

export type CriticalTaskItem = {
  id: string
  controlRef: string
  assignee: string | null
  title: string
  priority: string
  status: string
}

type Props = {
  metrics: DashboardMetricsResult
  recentUpdates: RecentUpdateItem[]
  criticalTasks: CriticalTaskItem[]
}

export function DashboardSortable({ metrics, recentUpdates, criticalTasks }: Props) {
  const [order, setOrder] = useState<SectionId[]>(DEFAULT_ORDER)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setOrder(loadOrder())
    setMounted(true)
  }, [])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setOrder((prev) => {
      const oldIndex = prev.indexOf(active.id as SectionId)
      const newIndex = prev.indexOf(over.id as SectionId)
      if (oldIndex === -1 || newIndex === -1) return prev
      const next = arrayMove(prev, oldIndex, newIndex)
      saveOrder(next)
      return next
    })
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const renderSection = (id: SectionId) => {
    switch (id) {
      case "metrics":
        return <DashboardMetrics metrics={metrics} />
      case "charts":
        return <DashboardCharts metrics={metrics} />
      case "recent-updates":
        return <RecentUpdates updates={recentUpdates} />
      case "critical-tasks":
        return <CriticalTasks tasks={criticalTasks} />
      case "activity-feed":
        return <ActivityFeed />
      default:
        return null
    }
  }

  if (!mounted) {
    return (
      <div className="content-max flex flex-col gap-10 py-8 lg:py-10">
        {DEFAULT_ORDER.map((id) => (
          <div key={id} className="rounded-2xl border border-border/70 bg-card p-4">
            <div className="h-24 animate-pulse rounded-xl bg-muted/50" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={order} strategy={verticalListSortingStrategy}>
        <div className="content-max flex flex-col gap-6 py-8 lg:py-10">
          {order.map((id) => (
            <SortableSection key={id} id={id}>
              {renderSection(id)}
            </SortableSection>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
