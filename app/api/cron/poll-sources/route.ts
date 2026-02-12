import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const sources = await prisma.source.findMany({
    where: { active: true },
  })

  const results: { source: string; status: string; existingUpdates: number; newUpdates: number; message: string }[] = []

  for (const source of sources) {
    const updateCount = await prisma.regulatoryUpdate.count({
      where: { sourceId: source.id },
    })
    await prisma.source.update({
      where: { id: source.id },
      data: { lastPolled: new Date() },
    })
    results.push({
      source: source.name,
      status: "polled",
      existingUpdates: updateCount,
      newUpdates: 0,
      message: "Last poll time updated; implement RSS fetch for new updates",
    })
  }

  return NextResponse.json({
    success: true,
    polledAt: new Date().toISOString(),
    results,
  })
}
