import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/next-auth"

export async function getSessionAndOrg() {
  const session = await getServerSession(authOptions)
  const organizationId = (session?.user as { organizationId?: string } | undefined)?.organizationId
  if (!session || !organizationId) return { session: null, organizationId: null }
  return { session, organizationId }
}

export async function requireOrg() {
  const { organizationId } = await getSessionAndOrg()
  if (!organizationId) throw new Error("Unauthorized")
  return organizationId
}

export async function requireUser() {
  const session = await getServerSession(authOptions)
  const user = session?.user as { id?: string; organizationId?: string } | undefined
  const userId = user?.id
  const organizationId = user?.organizationId
  if (!userId || !organizationId) throw new Error("Unauthorized")
  return { userId, organizationId }
}
