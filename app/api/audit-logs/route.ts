import { NextResponse } from "next/server"
import { getAuditLogs } from "@/lib/db-queries"
import { requireOrg } from "@/lib/auth-server"

export async function GET(request: Request) {
  try {
    const organizationId = await requireOrg()
    const { searchParams } = new URL(request.url)
    const limit = Math.min(Number(searchParams.get("limit")) || 100, 200)
    const logs = await getAuditLogs(organizationId, limit)
    const list = logs.map((log) => ({
      id: log.id,
      timestamp: log.createdAt,
      user: log.user?.email ?? log.user?.username ?? "—",
      action: log.action,
      resource: log.resourceType,
      resourceId: log.resourceId,
      status: log.status,
      ipAddress: log.ipAddress,
      details: log.details,
    }))
    return NextResponse.json(list)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
