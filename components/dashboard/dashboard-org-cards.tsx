"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Building2, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { UserOrganizationItem } from "@/lib/db-queries"
import { useTranslations } from "@/components/locale-provider"

type Props = {
  organizations: UserOrganizationItem[]
  currentOrganizationId: string | null
}

export function DashboardOrgCards({ organizations, currentOrganizationId }: Props) {
  const router = useRouter()
  const { update } = useSession()
  const t = useTranslations().t

  async function handleOpen(organizationId: string) {
    if (organizationId === currentOrganizationId) return
    const res = await fetch("/api/me/switch-org", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organizationId }),
    })
    if (res.ok) {
      await update()
      router.refresh()
    }
  }

  if (organizations.length === 0) return null

  return (
    <section className="content-max w-full py-6">
      <h2 className="section-title-accent mb-5">
        {t("dashboard.organizationsSection")}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {organizations.map((org) => {
          const isCurrent = org.id === currentOrganizationId
          return (
            <Card
              key={org.id}
              className={
                isCurrent
                  ? "ring-2 ring-primary/50 border-primary/30"
                  : "hover:border-muted-foreground/30"
              }
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-semibold tracking-tight truncate">{org.name}</p>
                    <p className="text-xs text-muted-foreground">{org.role}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  size="sm"
                  variant={isCurrent ? "secondary" : "default"}
                  className="w-full gap-2"
                  onClick={() => handleOpen(org.id)}
                  disabled={isCurrent}
                >
                  <ExternalLink className="h-4 w-4" />
                  {isCurrent ? t("dashboard.organizationsCurrent") : t("dashboard.organizationsOpen")}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
