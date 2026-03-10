"use client"

import { useTheme } from "next-themes"
import { useTranslations } from "@/components/locale-provider"

const MERED_URL = "https://www.meredtechnology.com/"

export function SiteFooter() {
  const { resolvedTheme } = useTheme()
  const { t } = useTranslations()
  const year = new Date().getFullYear()
  const logoSrc = resolvedTheme === "light" ? "/logo-light-mode.png" : "/logo.png"

  return (
    <footer className="border-t border-border/70 bg-muted/30">
      <div className="content-max py-8 sm:py-10">
        <div className="grid gap-6 rounded-2xl border border-border/70 bg-card/80 p-5 shadow-card sm:grid-cols-[1.3fr_auto] sm:items-center sm:p-6">
          <div className="space-y-4">
            <a
              href={MERED_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-xl border border-border/60 bg-background px-3 py-2 transition-colors hover:bg-accent/50"
              aria-label={t("siteFooter.visitAria")}
              title={t("siteFooter.visitAria")}
            >
              <img
                src={logoSrc}
                alt={t("siteFooter.logoAlt")}
                className="h-10 w-[220px] object-cover object-right sm:h-12 sm:w-[300px] lg:w-[360px]"
              />
            </a>
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-foreground">
                {t("siteFooter.companyName")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("siteFooter.developedBy")}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("siteFooter.rightsReserved").replace("{year}", String(year))}
              </p>
            </div>
          </div>

          <div className="flex items-center sm:justify-end">
            <a
              href={MERED_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
                {t("siteFooter.openInNewTab")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
