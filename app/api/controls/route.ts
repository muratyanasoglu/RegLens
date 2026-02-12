import { NextResponse } from "next/server"
import { getControls } from "@/lib/db-queries"
import { requireOrg } from "@/lib/auth-server"

export async function GET() {
  try {
    await requireOrg()
    const controls = await getControls()
    const list = controls.map((c) => ({
      ...c,
      frameworkName: c.framework.name,
    }))
    return NextResponse.json(list)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
