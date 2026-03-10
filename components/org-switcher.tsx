"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Building2, ChevronDown, Plus } from "lucide-react"
import { useTranslations } from "@/components/locale-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type Org = { id: string; name: string; slug: string; role: string }

export function OrgSwitcher() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations().t
  const [organizations, setOrganizations] = useState<Org[]>([])
  const [open, setOpen] = useState(false)
  const organizationId = (session?.user as { organizationId?: string } | undefined)?.organizationId
  const orgs = organizations
  const current = orgs.find((o) => o.id === organizationId)

  useEffect(() => {
    if (status !== "authenticated") return
    fetch("/api/me/organizations")
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => setOrganizations(Array.isArray(list) ? list : []))
      .catch(() => setOrganizations([]))
  }, [status, (session?.user as { organizationId?: string } | undefined)?.organizationId])

  async function handleSwitch(orgId: string) {
    const res = await fetch("/api/me/switch-org", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organizationId: orgId }),
    })
    if (res.ok) {
      setOpen(false)
      await update()
      router.refresh()
      // Sayfa verileri yeni organizasyona göre yenilensin (grafik, listeler vb.)
      router.push(pathname)
    }
  }

  if (status !== "authenticated") return null
  if (organizations.length === 0) {
    return (
      <Button variant="outline" size="sm" className="w-full justify-center gap-2" asChild>
        <Link href="/organizations">
          <Plus className="h-4 w-4" />
          {t("organizations.selectOrg")}
        </Link>
      </Button>
    )
  }

  return (
    <div className="space-y-1">
      <p className="px-2 text-[10px] font-medium uppercase tracking-wider text-sidebar-foreground/50">
        {t("dashboard.organizationsCurrent")}
      </p>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-between gap-2 font-normal",
              !current && "text-muted-foreground"
            )}
          >
            <span className="flex items-center gap-2 truncate">
              <Building2 className="h-4 w-4 shrink-0" />
              <span className="truncate">{current?.name ?? t("organizations.selectOrg")}</span>
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)]">
          {orgs.map((org) => (
            <DropdownMenuItem
              key={org.id}
              onClick={() => handleSwitch(org.id)}
              className={cn(organizationId === org.id && "bg-accent")}
            >
              <Building2 className="mr-2 h-4 w-4" />
              <span className="truncate">{org.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">{org.role}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem asChild>
            <Link href="/organizations" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Yeni organizasyon / Yönet
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <p className="px-2 text-[10px] text-sidebar-foreground/50">
        Tüm veriler bu organizasyona göre
      </p>
    </div>
  )
}
