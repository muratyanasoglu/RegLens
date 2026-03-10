"use client"

import { Badge } from "@/components/ui/badge"
import { useTranslations } from "@/components/locale-provider"
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

export function RiskBadge({ level }: { level: RiskLevel }) {
  const { t } = useTranslations()
  return <Badge className={cn("border-0", riskColors[level])}>{t(`badges.riskLevel.${level}`)}</Badge>
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  const { t } = useTranslations()
  return <Badge className={cn("border-0", statusColors[status])}>{t(`badges.taskStatus.${status}`)}</Badge>
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const { t } = useTranslations()
  return <Badge className={cn("border-0", priorityColors[priority])}>{t(`badges.taskPriority.${priority}`)}</Badge>
}

export function ConfidenceBadge({ confidence }: { confidence: MappingConfidence }) {
  const { t } = useTranslations()
  return <Badge className={cn("border-0", confidenceColors[confidence])}>{t(`badges.mappingConfidence.${confidence}`)}</Badge>
}

export function UpdateStatusBadge({ status }: { status: UpdateStatus }) {
  const { t } = useTranslations()
  return <Badge className={cn("border-0", updateStatusColors[status])}>{t(`badges.updateStatus.${status}`)}</Badge>
}

export function EvidenceStatusBadge({ status }: { status: EvidenceStatus }) {
  const { t } = useTranslations()
  return <Badge className={cn("border-0", evidenceStatusColors[status])}>{t(`badges.evidenceStatus.${status}`)}</Badge>
}

export function AuditPackStatusBadge({ status }: { status: AuditPackStatus }) {
  const { t } = useTranslations()
  return <Badge className={cn("border-0", auditPackStatusColors[status])}>{t(`badges.auditPackStatus.${status}`)}</Badge>
}
