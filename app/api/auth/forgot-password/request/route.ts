import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSecurityQuestionLabel } from "@/lib/auth-constants"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const emailOrUsername =
      typeof body?.emailOrUsername === "string" ? body.emailOrUsername.trim() : ""
    if (!emailOrUsername) {
      return NextResponse.json(
        { error: "E-posta veya kullanıcı adı girin" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    })
    if (!user || !user.securityQuestion || !user.securityAnswerHash) {
      return NextResponse.json(
        { error: "Bu e-posta veya kullanıcı adına ait hesap bulunamadı veya şifre kurtarma ayarlanmamış." },
        { status: 404 }
      )
    }

    return NextResponse.json({
      securityQuestion: getSecurityQuestionLabel(user.securityQuestion),
    })
  } catch (e) {
    console.error("Forgot password request error:", e)
    return NextResponse.json(
      { error: "İşlem sırasında bir hata oluştu" },
      { status: 500 }
    )
  }
}
