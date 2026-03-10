import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { AuthService } from "@/lib/auth"
import { SECURITY_QUESTIONS } from "@/lib/auth-constants"

const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Kullanıcı adı en az 3 karakter olmalıdır")
    .max(30, "Kullanıcı adı en fazla 30 karakter olmalıdır")
    .regex(/^[a-zA-Z0-9_-]+$/, "Sadece harf, rakam, tire ve alt çizgi kullanılabilir"),
  email: z.string().email("Geçerli bir e-posta girin"),
  name: z.string().max(100).optional(),
  password: z.string().min(8, "Şifre en az 8 karakter olmalıdır"),
  securityQuestion: z.string().min(1, "Güvenlik sorusu seçin"),
  securityAnswer: z.string().min(2, "Güvenlik sorusu cevabı en az 2 karakter olmalıdır"),
  inviteToken: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }
    const { username, email, name, password, securityQuestion, securityAnswer, inviteToken } = parsed.data

    let organizationId: string
    let role: "ADMIN" | "MANAGER" | "AUDITOR" | "USER" | "VIEWER" = "ADMIN"

    if (inviteToken) {
      const invite = await prisma.invite.findUnique({
        where: { token: inviteToken },
      })
      if (!invite || invite.status !== "pending" || invite.expiresAt < new Date()) {
        return NextResponse.json(
          { error: "Davet geçersiz veya süresi dolmuş." },
          { status: 400 }
        )
      }
      if (invite.email.toLowerCase() !== email.toLowerCase()) {
        return NextResponse.json(
          { error: "Davet bu e-posta adresi için değil. Lütfen davette belirtilen e-postayı kullanın." },
          { status: 400 }
        )
      }
      organizationId = invite.organizationId
      role = invite.role
    }

    const questionValid = SECURITY_QUESTIONS.some((q) => q.value === securityQuestion)
    if (!questionValid) {
      return NextResponse.json(
        { error: { securityQuestion: ["Geçersiz güvenlik sorusu"] } },
        { status: 400 }
      )
    }

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: email.toLowerCase() }, { username: username.trim() }],
      },
    })
    if (existing) {
      if (existing.email === email.toLowerCase()) {
        return NextResponse.json(
          { error: { email: ["Bu e-posta adresi zaten kayıtlı"] } },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { error: { username: ["Bu kullanıcı adı zaten alınmış"] } },
        { status: 409 }
      )
    }

    const passwordHash = AuthService.hashPassword(password)
    const securityAnswerHash = AuthService.hashPassword(securityAnswer.trim().toLowerCase())

    if (inviteToken) {
      const newUser = await prisma.user.create({
        data: {
          username: username.trim(),
          email: email.toLowerCase(),
          name: name?.trim() || null,
          passwordHash,
          securityQuestion,
          securityAnswerHash,
          lastSelectedOrganizationId: organizationId,
        },
      })
      await prisma.organizationMember.create({
        data: { userId: newUser.id, organizationId, role },
      })
      await prisma.invite.update({
        where: { token: inviteToken },
        data: { status: "accepted", acceptedAt: new Date() },
      })
      return NextResponse.json({ success: true })
    }

    await prisma.user.create({
      data: {
        username: username.trim(),
        email: email.toLowerCase(),
        name: name?.trim() || null,
        passwordHash,
        securityQuestion,
        securityAnswerHash,
      },
    })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("Register error:", e)
    return NextResponse.json(
      { error: "Kayıt sırasında bir hata oluştu" },
      { status: 500 }
    )
  }
}
