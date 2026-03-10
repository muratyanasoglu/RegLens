"use client"

import Link from "next/link"
import { Eye, BookOpen, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useTranslations } from "@/components/locale-provider"

export function DocsHeader() {
  const t = useTranslations().t
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="content-max flex h-14 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-accent/50"
        >
          <Eye className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground">RegLens</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/guide" className="gap-1.5">
              <BookOpen className="h-4 w-4" />
              {t("landing.nav.guide")}
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/docs" className="gap-1.5">
              <FileText className="h-4 w-4" />
              {t("landing.nav.docs")}
            </Link>
          </Button>
          <ThemeToggle />
          <LanguageSwitcher />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">{t("landing.nav.login")}</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/register">{t("landing.nav.register")}</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
