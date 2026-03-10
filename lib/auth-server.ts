import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/next-auth"

export async function getSessionAndOrg() {
  const session = await getServerSession(authOptions)
  const organizationId = (session?.user as { organizationId?: string } | undefined)?.organizationId ?? null
  if (!session) return { session: null, organizationId: null }
  return { session, organizationId }
}

/** Seçili organizasyon gerekli (yoksa throw). */
export async function requireOrg() {
  const { organizationId } = await getSessionAndOrg()
  if (!organizationId) throw new Error("Unauthorized")
  return organizationId
}

/** Giriş yapmış kullanıcı; organizasyon opsiyonel (seçili org varsa döner). */
export async function requireUser() {
  const session = await getServerSession(authOptions)
  const user = session?.user as { id?: string; organizationId?: string; role?: string } | undefined
  const userId = user?.id
  if (!userId) throw new Error("Unauthorized")
  const organizationId = user?.organizationId ?? null
  return { userId, organizationId, role: user?.role ?? null }
}

/** Seçili orgda ADMIN rolü gerekli. */
export async function requireAdmin() {
  const { userId, organizationId, role } = await requireUser()
  if (!organizationId || role !== "ADMIN") throw new Error("Forbidden")
  return { userId, organizationId }
}
