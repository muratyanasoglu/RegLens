import { NextResponse } from "next/server"
import { generateEvidenceTemplate } from "@/lib/mistral"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const { controlRef, taskTitle, context } = await request.json()

    if (!controlRef || !taskTitle) {
      return NextResponse.json(
        { error: "Missing 'controlRef' or 'taskTitle'" },
        { status: 400 }
      )
    }

    const result = await generateEvidenceTemplate(controlRef, taskTitle, context || "")
    return NextResponse.json(result)
  } catch (error) {
    console.error("[api/ai/evidence] Error:", error)
    return NextResponse.json(
      { error: "Failed to generate evidence template" },
      { status: 500 }
    )
  }
}
