import { NextResponse } from "next/server"
import { getUpdateById } from "@/lib/db-queries"
import { requireOrg } from "@/lib/auth-server"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const organizationId = await requireOrg()
    const { id } = await params
    const update = await getUpdateById(id, organizationId)
    if (!update) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(update)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
