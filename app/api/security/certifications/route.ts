import { NextResponse } from "next/server"
import { getComplianceCertifications } from "@/lib/db-queries"
import { requireOrg } from "@/lib/auth-server"

export async function GET() {
  try {
    const organizationId = await requireOrg()
    const certs = await getComplianceCertifications(organizationId)
    return NextResponse.json(certs)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
