import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { RiskLevel, TaskStatus, TaskPriority, MappingConfidence, UpdateStatus, EvidenceStatus, AuditPackStatus } from "@/lib/types"

const riskColors: Record<RiskLevel, string> = {
  critical: "bg-destructive text-destructive-foreground",
  high: "bg-warning text-warning-foreground",
  medium: "bg-primary text-primary-foreground",
  low: "bg-success text-success-foreground",
}

const statusColors: Record<TaskStatus, string> = {
  open: "bg-secondary text-secondary-foreground",
  in_progress: "bg-primary text-primary-foreground",
  review: "bg-warning text-warning-foreground",
  done: "bg-success text-success-foreground",
}

const priorityColors: Record<TaskPriority, string> = {
  critical: "bg-destructive text-destructive-foreground",
  high: "bg-warning text-warning-foreground",
  medium: "bg-primary text-primary-foreground",
  low: "bg-success text-success-foreground",
}

const confidenceColors: Record<MappingConfidence, string> = {
  high: "bg-success text-success-foreground",
  medium: "bg-warning text-warning-foreground",
  low: "bg-destructive text-destructive-foreground",
}

const updateStatusColors: Record<UpdateStatus, string> = {
  new: "bg-primary text-primary-foreground",
  analyzed: "bg-warning text-warning-foreground",
  mapped: "bg-success text-success-foreground",
  actioned: "bg-secondary text-secondary-foreground border border-border",
}

const evidenceStatusColors: Record<EvidenceStatus, string> = {
  draft: "bg-secondary text-secondary-foreground",
  pending_review: "bg-warning text-warning-foreground",
  approved: "bg-success text-success-foreground",
}

const auditPackStatusColors: Record<AuditPackStatus, string> = {
  draft: "bg-warning text-warning-foreground",
  finalized: "bg-success text-success-foreground",
}

function formatLabel(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  return <Badge className={cn("border-0", riskColors[level])}>{formatLabel(level)}</Badge>
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  return <Badge className={cn("border-0", statusColors[status])}>{formatLabel(status)}</Badge>
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return <Badge className={cn("border-0", priorityColors[priority])}>{formatLabel(priority)}</Badge>
}

export function ConfidenceBadge({ confidence }: { confidence: MappingConfidence }) {
  return <Badge className={cn("border-0", confidenceColors[confidence])}>{formatLabel(confidence)}</Badge>
}

export function UpdateStatusBadge({ status }: { status: UpdateStatus }) {
  return <Badge className={cn("border-0", updateStatusColors[status])}>{formatLabel(status)}</Badge>
}

export function EvidenceStatusBadge({ status }: { status: EvidenceStatus }) {
  return <Badge className={cn("border-0", evidenceStatusColors[status])}>{formatLabel(status)}</Badge>
}

export function AuditPackStatusBadge({ status }: { status: AuditPackStatus }) {
  return <Badge className={cn("border-0", auditPackStatusColors[status])}>{formatLabel(status)}</Badge>
}
