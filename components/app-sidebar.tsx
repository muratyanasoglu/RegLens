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
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationBell } from "@/components/notification-bell"
import { GlobalSearch } from "@/components/global-search"
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
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Sources", href: "/sources", icon: Rss },
  { title: "Updates", href: "/updates", icon: FileText },
  { title: "Controls", href: "/controls", icon: Shield },
  { title: "Tasks", href: "/tasks", icon: ListTodo },
]

const workspaceItems = [
  { title: "Evidence", href: "/evidence", icon: FileCheck },
  { title: "Audit Packs", href: "/audit-packs", icon: Archive },
]

const complianceItems = [
  { title: "Frameworks", href: "/frameworks", icon: ScrollText },
  { title: "Compliance", href: "/compliance", icon: CheckCircle2 },
  { title: "Security", href: "/security", icon: Lock },
]

const settingsItems = [
  { title: "Settings", href: "/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="gap-0 px-4 py-5">
        <div className="flex w-full items-center justify-between gap-2">
          <Link
            href="/dashboard"
            className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-2 py-2.5 transition-all duration-200 hover:bg-sidebar-accent/80"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary/20 ring-1 ring-sidebar-primary/40 shadow-sm">
              <Eye className="h-5 w-5 text-sidebar-primary" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="font-display truncate text-sm font-bold tracking-tight text-sidebar-accent-foreground">
                RegLens
              </span>
              <span className="truncate text-[10px] leading-tight text-sidebar-foreground/70">
                Regulatory Intelligence
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-1">
            <GlobalSearch />
            <NotificationBell />
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator className="bg-sidebar-border/80" />
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-1.5 px-2 text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/60">
            Monitor
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
                    tooltip={item.title}
                    className="rounded-xl data-[active=true]:border-l-[3px] data-[active=true]:border-sidebar-primary data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-medium"
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-1.5 px-2 text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/60">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {workspaceItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href)}
                    tooltip={item.title}
                    className="rounded-xl data-[active=true]:border-l-[3px] data-[active=true]:border-sidebar-primary data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-medium"
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-1.5 px-2 text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/60">
            Governance
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {complianceItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href)}
                    tooltip={item.title}
                    className="rounded-xl data-[active=true]:border-l-[3px] data-[active=true]:border-sidebar-primary data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-medium"
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-1.5 px-2 text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/60">
            Yardım
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Kılavuz" className="rounded-lg">
                  <Link href="/guide">
                    <BookOpen className="h-4 w-4 shrink-0" />
                    <span>Kılavuz</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dokümantasyon" className="rounded-lg">
                  <Link href="/docs">
                    <BookMarked className="h-4 w-4 shrink-0" />
                    <span>Dokümantasyon</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator className="bg-sidebar-border/80" />
      <SidebarFooter className="px-2 py-4">
        <div className="flex justify-center px-2 pb-2">
          <ThemeToggle />
        </div>
        <SidebarMenu className="space-y-0.5">
          {settingsItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.title}
                className="rounded-xl data-[active=true]:border-l-[3px] data-[active=true]:border-sidebar-primary data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium"
              >
                <Link href={item.href}>
                  <Settings className="h-4 w-4 shrink-0" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Çıkış yap"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="rounded-lg text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Çıkış yap</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
