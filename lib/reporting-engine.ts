import { z } from 'zod'

export type ReportType = 'compliance-scorecard' | 'gap-analysis' | 'risk-summary' | 'task-status' | 'audit-readiness' | 'executive-summary' | 'custom'
export type ReportFormat = 'pdf' | 'xlsx' | 'csv' | 'html' | 'json'
export type ReportFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'on-demand'

export interface ReportConfig {
  id?: string
  name: string
  type: ReportType
  format: ReportFormat
  frequency: ReportFrequency
  recipients: string[]
  filters?: Record<string, any>
  includeCharts: boolean
  includeDetails: boolean
  createdAt?: Date
  lastRun?: Date
}

export interface ReportData {
  id: string
  name: string
  type: ReportType
  generatedAt: Date
  period: { start: Date; end: Date }
  summary: Record<string, any>
  sections: ReportSection[]
  metrics: ComplianceMetrics
}

export interface ReportSection {
  title: string
  description?: string
  data: any
  charts?: ChartConfig[]
}

export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'heatmap'
  title: string
  dataKey: string
  color?: string
}

export interface ComplianceMetrics {
  overallScore: number
  frameworks: FrameworkMetric[]
  trends: TrendData[]
  risks: RiskMetric[]
  topGaps: GapItem[]
}

export interface FrameworkMetric {
  frameworkId: string
  name: string
  score: number
  controlsCovered: number
  controlsTotal: number
  status: 'compliant' | 'partial' | 'non-compliant' | 'pending'
}

export interface TrendData {
  period: string
  value: number
  change: number
}

export interface RiskMetric {
  level: 'critical' | 'high' | 'medium' | 'low'
  count: number
  trend: 'increasing' | 'stable' | 'decreasing'
}

export interface GapItem {
  frameworkControl: string
  description: string
  severity: string
  remediationDue: Date
}

export const ReportConfigSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['compliance-scorecard', 'gap-analysis', 'risk-summary', 'task-status', 'audit-readiness', 'executive-summary', 'custom']),
  format: z.enum(['pdf', 'xlsx', 'csv', 'html', 'json']),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'annually', 'on-demand']),
  recipients: z.array(z.string().email()),
  includeCharts: z.boolean().default(true),
  includeDetails: z.boolean().default(false),
})

export class ReportingEngine {
  static async generateComplianceScorecard(
    organizationId: string,
    frameworkIds?: string[]
  ): Promise<ComplianceMetrics> {
    const metrics: ComplianceMetrics = {
      overallScore: 92,
      frameworks: [
        {
          frameworkId: 'nist-csf',
          name: 'NIST CSF',
          score: 95,
          controlsCovered: 105,
          controlsTotal: 108,
          status: 'compliant',
        },
        {
          frameworkId: 'iso-27001',
          name: 'ISO 27001',
          score: 88,
          controlsCovered: 100,
          controlsTotal: 114,
          status: 'partial',
        },
        {
          frameworkId: 'soc2-type2',
          name: 'SOC 2 Type II',
          score: 92,
          controlsCovered: 78,
          controlsTotal: 85,
          status: 'compliant',
        },
      ],
      trends: [
        { period: 'Jan 2024', value: 78, change: 0 },
        { period: 'Feb 2024', value: 82, change: 5 },
        { period: 'Mar 2024', value: 85, change: 4 },
        { period: 'Apr 2024', value: 88, change: 4 },
        { period: 'May 2024', value: 92, change: 5 },
      ],
      risks: [
        { level: 'critical', count: 2, trend: 'decreasing' },
        { level: 'high', count: 12, trend: 'stable' },
        { level: 'medium', count: 34, trend: 'increasing' },
        { level: 'low', count: 89, trend: 'stable' },
      ],
      topGaps: [
        {
          frameworkControl: 'ISO.A.9.2.1',
          description: 'User access review not conducted quarterly',
          severity: 'high',
          remediationDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        {
          frameworkControl: 'NIST.PR.MA-1',
          description: 'Maintenance procedures incomplete for 3 systems',
          severity: 'medium',
          remediationDue: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        },
      ],
    }

    return metrics
  }

  static async generateGapAnalysis(frameworkId: string): Promise<ReportSection> {
    return {
      title: 'Gap Analysis Report',
      description: `Detailed gap analysis for ${frameworkId}`,
      data: {
        totalControls: 114,
        implemented: 100,
        partial: 8,
        notImplemented: 6,
        coverage: 87.7,
        byCategory: [
          { category: 'Access Control', implemented: 15, gap: 2 },
          { category: 'Cryptography', implemented: 8, gap: 1 },
          { category: 'Physical Security', implemented: 12, gap: 3 },
          { category: 'Incident Management', implemented: 10, gap: 0 },
        ],
      },
      charts: [
        {
          type: 'pie',
          title: 'Control Implementation Status',
          dataKey: 'status',
        },
        {
          type: 'bar',
          title: 'Gap by Category',
          dataKey: 'category',
        },
      ],
    }
  }

  static async generateRiskSummary(organizationId: string): Promise<ReportSection> {
    return {
      title: 'Risk Summary',
      data: {
        totalRisks: 137,
        critical: 2,
        high: 12,
        medium: 34,
        low: 89,
        trend: 'improving',
        risksBySource: [
          { source: 'Regulatory Updates', count: 23, percentage: 17 },
          { source: 'Vulnerabilities', count: 45, percentage: 33 },
          { source: 'Access Issues', count: 34, percentage: 25 },
          { source: 'Process Gaps', count: 35, percentage: 25 },
        ],
      },
      charts: [
        {
          type: 'heatmap',
          title: 'Risk Heat Map',
          dataKey: 'risk_level',
        },
      ],
    }
  }

  static async generateTaskStatusReport(): Promise<ReportSection> {
    return {
      title: 'Task Status Report',
      data: {
        totalTasks: 245,
        open: 45,
        inProgress: 28,
        review: 12,
        completed: 160,
        overdue: 5,
        completionRate: 65.3,
        avgResolutionTime: 8.2, // days
      },
      charts: [
        {
          type: 'bar',
          title: 'Tasks by Status',
          dataKey: 'status',
        },
      ],
    }
  }

  static async generateAuditReadinessReport(): Promise<ReportData> {
    const report: ReportData = {
      id: `report-${Date.now()}`,
      name: 'Audit Readiness Assessment',
      type: 'audit-readiness',
      generatedAt: new Date(),
      period: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date(),
      },
      summary: {
        readinessScore: 85,
        status: 'Ready for Audit',
        estimatedCompletionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        lastAudit: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      },
      sections: [
        {
          title: 'Compliance Status',
          data: { frameworks: 6, fullyCertified: 4, inProgress: 2 },
        },
        {
          title: 'Evidence Collection',
          data: { required: 450, collected: 423, percentage: 94 },
        },
        {
          title: 'Outstanding Issues',
          data: { critical: 0, high: 3, medium: 12, low: 34 },
        },
      ],
      metrics: await this.generateComplianceScorecard('org-1'),
    }

    return report
  }

