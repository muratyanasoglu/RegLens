import { NextResponse } from "next/server"
import { getOrgUsers } from "@/lib/db-queries"
import { requireOrg } from "@/lib/auth-server"

export async function GET() {
  try {
    const organizationId = await requireOrg()
    const users = await getOrgUsers(organizationId)
    return NextResponse.json(users)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
