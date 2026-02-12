import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { AuthService } from "@/lib/auth"

const resetSchema = z.object({
  emailOrUsername: z.string().min(1, "E-posta veya kullanıcı adı girin"),
  answer: z.string().min(1, "Güvenlik sorusu cevabını girin"),
  newPassword: z.string().min(8, "Yeni şifre en az 8 karakter olmalıdır"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = resetSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }
    const { emailOrUsername, answer, newPassword } = parsed.data
    const login = emailOrUsername.trim()
    const answerNormalized = answer.trim().toLowerCase()

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: login }, { username: login }],
      },
    })
    if (!user || !user.securityAnswerHash) {
      return NextResponse.json(
        { error: "Hesap bulunamadı veya şifre kurtarma ayarlanmamış." },
        { status: 404 }
      )
    }

    if (!AuthService.verifyPassword(answerNormalized, user.securityAnswerHash)) {
      return NextResponse.json(
        { error: { answer: ["Güvenlik sorusu cevabı hatalı"] } },
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
    console.error("Forgot password reset error:", e)
    return NextResponse.json(
      { error: "Şifre güncellenirken bir hata oluştu" },
      { status: 500 }
    )
  }
}
