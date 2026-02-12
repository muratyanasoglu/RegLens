import { NextResponse } from "next/server"
import { z } from "zod"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/next-auth"
import { prisma } from "@/lib/prisma"
import { AuthService } from "@/lib/auth"
import { SECURITY_QUESTIONS } from "@/lib/auth-constants"

const bodySchema = z.object({
  currentPassword: z.string().min(1, "Mevcut şifre girin"),
  securityQuestion: z.string().min(1, "Güvenlik sorusu seçin"),
  securityAnswer: z.string().min(2, "Cevap en az 2 karakter olmalıdır"),
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
    const { currentPassword, securityQuestion, securityAnswer } = parsed.data

    const validQuestion = SECURITY_QUESTIONS.some((q) => q.value === securityQuestion)
    if (!validQuestion) {
      return NextResponse.json(
        { error: { securityQuestion: ["Geçersiz güvenlik sorusu"] } },
        { status: 400 }
      )
    }

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

    const securityAnswerHash = AuthService.hashPassword(
      securityAnswer.trim().toLowerCase()
    )
    await prisma.user.update({
      where: { id: user.id },
      data: { securityQuestion, securityAnswerHash },
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("Security question update error:", e)
    return NextResponse.json(
      { error: "Güvenlik sorusu güncellenirken bir hata oluştu" },
      { status: 500 }
    )
  }
}
