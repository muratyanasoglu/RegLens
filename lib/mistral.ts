import { z } from "zod"

const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions"
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || ""
const MISTRAL_MODEL = process.env.MISTRAL_MODEL || "mistral-large-latest"
const MAX_RETRIES = 2
const TIMEOUT_MS = 30000

export const NormalizedUpdateSchema = z.object({
  title: z.string(),
  summary: z.string(),
  keyChanges: z.array(z.string()),
  affectedAreas: z.array(z.string()),
  riskLevel: z.enum(["critical", "high", "medium", "low"]),
})

export const ControlMappingSchema = z.object({
  mappings: z.array(
    z.object({
      controlRef: z.string(),
      confidence: z.enum(["high", "medium", "low"]),
      rationale: z.string(),
    })
  ),
})

export const EvidenceTemplateSchema = z.object({
  title: z.string(),
  template: z.string(),
  checklistItems: z.array(z.string()),
})

export type NormalizedUpdate = z.infer<typeof NormalizedUpdateSchema>
export type ControlMappingResult = z.infer<typeof ControlMappingSchema>
export type EvidenceTemplateResult = z.infer<typeof EvidenceTemplateSchema>

async function mistralChat(
  messages: { role: string; content: string }[],
  retries = 0
): Promise<string> {
  if (!MISTRAL_API_KEY) {
    throw new Error("MISTRAL_API_KEY not configured")
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await fetch(MISTRAL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: MISTRAL_MODEL,
        messages,
        response_format: { type: "json_object" },
        temperature: 0.1,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[mistral] API error ${response.status}:`, errorText)
      if (retries < MAX_RETRIES) {
        console.log(`[mistral] Retrying... (attempt ${retries + 1}/${MAX_RETRIES})`)
        return mistralChat(messages, retries + 1)
      }
      throw new Error(`Mistral API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || ""
  } catch (error) {
    clearTimeout(timeoutId)
    if (retries < MAX_RETRIES && error instanceof Error && error.name !== "AbortError") {
      console.log(`[mistral] Retrying... (attempt ${retries + 1}/${MAX_RETRIES})`)
      return mistralChat(messages, retries + 1)
    }
    throw error
  }
}

function parseJSON<T>(raw: string, schema: z.ZodSchema<T>): T {
  let cleaned = raw.trim()
  const codeMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (codeMatch) {
    cleaned = codeMatch[1].trim()
  }
  const parsed = JSON.parse(cleaned)
  return schema.parse(parsed)
}

function mockNormalizeUpdate(text: string): NormalizedUpdate {
  return {
    title: "Regulatory Update Summary",
    summary: text.slice(0, 200) + "...",
    keyChanges: [
      "Updated compliance requirements for regulated entities",
      "New reporting obligations and timelines",
      "Enhanced supervisory expectations",
    ],
    affectedAreas: ["Compliance", "Risk Management", "Operations"],
    riskLevel: "medium",
  }
}

function mockMapToControls(): ControlMappingResult {
  return {
    mappings: [
      { controlRef: "A.5.1", confidence: "medium", rationale: "General policy update may impact information security policies." },
      { controlRef: "CC8.1", confidence: "low", rationale: "Changes may require updates to change management procedures." },
    ],
  }
}

function mockGenerateEvidence(controlRef: string, taskTitle: string): EvidenceTemplateResult {
  return {
    title: `Evidence Template - ${controlRef}`,
    template: `## Evidence for ${controlRef}\n\n**Task:** ${taskTitle}\n**Date:** [DATE]\n**Owner:** [NAME]\n\n### Purpose\nThis document provides evidence of compliance for control ${controlRef}.\n\n### Evidence\n- [ ] Policy documentation reviewed\n- [ ] Implementation verified\n- [ ] Testing completed\n\n---\n*Disclaimer: Not legal advice. Human review required.*`,
    checklistItems: [
      "Policy documentation reviewed",
      "Implementation verified",
      "Testing completed",
    ],
  }
}

export async function normalizeUpdate(rawText: string): Promise<NormalizedUpdate> {
  if (!MISTRAL_API_KEY) {
    console.log("[mistral] No API key, using mock output")
    return mockNormalizeUpdate(rawText)
  }

  try {
    const result = await mistralChat([
      {
        role: "system",
        content:
          'You are a regulatory analyst. Analyze the following regulatory text and produce a structured JSON summary. Return ONLY valid JSON matching this schema: { "title": string, "summary": string, "keyChanges": string[], "affectedAreas": string[], "riskLevel": "critical"|"high"|"medium"|"low" }',
      },
      { role: "user", content: rawText },
    ])
    return parseJSON(result, NormalizedUpdateSchema)
  } catch (error) {
    console.error("[mistral] normalizeUpdate failed, using mock:", error)
    return mockNormalizeUpdate(rawText)
  }
}

export async function mapToControls(
  updateSummary: string,
  controlRefs: string[]
): Promise<ControlMappingResult> {
  if (!MISTRAL_API_KEY) {
    console.log("[mistral] No API key, using mock output")
    return mockMapToControls()
  }

  try {
    const result = await mistralChat([
      {
        role: "system",
        content: `You are a compliance mapping engine. Given a regulatory update and a list of control references, determine which controls are affected. Return ONLY valid JSON matching: { "mappings": [{ "controlRef": string, "confidence": "high"|"medium"|"low", "rationale": string }] }. Available controls: ${controlRefs.join(", ")}`,
      },
      { role: "user", content: updateSummary },
    ])
    return parseJSON(result, ControlMappingSchema)
  } catch (error) {
    console.error("[mistral] mapToControls failed, using mock:", error)
    return mockMapToControls()
  }
}

export async function generateEvidenceTemplate(
  controlRef: string,
  taskTitle: string,
  context: string
): Promise<EvidenceTemplateResult> {
  if (!MISTRAL_API_KEY) {
    console.log("[mistral] No API key, using mock output")
    return mockGenerateEvidence(controlRef, taskTitle)
  }

  try {
    const result = await mistralChat([
      {
        role: "system",
        content: `You are a compliance documentation specialist. Generate an audit-ready evidence template for the given control and task. Return ONLY valid JSON matching: { "title": string, "template": string (markdown), "checklistItems": string[] }. Always include disclaimer: "Not legal advice. Human review required."`,
      },
      {
        role: "user",
        content: `Control: ${controlRef}\nTask: ${taskTitle}\nContext: ${context}`,
      },
    ])
    return parseJSON(result, EvidenceTemplateSchema)
  } catch (error) {
    console.error("[mistral] generateEvidenceTemplate failed, using mock:", error)
    return mockGenerateEvidence(controlRef, taskTitle)
  }
}
