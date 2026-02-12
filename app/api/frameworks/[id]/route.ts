import { NextResponse } from "next/server"
import { getFrameworkById } from "@/lib/db-queries"
import { requireOrg } from "@/lib/auth-server"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireOrg()
    const { id } = await params
    const framework = await getFrameworkById(id)
    if (!framework) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(framework)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
