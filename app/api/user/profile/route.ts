import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/next-auth"
import { prisma } from "@/lib/prisma"
import { getSecurityQuestionLabel } from "@/lib/auth-constants"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      role: true,
      securityQuestion: true,
      lastLoginAt: true,
      mfaEnabled: true,
      createdAt: true,
    },
  })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }
  return NextResponse.json({
    ...user,
    securityQuestionLabel: user.securityQuestion
      ? getSecurityQuestionLabel(user.securityQuestion)
      : null,
  })
}
