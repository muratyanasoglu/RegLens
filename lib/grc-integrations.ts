import { z } from 'zod'

export type GRCPlatform = 'servicenow' | 'archer' | 'workiva' | 'logicgate' | 'nessus' | 'tenable'

export interface GRCIntegrationConfig {
  platformId: GRCPlatform
  name: string
  description: string
  apiEndpoint: string
  apiKey: string
  apiSecret?: string
  enabled: boolean
  syncInterval: number // minutes
  lastSync?: Date
  status: 'connected' | 'error' | 'disconnected'
  errorMessage?: string
}

export const IntegrationSchema = z.object({
  platformId: z.enum(['servicenow', 'archer', 'workiva', 'logicgate', 'nessus', 'tenable']),
  apiKey: z.string().min(1),
  apiSecret: z.string().optional(),
  syncInterval: z.number().min(5).max(1440),
})

export type IntegrationInput = z.infer<typeof IntegrationSchema>

export class ServiceNowIntegration {
  private config: GRCIntegrationConfig
  private baseUrl: string

  constructor(config: GRCIntegrationConfig) {
    this.config = config
    this.baseUrl = config.apiEndpoint
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/now/table/incident?sysparm_limit=1`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.config.apiKey}:${this.config.apiSecret}`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
      })
      return response.ok
    } catch (e) {
      console.error('ServiceNow connection failed:', e)
      return false
    }
  }

  async syncControls(): Promise<string[]> {
    return ['SN-CTRL-001', 'SN-CTRL-002', 'SN-CTRL-003']
  }

  async syncIncidents(): Promise<any[]> {
    return []
  }

  async createTask(title: string, description: string, assignee: string): Promise<string> {
    return 'INC0123456'
  }
}

export class ArcherIntegration {
export class ArcherIntegration {
  private config: GRCIntegrationConfig
  private baseUrl: string

  constructor(config: GRCIntegrationConfig) {
    this.config = config
    this.baseUrl = config.apiEndpoint
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/core/security/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          userName: this.config.apiKey,
          password: this.config.apiSecret,
        }),
      })
      return response.ok
    } catch (e) {
      console.error('Archer connection failed:', e)
      return false
    }
  }

  async syncRisks(): Promise<any[]> {
    return []
  }

  async syncCompliance(): Promise<any[]> {
    return []
  }

  async updateControl(controlId: string, status: string): Promise<boolean> {
    return true
  }
}

export class WorkivaIntegration {
export class WorkivaIntegration {
  private config: GRCIntegrationConfig
  private baseUrl: string

  constructor(config: GRCIntegrationConfig) {
    this.config = config
    this.baseUrl = config.apiEndpoint
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/environments`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
      })
      return response.ok
    } catch (e) {
      console.error('Workiva connection failed:', e)
      return false
    }
  }

  async fetchComplexes(): Promise<any[]> {
    return []
  }

  async syncDocuments(): Promise<any[]> {
    return []
  }

  async exportAuditPackage(packageData: any): Promise<string> {
    return 'workiva-package-id'
  }
}

export class LogicGateIntegration {
export class LogicGateIntegration {
  private config: GRCIntegrationConfig
  private baseUrl: string

  constructor(config: GRCIntegrationConfig) {
    this.config = config
    this.baseUrl = config.apiEndpoint
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v2/orgs`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
      })
      return response.ok
    } catch (e) {
      console.error('LogicGate connection failed:', e)
      return false
    }
  }

  async syncRisks(): Promise<any[]> {
    return []
  }

  async createInitiative(title: string, description: string): Promise<string> {
    return 'logicgate-initiative-id'
  }

  async syncRiskAssessments(): Promise<any[]> {
    return []
  }
}

export class GRCIntegrationFactory {
export class GRCIntegrationFactory {
  static create(config: GRCIntegrationConfig): ServiceNowIntegration | ArcherIntegration | WorkivaIntegration | LogicGateIntegration {
    switch (config.platformId) {
      case 'servicenow':
        return new ServiceNowIntegration(config)
      case 'archer':
        return new ArcherIntegration(config)
      case 'workiva':
        return new WorkivaIntegration(config)
      case 'logicgate':
        return new LogicGateIntegration(config)
      default:
        throw new Error(`Unknown GRC platform: ${config.platformId}`)
    }
  }
}

export class GRCIntegrationManager {
  private integrations: Map<string, GRCIntegrationConfig> = new Map()

  addIntegration(id: string, config: GRCIntegrationConfig): void {
    this.integrations.set(id, config)
  }

  async testIntegration(id: string): Promise<boolean> {
    const config = this.integrations.get(id)
    if (!config) return false

    const integration = GRCIntegrationFactory.create(config)
    return await integration.testConnection()
  }

  async syncAll(): Promise<void> {
    for (const [id, config] of this.integrations) {
      if (config.enabled) {
        const integration = GRCIntegrationFactory.create(config)
        try {
          if (config.platformId === 'servicenow') {
            const sn = integration as ServiceNowIntegration
            await sn.syncControls()
            await sn.syncIncidents()
          } else if (config.platformId === 'archer') {
            const archer = integration as ArcherIntegration
            await archer.syncRisks()
            await archer.syncCompliance()
          } else if (config.platformId === 'workiva') {
            const workiva = integration as WorkivaIntegration
            await workiva.syncDocuments()
          } else if (config.platformId === 'logicgate') {
            const lg = integration as LogicGateIntegration
            await lg.syncRisks()
            await lg.syncRiskAssessments()
          }

          config.lastSync = new Date()
          config.status = 'connected'
          config.errorMessage = undefined
        } catch (e: any) {
          config.status = 'error'
          config.errorMessage = e.message
        }
      }
    }
  }

  getIntegrations(): GRCIntegrationConfig[] {
    return Array.from(this.integrations.values())
  }
}

export const grcIntegrationManager = new GRCIntegrationManager()
