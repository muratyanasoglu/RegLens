import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { requireUser } from "@/lib/auth-server"
import { randomBytes } from "crypto"

const MAX_SIZE = 16 * 1024 * 1024 // 16MB
const ALLOWED_IMAGE = ["image/jpeg", "image/png", "image/gif", "image/webp"]
const ALLOWED_FILE = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/plain", "application/zip"]

export async function POST(request: Request) {
  try {
    await requireUser()
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const kind = (formData.get("kind") as string) || "file" // "image" | "file"
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Dosya gerekli." }, { status: 400 })
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Dosya en fazla 16MB olabilir." }, { status: 400 })
    }
    const allowed = kind === "image" ? ALLOWED_IMAGE : [...ALLOWED_IMAGE, ...ALLOWED_FILE]
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: "Bu dosya türü kabul edilmiyor." }, { status: 400 })
    }
    const ext = path.extname(file.name) || (kind === "image" ? ".png" : ".bin")
    const safeName = `${randomBytes(8).toString("hex")}${ext}`
    const uploadDir = path.join(process.cwd(), "public", "uploads")
    await mkdir(uploadDir, { recursive: true })
    const filePath = path.join(uploadDir, safeName)
    const bytes = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(bytes))
    const url = `/uploads/${safeName}`
    return NextResponse.json({ url, name: file.name })
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Upload error:", e)
    return NextResponse.json({ error: "Yükleme başarısız." }, { status: 500 })
  }
}
