import { NextResponse } from "next/server"
import { getUpdates } from "@/lib/db-queries"
import { requireOrg } from "@/lib/auth-server"

export async function GET() {
  try {
    const organizationId = await requireOrg()
    const updates = await getUpdates(organizationId)
    const list = updates.map((u) => ({
      ...u,
      sourceName: u.source.name,
    }))
    return NextResponse.json(list)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
