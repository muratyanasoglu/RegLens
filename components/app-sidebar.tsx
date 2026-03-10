"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard,
  Rss,
  FileText,
  Shield,
  ListTodo,
  FileCheck,
  Archive,
  Settings,
  Eye,
  Lock,
  CheckCircle2,
  ScrollText,
  LogOut,
  BookOpen,
  BookMarked,
  Users,
  MessageCircle,
  UserPlus,
  Mail,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationBell } from "@/components/notification-bell"
import { GlobalSearch } from "@/components/global-search"
import { LanguageSwitcher } from "@/components/language-switcher"
import { OrgSwitcher } from "@/components/org-switcher"
import { useTranslations } from "@/components/locale-provider"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar"

const mainNavItems = [
  { titleKey: "sidebar.dashboard", href: "/dashboard", icon: LayoutDashboard },
  { titleKey: "sidebar.sources", href: "/sources", icon: Rss },
  { titleKey: "sidebar.updates", href: "/updates", icon: FileText },
  { titleKey: "sidebar.controls", href: "/controls", icon: Shield },
  { titleKey: "sidebar.tasks", href: "/tasks", icon: ListTodo },
]

const workspaceItems = [
  { titleKey: "sidebar.evidence", href: "/evidence", icon: FileCheck },
  { titleKey: "sidebar.auditPacks", href: "/audit-packs", icon: Archive },
  { titleKey: "sidebar.addFriend", href: "/friends", icon: UserPlus },
  { titleKey: "sidebar.invites", href: "/invites", icon: Mail },
  { titleKey: "sidebar.team", href: "/team", icon: Users },
  { titleKey: "sidebar.teamChat", href: "/team-chat", icon: MessageCircle },
  { titleKey: "sidebar.messages", href: "/messages", icon: MessageCircle },
]

const complianceItems = [
  { titleKey: "sidebar.frameworks", href: "/frameworks", icon: ScrollText },
  { titleKey: "sidebar.compliance", href: "/compliance", icon: CheckCircle2 },
  { titleKey: "sidebar.security", href: "/security", icon: Lock },
]

const settingsItems = [
  { titleKey: "sidebar.settings", href: "/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const t = useTranslations().t

  return (
    <Sidebar>
      <SidebarHeader className="gap-0 px-4 py-5">
        <div className="flex w-full items-center justify-between gap-2">
          <Link
            href="/dashboard"
            className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-2 py-2.5 transition-all duration-200 hover:bg-sidebar-accent/80 focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary/25 ring-1 ring-sidebar-primary/50 shadow-md">
              <Eye className="h-5 w-5 text-sidebar-primary" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="font-display truncate text-sm font-bold tracking-tight text-sidebar-accent-foreground">
                RegLens
              </span>
              <span className="truncate text-[10px] leading-tight text-sidebar-foreground/75">
                {t("sidebar.tagline")}
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-1">
            <GlobalSearch />
            <NotificationBell />
          </div>
        </div>
      </SidebarHeader>
      <div className="px-3 pb-2">
        <OrgSwitcher />
      </div>
      <SidebarSeparator className="bg-sidebar-border/80" />
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-1.5 px-2 text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/60">
            {t("sidebar.monitor")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      pathname === item.href ||
                      (item.href !== "/dashboard" && pathname.startsWith(item.href))
                    }
                    tooltip={t(item.titleKey)}
                    className="rounded-xl data-[active=true]:border-l-[3px] data-[active=true]:border-sidebar-primary data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-medium"
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{t(item.titleKey)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-1.5 px-2 text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/60">
            {t("sidebar.workspace")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {workspaceItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href)}
                    tooltip={t(item.titleKey)}
                    className="rounded-xl data-[active=true]:border-l-[3px] data-[active=true]:border-sidebar-primary data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-medium"
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{t(item.titleKey)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-1.5 px-2 text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/60">
            {t("sidebar.governance")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {complianceItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href)}
                    tooltip={t(item.titleKey)}
                    className="rounded-xl data-[active=true]:border-l-[3px] data-[active=true]:border-sidebar-primary data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-medium"
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{t(item.titleKey)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-1.5 px-2 text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/60">
            {t("sidebar.help")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={t("sidebar.guide")} className="rounded-lg">
                  <Link href="/guide">
                    <BookOpen className="h-4 w-4 shrink-0" />
                    <span>{t("sidebar.guide")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={t("sidebar.documentation")} className="rounded-lg">
                  <Link href="/docs">
                    <BookMarked className="h-4 w-4 shrink-0" />
                    <span>{t("sidebar.documentation")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator className="bg-sidebar-border/80" />
      <SidebarFooter className="px-2 py-4">
        <div className="flex justify-center items-center gap-1 px-2 pb-2">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
        <SidebarMenu className="space-y-0.5">
          {settingsItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={t(item.titleKey)}
                className="rounded-xl data-[active=true]:border-l-[3px] data-[active=true]:border-sidebar-primary data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium"
              >
                <Link href={item.href}>
                  <Settings className="h-4 w-4 shrink-0" />
                  <span>{t(item.titleKey)}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={t("sidebar.signOut")}
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="rounded-lg text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>{t("sidebar.signOut")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
