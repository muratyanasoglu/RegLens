import { NextResponse } from "next/server"
import { getMappingsForOrg } from "@/lib/db-queries"
import { requireOrg } from "@/lib/auth-server"

export async function GET() {
  try {
    const organizationId = await requireOrg()
    const mappings = await getMappingsForOrg(organizationId)
    return NextResponse.json(mappings)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
