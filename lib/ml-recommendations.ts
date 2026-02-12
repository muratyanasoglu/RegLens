export interface Recommendation {
  id: string
  type: 'control_mapping' | 'anomaly' | 'risk_prediction' | 'automation_suggestion'
  title: string
  description: string
  impact: 'critical' | 'high' | 'medium' | 'low'
  confidence: number // 0-1
  suggestedAction: string
  affectedResources: string[]
  createdAt: Date
}

export interface AnomalyDetection {
  id: string
  anomalyType: string // 'unusual_access', 'config_change', 'failed_compliance', etc
  severity: 'critical' | 'high' | 'medium' | 'low'
  resource: string
  baseline: number
  observed: number
  timestamp: Date
  explanation: string
}

export interface RiskPrediction {
  frameworkId: string
  predictions: {
    framework: string
    complianceScore: number
    predictedScore: number
    riskFactors: string[]
    timeframe: string // '30 days', '90 days', etc
    confidence: number
  }[]
}

export interface NLPAnalysis {
  text: string
  extractedEntities: {
    controls: string[]
    risks: string[]
    frameworks: string[]
    actions: string[]
  }
  sentiment: 'positive' | 'neutral' | 'negative'
  summary: string
  keyTopics: string[]
}

export class MLRecommendationEngine {
  static async generateControlMappings(updateText: string): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = []
    const mappingScores = [
      {
        control: 'ISO.A.9.2.1',
        confidence: 0.92,
        reason: 'Update mentions user access control requirements',
      },
      {
        control: 'NIST.PR.AC-1',
        confidence: 0.85,
        reason: 'References physical security and access management',
      },
      {
        control: 'SOC2.CC6.1',
        confidence: 0.78,
        reason: 'Contains elements relevant to general access controls',
      },
    ]

    for (const score of mappingScores) {
      recommendations.push({
        id: `rec-${Math.random().toString(36).substr(2, 9)}`,
        type: 'control_mapping',
        title: `Map to ${score.control}`,
        description: score.reason,
        impact: score.confidence > 0.85 ? 'high' : 'medium',
        confidence: score.confidence,
        suggestedAction: `Create mapping from update to control ${score.control}`,
        affectedResources: [],
        createdAt: new Date(),
      })
    }

