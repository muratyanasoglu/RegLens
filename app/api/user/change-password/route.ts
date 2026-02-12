import { NextResponse } from "next/server"
import { z } from "zod"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/next-auth"
import { prisma } from "@/lib/prisma"
import { AuthService } from "@/lib/auth"

const bodySchema = z.object({
  currentPassword: z.string().min(1, "Mevcut şifre girin"),
  newPassword: z.string().min(8, "Yeni şifre en az 8 karakter olmalıdır"),
})

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const body = await request.json()
    const parsed = bodySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }
    const { currentPassword, newPassword } = parsed.data

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })
    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "Hesap bulunamadı veya şifre ile giriş yok" },
        { status: 404 }
      )
    }
    if (!AuthService.verifyPassword(currentPassword, user.passwordHash)) {
      return NextResponse.json(
        { error: { currentPassword: ["Mevcut şifre hatalı"] } },
        { status: 400 }
      )
    }

    const passwordHash = AuthService.hashPassword(newPassword)
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, loginAttempts: 0, lockedUntil: null },
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("Change password error:", e)
    return NextResponse.json(
      { error: "Şifre güncellenirken bir hata oluştu" },
      { status: 500 }
    )
  }
}
