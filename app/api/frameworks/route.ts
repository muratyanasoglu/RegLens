import { NextResponse } from "next/server"
import { getFrameworks } from "@/lib/db-queries"
import { requireOrg } from "@/lib/auth-server"

export async function GET() {
  try {
    await requireOrg()
    const frameworks = await getFrameworks()
    return NextResponse.json(frameworks)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
