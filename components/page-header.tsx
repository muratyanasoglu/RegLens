import React from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex flex-col glass border-b border-border/40",
        className
      )}
    >
      <div className="flex flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="-ml-1 rounded-xl border-0 bg-transparent hover:bg-accent/80 transition-colors duration-200" />
          <Separator orientation="vertical" className="h-8 bg-border/70" />
          <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="section-title font-display truncate text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl lg:text-[1.75rem]">
                {title}
              </h1>
              {description && (
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed max-w-2xl">
                  {description}
                </p>
              )}
            </div>
            {children && (
              <div className="flex shrink-0 items-center gap-2">{children}</div>
            )}
          </div>
        </div>
      </div>
      <div className="accent-line w-full" aria-hidden />
    </header>
  )
}