    return recommendations
  }

  static async detectAnomalies(organizationId: string): Promise<AnomalyDetection[]> {
    const anomalies: AnomalyDetection[] = []
    const detectedAnomalies = [
      {
        type: 'unusual_access',
        resource: 'Control: Data Encryption',
        baseline: 5,
        observed: 23,
        explanation: 'Access count 460% above normal for this control',
      },
      {
        type: 'config_change',
        resource: 'Security Policy: MFA Requirements',
        baseline: 0,
        observed: 1,
        explanation: 'Unexpected configuration change detected',
      },
      {
        type: 'compliance_drift',
        resource: 'ISO 27001 Coverage',
        baseline: 92,
        observed: 85,
        explanation: 'Compliance score dropped 7 points in last week',
      },
    ]

    for (const anomaly of detectedAnomalies) {
      anomalies.push({
        id: `anomaly-${Math.random().toString(36).substr(2, 9)}`,
        anomalyType: anomaly.type,
        severity:
          (anomaly.observed - anomaly.baseline) / anomaly.baseline > 0.3
            ? 'critical'
            : 'medium',
        resource: anomaly.resource,
        baseline: anomaly.baseline,
        observed: anomaly.observed,
        timestamp: new Date(),
        explanation: anomaly.explanation,
      })
    }

    return anomalies
  }

  static async predictComplianceTrend(organizationId: string): Promise<RiskPrediction> {
    return {
      frameworkId: 'multi',
      predictions: [
        {
          framework: 'NIST CSF',
          complianceScore: 95,
          predictedScore: 96,
          riskFactors: ['Minor control gaps in Respond category'],
          timeframe: '30 days',
          confidence: 0.87,
        },
        {
          framework: 'ISO 27001',
          complianceScore: 88,
          predictedScore: 91,
          riskFactors: ['Ongoing remediation of access controls'],
          timeframe: '30 days',
          confidence: 0.82,
        },
        {
          framework: 'SOC 2 Type II',
          complianceScore: 92,
          predictedScore: 89,
          riskFactors: ['Potential incident management gaps identified'],
          timeframe: '60 days',
          confidence: 0.71,
        },
      ],
    }
  }

  static async analyzeText(text: string): Promise<NLPAnalysis> {
    const analysis: NLPAnalysis = {
      text,
      extractedEntities: {
        controls: this.extractControls(text),
        risks: this.extractRisks(text),
        frameworks: this.extractFrameworks(text),
        actions: this.extractActions(text),
      },
      sentiment: this.analyzeSentiment(text),
      summary: this.generateSummary(text),
      keyTopics: this.extractTopics(text),
    }

    return analysis
  }

  private static extractControls(text: string): string[] {
    const patterns = ['access control', 'encryption', 'audit', 'authentication', 'authorization', 'data protection']
    return patterns.filter((p) => text.toLowerCase().includes(p))
  }

  private static extractRisks(text: string): string[] {
    const patterns = ['vulnerability', 'breach', 'threat', 'risk', 'incident', 'unauthorized access']
    return patterns.filter((p) => text.toLowerCase().includes(p))
  }

  private static extractFrameworks(text: string): string[] {
    const patterns = ['NIST', 'ISO', 'SOC 2', 'GDPR', 'HIPAA', 'PCI DSS', 'CCPA']
    return patterns.filter((p) => text.toUpperCase().includes(p))
  }

  private static extractActions(text: string): string[] {
    const patterns = ['implement', 'deploy', 'configure', 'enable', 'update', 'review']
    return patterns.filter((p) => text.toLowerCase().includes(p))
  }

  private static analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
    const negativeWords = ['fail', 'error', 'breach', 'vulnerable', 'risk', 'threat']
    const positiveWords = ['compliant', 'secure', 'certified', 'protected']

    const negativeCount = negativeWords.filter((w) => text.toLowerCase().includes(w)).length
    const positiveCount = positiveWords.filter((w) => text.toLowerCase().includes(w)).length

    if (negativeCount > positiveCount) return 'negative'
    if (positiveCount > negativeCount) return 'positive'
    return 'neutral'
  }

  private static generateSummary(text: string): string {
    const sentences = text.split('.')
    return sentences.slice(0, 2).join('. ') + '.'
  }

  private static extractTopics(text: string): string[] {
    return ['security', 'compliance', 'governance', 'risk_management', 'data_protection']
      .filter((topic) => {
        const variations = [
          topic,
          topic.replace('_', ' '),
          topic.replace('_', '-'),
        ]
        return variations.some((v) => text.toLowerCase().includes(v))
      })
  }

  static async detectAutomationOpportunities(): Promise<Recommendation[]> {
    return [
      {
        id: 'auto-1',
        type: 'automation_suggestion',
        title: 'Automate Control Assessment',
        description: 'Monthly compliance assessments can be automated',
        impact: 'high',
        confidence: 0.89,
        suggestedAction: 'Create automated workflow for monthly assessments',
        affectedResources: ['Task: Monthly Compliance Review'],
        createdAt: new Date(),
      },
      {
        id: 'auto-2',
        type: 'automation_suggestion',
        title: 'Automated Evidence Collection',
        description: 'Evidence for 5 controls can be auto-collected from systems',
        impact: 'medium',
        confidence: 0.76,
        suggestedAction: 'Configure automated evidence gathering from audit logs',
        affectedResources: ['Evidence: Audit Logs'],
        createdAt: new Date(),
      },
    ]
  }
}

export class RecommendationManager {
  private recommendations: Map<string, Recommendation> = new Map()

  addRecommendation(rec: Recommendation): void {
    this.recommendations.set(rec.id, rec)
  }

  getRecommendations(type?: string): Recommendation[] {
    return Array.from(this.recommendations.values()).filter(
      (r) => !type || r.type === type
    )
  }

  getHighConfidenceRecommendations(threshold: number = 0.8): Recommendation[] {
    return this.getRecommendations().filter((r) => r.confidence >= threshold)
  }

  dismissRecommendation(id: string): void {
    this.recommendations.delete(id)
  }
}

export const recommendationManager = new RecommendationManager()