  static async buildCustomReport(config: ReportConfig): Promise<ReportData> {
    const report: ReportData = {
      id: `report-${Date.now()}`,
      name: config.name,
      type: 'custom',
      generatedAt: new Date(),
      period: {
        start: config.filters?.startDate || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        end: config.filters?.endDate || new Date(),
      },
      summary: config.filters || {},
      sections: [],
      metrics: await this.generateComplianceScorecard('org-1', config.filters?.frameworks),
    }

    return report
  }

  static async exportReport(report: ReportData, format: ReportFormat): Promise<Blob> {
    const content = this.formatReport(report, format)
    return new Blob([content], { type: this.getMimeType(format) })
  }

  private static formatReport(report: ReportData, format: ReportFormat): string {
    switch (format) {
      case 'json':
        return JSON.stringify(report, null, 2)
      case 'csv':
        return this.toCSV(report)
      case 'html':
        return this.toHTML(report)
      case 'pdf':
      case 'xlsx':
      default:
        return JSON.stringify(report)
    }
  }

  private static toCSV(report: ReportData): string {
    let csv = 'Report Name,Generated Date,Type\n'
    csv += `"${report.name}","${report.generatedAt.toISOString()}","${report.type}"\n\n`
    csv += 'Metric,Value\n'
    Object.entries(report.summary).forEach(([key, value]) => {
      csv += `"${key}","${value}"\n`
    })
    return csv
  }

  private static toHTML(report: ReportData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${report.name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; }
          table { border-collapse: collapse; width: 100%; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>${report.name}</h1>
        <p>Generated: ${report.generatedAt.toISOString()}</p>
        <p>Type: ${report.type}</p>
        <h2>Summary</h2>
        <table>
          <tr><th>Metric</th><th>Value</th></tr>
          ${Object.entries(report.summary)
            .map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`)
            .join('')}
        </table>
      </body>
      </html>
    `
  }

  private static getMimeType(format: ReportFormat): string {
    const mimeTypes: Record<ReportFormat, string> = {
      json: 'application/json',
      csv: 'text/csv',
      html: 'text/html',
      pdf: 'application/pdf',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }
    return mimeTypes[format]
  }

  static validateConfig(config: Partial<ReportConfig>): boolean {
    try {
      ReportConfigSchema.parse(config)
      return true
    } catch {
      return false
    }
  }
}

export class ReportScheduler {
  private schedules: Map<string, ReportConfig> = new Map()

  scheduleReport(config: ReportConfig): string {
    const id = `schedule-${Date.now()}`
    this.schedules.set(id, { ...config, id })
    return id
  }

  getSchedules(): ReportConfig[] {
    return Array.from(this.schedules.values())
  }

  async executeScheduledReports(): Promise<void> {
    for (const [id, config] of this.schedules) {
      if (config.frequency !== 'on-demand') {
        const report = await ReportingEngine.buildCustomReport(config)
        for (const recipient of config.recipients) {
          await this.sendReport(recipient, report, config.format)
        }
      }
    }
  }

  private async sendReport(recipient: string, report: ReportData, format: ReportFormat): Promise<void> {
    console.log(`Sending ${report.type} report to ${recipient} as ${format}`)
  }
}

export const reportScheduler = new ReportScheduler()
