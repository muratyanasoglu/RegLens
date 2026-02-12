import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { getSources } from "@/lib/db-queries"
import { requireOrg } from "@/lib/auth-server"

const createSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  type: z.string().min(1).default("rss"),
  pollInterval: z.number().optional().default(3600),
})

export async function GET() {
  try {
    const organizationId = await requireOrg()
    const sources = await getSources(organizationId)
    return NextResponse.json(sources)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: Request) {
  try {
    const organizationId = await requireOrg()
    const body = await request.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(parsed.error.flatten(), { status: 400 })
    }
    const source = await prisma.source.create({
      data: {
        organizationId,
        name: parsed.data.name,
        url: parsed.data.url,
        type: parsed.data.type,
        pollInterval: parsed.data.pollInterval,
      },
    })
    return NextResponse.json(source)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to create source" }, { status: 500 })
  }
}
