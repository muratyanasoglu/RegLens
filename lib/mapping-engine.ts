import { z } from 'zod'

export const MappingSchema = z.object({
  updateId: z.string(),
  controlRefs: z.array(z.string()),
  confidence: z.enum(['high', 'medium', 'low']),
  rationale: z.string(),
  aiGenerated: z.boolean(),
})

export type MappingInput = z.infer<typeof MappingSchema>

export interface MappingResult {
  id: string
  updateId: string
  controlRef: string
  controlTitle: string
  frameworkId: string
  confidence: 'high' | 'medium' | 'low'
  rationale: string
  score: number
  tags: string[]
  aiGenerated: boolean
  manualReview: boolean
  reviewedBy?: string
  status: 'suggested' | 'approved' | 'rejected'
}

export interface ControlMapping {
  updateId: string
  sourceText: string
  mappedControls: {
    framework: string
    controlRef: string
    title: string
    confidence: number
    rationale: string
  }[]
  totalConfidence: number
  suggestedFrameworks: string[]
}

export class MappingEngine {
  static async suggestMappings(
    updateText: string,
    frameworkId: string
  ): Promise<MappingResult[]> {
    const keywords = this.extractKeywords(updateText)
    const suggestions: MappingResult[] = []
    const keywordMappings: Record<string, { controlRef: string; title: string; confidence: number }[]> = {
      'encryption': [
        { controlRef: 'ID.PR-1', title: 'Cryptographic controls', confidence: 0.95 },
        { controlRef: 'A.10.1.1', title: 'Cryptography policy', confidence: 0.92 },
      ],
      'access control': [
        { controlRef: 'PR.AC-1', title: 'Physical access', confidence: 0.88 },
        { controlRef: 'A.9.1.1', title: 'User registration', confidence: 0.85 },
      ],
      'mfa': [
        { controlRef: 'PR.AC-3', title: 'Access enforcement', confidence: 0.96 },
        { controlRef: 'A.9.4.2', title: 'Multi-factor authentication', confidence: 0.98 },
      ],
      'audit': [
        { controlRef: 'DE.AE-3', title: 'Audit logs', confidence: 0.94 },
        { controlRef: 'A.12.4.1', title: 'Event logging', confidence: 0.91 },
      ],
      'incident': [
        { controlRef: 'RS.AN-1', title: 'Incident analysis', confidence: 0.89 },
        { controlRef: 'A.16.1.5', title: 'Incident response', confidence: 0.90 },
      ],
    }

    for (const keyword of keywords) {
      const matches = keywordMappings[keyword.toLowerCase()] || []
      for (const match of matches) {
        suggestions.push({
          id: `map-${Math.random().toString(36).substr(2, 9)}`,
          updateId: '',
          controlRef: match.controlRef,
          controlTitle: match.title,
          frameworkId,
          confidence: match.confidence > 0.9 ? 'high' : match.confidence > 0.7 ? 'medium' : 'low',
          rationale: `Auto-mapped based on keyword: "${keyword}"`,
          score: match.confidence,
          tags: [keyword, 'auto-suggested'],
          aiGenerated: true,
          manualReview: false,
          status: 'suggested',
        })
      }
    }

    return suggestions
  }

  static extractKeywords(text: string): string[] {
    const keywords = [
      'encryption', 'access control', 'mfa', 'authentication',
      'audit', 'logging', 'incident', 'vulnerability',
      'patch', 'backup', 'disaster recovery', 'business continuity',
      'data protection', 'privacy', 'gdpr', 'compliance'
    ]

    const found: string[] = []
    const lowerText = text.toLowerCase()

    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        found.push(keyword)
      }
    }

    return [...new Set(found)]
  }

  static calculateConfidenceScore(
    keywordMatches: number,
    exactMatches: number,
    relatedControls: number
  ): number {
    const keywordScore = Math.min(keywordMatches * 0.3, 1)
    const exactScore = exactMatches * 0.5
    const relatedScore = Math.min(relatedControls * 0.1, 1)

    return Math.min(keywordScore + exactScore + relatedScore, 1)
  }

  static async batchMapUpdates(
    updates: { id: string; text: string }[],
    frameworkId: string
  ): Promise<Record<string, MappingResult[]>> {
    const results: Record<string, MappingResult[]> = {}

    for (const update of updates) {
      results[update.id] = await this.suggestMappings(update.text, frameworkId)
    }

    return results
  }

  static identifyGaps(
    frameworkId: string,
    totalControls: number,
    mappedControls: number
  ): { gapPercentage: number; unmappedCount: number; priority: string[] } {
    const unmappedCount = totalControls - mappedControls
    const gapPercentage = (unmappedCount / totalControls) * 100

    const priority = gapPercentage > 30 ? ['high'] : gapPercentage > 10 ? ['medium'] : ['low']

    return { gapPercentage, unmappedCount, priority }
  }
}

export function validateMapping(mapping: MappingInput): boolean {
  try {
    MappingSchema.parse(mapping)
    return true
  } catch (e) {
    return false
  }
}

export interface MappingStats {
  totalMappings: number
  highConfidence: number
  mediumConfidence: number
  lowConfidence: number
  averageConfidence: number
  aiGeneratedCount: number
  manuallyReviewedCount: number
  rejectedCount: number
}

export function calculateMappingStats(mappings: MappingResult[]): MappingStats {
  return {
    totalMappings: mappings.length,
    highConfidence: mappings.filter((m) => m.confidence === 'high').length,
    mediumConfidence: mappings.filter((m) => m.confidence === 'medium').length,
    lowConfidence: mappings.filter((m) => m.confidence === 'low').length,
    averageConfidence: mappings.reduce((sum, m) => sum + m.score, 0) / mappings.length || 0,
    aiGeneratedCount: mappings.filter((m) => m.aiGenerated).length,
    manuallyReviewedCount: mappings.filter((m) => m.manualReview).length,
    rejectedCount: mappings.filter((m) => m.status === 'rejected').length,
  }
}
