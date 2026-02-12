export type RiskLevel = "critical" | "high" | "medium" | "low"
export type TaskStatus = "open" | "in_progress" | "review" | "done"
export type TaskPriority = "critical" | "high" | "medium" | "low"
export type UpdateStatus = "new" | "analyzed" | "mapped" | "actioned"
export type MappingConfidence = "high" | "medium" | "low"
export type EvidenceStatus = "draft" | "pending_review" | "approved"
export type AuditPackStatus = "draft" | "finalized"

export interface Source {
  id: string
  name: string
  url: string
  type: string
  active: boolean
  lastPolled: string | null
  createdAt: string
}

export interface RegulatoryUpdate {
  id: string
  sourceId: string
  sourceName: string
  title: string
  summary: string
  rawText: string
  normalizedText: string
  hash: string
  publishedAt: string
  status: UpdateStatus
  riskLevel: RiskLevel
  createdAt: string
}

export interface UpdateDiff {
  id: string
  updateId: string
  diffType: "addition" | "modification" | "deletion"
  section: string
  oldText: string | null
  newText: string
  impact: string
}

export interface Framework {
  id: string
  name: string
  version: string
  description: string
}

export interface Control {
  id: string
  frameworkId: string
  frameworkName: string
  controlRef: string
  title: string
  description: string
  category: string
}

export interface Mapping {
  id: string
  updateId: string
  controlId: string
  controlRef: string
  controlTitle: string
  updateTitle: string
  confidence: MappingConfidence
  rationale: string
  aiGenerated: boolean
  createdAt: string
}

export interface Task {
  id: string
  mappingId: string | null
  updateId: string
  controlRef: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assignee: string | null
  dueDate: string | null
  createdAt: string
}

export interface EvidenceItem {
  id: string
  taskId: string
  controlRef: string
  title: string
  template: string
  status: EvidenceStatus
  createdAt: string
}

export interface AuditPack {
  id: string
  title: string
  description: string
  status: AuditPackStatus
  taskIds: string[]
  evidenceIds: string[]
  createdAt: string
  finalizedAt: string | null
}

export interface DashboardMetrics {
  totalUpdates: number
  openTasks: number
  pendingMappings: number
  criticalRisks: number
  complianceScore: number
  updatesByMonth: { month: string; count: number }[]
  tasksByStatus: { status: string; count: number }[]
  riskDistribution: { level: string; count: number }[]
}
