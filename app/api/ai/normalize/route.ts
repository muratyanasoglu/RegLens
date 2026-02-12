import { NextResponse } from "next/server"
import { normalizeUpdate } from "@/lib/mistral"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'text' field" },
        { status: 400 }
      )
    }

    const result = await normalizeUpdate(text)
    return NextResponse.json(result)
  } catch (error) {
    console.error("[api/ai/normalize] Error:", error)
    return NextResponse.json(
      { error: "Failed to normalize update" },
      { status: 500 }
    )
  }
}
