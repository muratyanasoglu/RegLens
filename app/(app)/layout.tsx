"use client"

import React, { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Chatbot } from "@/components/chatbot"

const NO_ORG_ALLOWED_PATHS = ["/organizations", "/invites"]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status !== "authenticated" || !pathname) return
    const orgId = (session?.user as { organizationId?: string } | undefined)?.organizationId
    if (orgId) return
    if (NO_ORG_ALLOWED_PATHS.some((p) => pathname.startsWith(p))) return
    router.replace("/organizations")
  }, [status, session?.user, pathname, router])

  const organizationId = (session?.user as { organizationId?: string } | undefined)?.organizationId
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset key={organizationId ?? "no-org"} className="min-h-screen bg-background bg-app-grid bg-content-elite">{children}</SidebarInset>
      <ScrollToTop />
      <Chatbot />
    </SidebarProvider>
  )
}
