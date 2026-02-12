import { NextResponse } from "next/server"
import { getDashboardMetrics } from "@/lib/db-queries"
import { requireOrg } from "@/lib/auth-server"

export const runtime = "nodejs"

export async function GET() {
  try {
    const organizationId = await requireOrg()
    const metrics = await getDashboardMetrics(organizationId)
    return NextResponse.json(metrics)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
