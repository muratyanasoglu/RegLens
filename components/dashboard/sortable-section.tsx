"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "@/components/locale-provider"

const SECTION_IDS = ["metrics", "charts", "recent-updates", "critical-tasks", "activity-feed"] as const
type SectionId = (typeof SECTION_IDS)[number]

type Props = {
  id: SectionId
  children: React.ReactNode
}

export function SortableSection({ id, children }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })
  const t = useTranslations().t
  const sectionLabel = t(`dashboard.sections.${id}`)
  const dragHint = t("dashboard.dragHint")

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group/section flex gap-3 transition-all duration-200",
        isDragging && "z-50 scale-[1.01] opacity-95"
      )}
    >
      <button
        type="button"
        aria-label={`${dragHint}: ${sectionLabel}`}
        className={cn(
          "flex shrink-0 touch-none cursor-grab items-center justify-center self-start rounded-xl border-0 p-2.5 text-muted-foreground transition-colors hover:bg-primary/15 hover:text-primary active:cursor-grabbing",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        )}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" aria-hidden />
      </button>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

export type { SectionId }
export { SECTION_IDS }
