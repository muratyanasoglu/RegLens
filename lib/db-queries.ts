"use server"

import { prisma } from "@/lib/prisma"

export type DashboardMetricsResult = {
  totalUpdates: number
  openTasks: number
  pendingMappings: number
  criticalRisks: number
  complianceScore: number
  updatesByMonth: { month: string; count: number }[]
  tasksByStatus: { status: string; count: number }[]
  riskDistribution: { level: string; count: number }[]
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export async function getDashboardMetrics(organizationId: string): Promise<DashboardMetricsResult> {
  const [updates, tasks, mappings] = await Promise.all([
    prisma.regulatoryUpdate.findMany({
      where: { source: { organizationId } },
      select: { id: true, riskLevel: true, status: true, createdAt: true },
    }),
    prisma.task.findMany({
      where: { organizationId },
      select: { id: true, status: true },
    }),
    prisma.mapping.findMany({
      where: { update: { source: { organizationId } } },
      select: { id: true, confidence: true },
    }),
  ])

  const totalUpdates = updates.length
  const openTasks = tasks.filter((t) => t.status === "open" || t.status === "in_progress").length
  const pendingMappings = mappings.filter((m) => m.confidence === "low").length
  const criticalRisks = updates.filter((u) => u.riskLevel === "critical").length
  const doneCount = tasks.filter((t) => t.status === "done").length
  const complianceScore = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0

  const monthCounts: Record<string, number> = {}
  MONTHS.forEach((m) => (monthCounts[m] = 0))
  updates.forEach((u) => {
    const m = MONTHS[new Date(u.createdAt).getMonth()]
    monthCounts[m] = (monthCounts[m] || 0) + 1
  })
  const updatesByMonth = MONTHS.slice(-4).map((month) => ({ month, count: monthCounts[month] ?? 0 }))

  const statusCounts: Record<string, number> = {}
  tasks.forEach((t) => {
    const s = t.status === "in_progress" ? "In Progress" : t.status.charAt(0).toUpperCase() + t.status.slice(1)
    statusCounts[s] = (statusCounts[s] || 0) + 1
  })
  const tasksByStatus = ["Open", "In Progress", "Review", "Done"].map((status) => ({
    status,
    count: statusCounts[status] ?? 0,
  }))

  const riskCounts: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0 }
  updates.forEach((u) => { riskCounts[u.riskLevel] = (riskCounts[u.riskLevel] || 0) + 1 })
  const riskDistribution = [
    { level: "Critical", count: riskCounts.critical ?? 0 },
    { level: "High", count: riskCounts.high ?? 0 },
    { level: "Medium", count: riskCounts.medium ?? 0 },
    { level: "Low", count: riskCounts.low ?? 0 },
  ]

  return {
    totalUpdates,
    openTasks,
    pendingMappings,
    criticalRisks,
    complianceScore,
    updatesByMonth,
    tasksByStatus,
    riskDistribution,
  }
}

export async function getSources(organizationId: string) {
  return prisma.source.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
  })
}

export async function getUpdates(organizationId: string, limit = 50) {
  return prisma.regulatoryUpdate.findMany({
    where: { source: { organizationId } },
    include: {
      source: { select: { id: true, name: true } },
      _count: { select: { mappings: true } },
    },
    orderBy: { publishedAt: "desc" },
    take: limit,
  })
}

export async function getUpdateById(updateId: string, organizationId: string) {
  return prisma.regulatoryUpdate.findFirst({
    where: {
      id: updateId,
      source: { organizationId },
    },
    include: {
      source: true,
      diffs: true,
      mappings: { include: { control: { include: { framework: true } } } },
      tasks: {
        include: {
          assignee: { select: { name: true, username: true } },
          mapping: { include: { control: { select: { controlRef: true } } } },
        },
      },
    },
  })
}

export async function getTasks(organizationId: string) {
  return prisma.task.findMany({
    where: { organizationId },
    include: {
      assignee: { select: { id: true, name: true, username: true } },
      mapping: { include: { control: true } },
      update: { include: { source: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getTaskById(taskId: string, organizationId: string) {
  return prisma.task.findFirst({
    where: { id: taskId, organizationId },
    include: {
      assignee: true,
      mapping: { include: { control: { include: { framework: true } }, update: true } },
      update: { include: { source: true } },
      evidence: true,
    },
  })
}

export async function getFrameworks() {
  return prisma.framework.findMany({
    orderBy: { name: "asc" },
    include: { controls: true },
  })
}

export async function getFrameworkById(frameworkId: string) {
  return prisma.framework.findUnique({
    where: { id: frameworkId },
    include: { controls: { orderBy: { controlRef: "asc" } } },
  })
}

export async function getControls() {
  return prisma.control.findMany({
    include: { framework: true },
    orderBy: [{ framework: { name: "asc" } }, { controlRef: "asc" }],
  })
}

export async function getMappingsForOrg(organizationId: string) {
  return prisma.mapping.findMany({
    where: { update: { source: { organizationId } } },
    include: {
      update: { select: { id: true, title: true } },
      control: { include: { framework: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getEvidenceItems(organizationId: string) {
  return prisma.evidenceItem.findMany({
    where: { task: { organizationId } },
    include: { task: { select: { id: true, title: true } } },
    orderBy: { createdAt: "desc" },
  })
}

export async function getAuditPacks(organizationId: string) {
  return prisma.auditPack.findMany({
    where: { organizationId },
    include: {
      tasks: { select: { id: true, title: true } },
      evidence: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getAuditPackById(packId: string, organizationId: string) {
  return prisma.auditPack.findFirst({
    where: { id: packId, organizationId },
    include: {
      tasks: {
        include: {
          assignee: { select: { name: true, username: true } },
          mapping: { include: { control: { select: { controlRef: true } } } },
        },
      },
      evidence: true,
    },
  })
}

export async function getOrgUsers(organizationId: string) {
  const members = await prisma.organizationMember.findMany({
    where: { organizationId },
    include: { user: { select: { id: true, name: true, username: true, email: true } } },
  })
  return members.map((m) => ({
    id: m.user.id,
    name: m.user.name,
    username: m.user.username,
    email: m.user.email,
    role: m.role,
  }))
}

export type UserOrganizationItem = { id: string; name: string; slug: string; role: string }

export async function getOrganizationsForUser(userId: string): Promise<UserOrganizationItem[]> {
  const members = await prisma.organizationMember.findMany({
    where: { userId },
    include: { organization: { select: { id: true, name: true, slug: true } } },
  })
  return members.map((m) => ({
    id: m.organization.id,
    name: m.organization.name,
    slug: m.organization.slug,
    role: m.role,
  }))
}

export async function getAuditLogs(organizationId: string, limit = 100) {
  return prisma.auditLog.findMany({
    where: { organizationId },
    include: { user: { select: { email: true, username: true } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  })
}

export async function getComplianceCertifications(organizationId: string) {
  return prisma.complianceCertification.findMany({
    where: { organizationId },
    orderBy: { type: "asc" },
  })
}

export async function getSecurityPolicies(organizationId: string) {
  return prisma.securityPolicy.findMany({
    where: { organizationId },
    orderBy: { name: "asc" },
  })
}
