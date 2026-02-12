import { NextResponse } from "next/server"
import { getSecurityPolicies } from "@/lib/db-queries"
import { requireOrg } from "@/lib/auth-server"

export async function GET() {
  try {
    const organizationId = await requireOrg()
    const policies = await getSecurityPolicies(organizationId)
    return NextResponse.json(policies)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
