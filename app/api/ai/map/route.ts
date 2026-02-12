import { NextResponse } from "next/server"
import { mapToControls } from "@/lib/mistral"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const { summary, controlRefs } = await request.json()

    if (!summary || !Array.isArray(controlRefs)) {
      return NextResponse.json(
        { error: "Missing 'summary' or 'controlRefs'" },
        { status: 400 }
      )
    }

    const result = await mapToControls(summary, controlRefs)
    return NextResponse.json(result)
  } catch (error) {
    console.error("[api/ai/map] Error:", error)
    return NextResponse.json(
      { error: "Failed to map to controls" },
      { status: 500 }
    )
  }
}
