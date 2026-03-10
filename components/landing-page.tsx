"use client"

import Link from "next/link"
import {
  Eye,
  Rss,
  FileText,
  Shield,
  ListTodo,
  FileCheck,
  Archive,
  Sparkles,
  CheckCircle2,
  Github,
  ArrowRight,
  Target,
  Bot,
  Lock,
  HelpCircle,
  LayoutDashboard,
  BookOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useTranslations } from "@/components/locale-provider"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

const featureKeys = [
  { key: "dashboard", icon: LayoutDashboard },
  { key: "trackSources", icon: Rss },
  { key: "detectChanges", icon: FileText },
  { key: "mapControls", icon: Shield },
  { key: "generateTasks", icon: ListTodo },
  { key: "collectEvidence", icon: FileCheck },
  { key: "auditPacks", icon: Archive },
] as const

export function LandingPage() {
  const t = useTranslations().t
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/90 backdrop-blur-xl">
        <div className="content-max flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-xl px-2 py-2 transition-all duration-200 hover:bg-accent/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 ring-1 ring-primary/40 shadow-sm">
              <Eye className="h-5 w-5 text-primary" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              RegLens
            </span>
          </Link>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" asChild size="sm">
              <Link href="/guide" className="gap-1.5">
                <BookOpen className="h-4 w-4" />
                {t("landing.nav.guide")}
              </Link>
            </Button>
            <Button variant="ghost" asChild size="sm">
              <Link href="/docs" className="gap-1.5">
                <FileText className="h-4 w-4" />
                {t("landing.nav.docs")}
              </Link>
            </Button>
            <ThemeToggle />
            <LanguageSwitcher />
            <Button variant="ghost" asChild size="sm">
              <Link href="/login">{t("landing.nav.login")}</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/register">{t("landing.nav.register")}</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border/50 py-28 sm:py-36 lg:py-44 bg-hero-elite">
          <div className="content-max text-center relative z-10">
            <div className="mb-12 inline-flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/20 px-5 py-2.5 text-sm font-semibold text-primary shadow-md">
                <Sparkles className="h-4 w-4" />
                {t("landing.hero.badgeOpenSource")}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/50 bg-emerald-500/20 px-5 py-2.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 shadow-md">
                <CheckCircle2 className="h-4 w-4" />
                {t("landing.hero.badgeFree")}
              </span>
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl xl:text-[4.5rem] xl:leading-[1.08]">
              {t("landing.hero.title1")}
              <br />
              <span className="gradient-text block mt-2">{t("landing.hero.title2")}</span>
            </h1>
            <p className="mx-auto mt-12 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl prose-read">
              {t("landing.hero.subtitle")}
            </p>
            <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild className="gap-2 text-base px-10 py-6 rounded-2xl shadow-lg hover:shadow-glow transition-all duration-300">
                <Link href="/register">
                  {t("landing.hero.ctaStart")}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-2xl border-2 px-8 py-6 font-semibold">
                <Link href="/login">{t("landing.hero.ctaLogin")}</Link>
              </Button>
            </div>
            <p className="mt-8 text-sm text-muted-foreground">
              {t("landing.hero.footerNote")}
            </p>
          </div>
        </section>

        <section className="border-b border-border/50 py-20 sm:py-28">
          <div className="content-max">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 text-primary ring-1 ring-primary/30 shadow-sm">
                <Target className="h-7 w-7" />
              </div>
              <h2 className="mt-5 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl section-title-accent inline-block">
                {t("landing.why.title")}
              </h2>
              <div className="mt-8 grid gap-8 text-left sm:grid-cols-2">
                <div className="card-premium card-hover p-6">
                  <h3 className="font-display font-semibold text-foreground text-lg">{t("landing.why.problem")}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {t("landing.why.problemDesc")}
                  </p>
                </div>
                <div className="card-premium card-hover p-6 border-primary/25 bg-primary/5">
                  <h3 className="font-display font-semibold text-foreground text-lg">{t("landing.why.solution")}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {t("landing.why.solutionDesc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-28">
          <div className="content-max">
            <div className="text-center">
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl section-title-accent inline-block">
                {t("landing.features.title")}
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-muted-foreground leading-relaxed">
                {t("landing.features.subtitle")}
              </p>
            </div>
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featureKeys.map(({ key, icon: Icon }) => (
                <div key={key} className={cn("group card-premium card-hover p-6")}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/25 transition-all duration-300 group-hover:bg-primary/25 group-hover:ring-primary/40 group-hover:scale-105">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                    {t(`landing.features.${key}`)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground prose-read">
                    {t(`landing.features.${key}Desc`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border/60 bg-muted/40 py-16 sm:py-24">
          <div className="content-max">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Bot className="h-6 w-6" />
              </div>
              <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {t("landing.features.aiTitle")}
              </h2>
              <p className="mt-3 text-muted-foreground">
                {t("landing.features.aiSubtitle")}
              </p>
            </div>
            <div className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-3">
              <div className="card-premium card-hover p-6 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">{t("landing.features.normalize")}</span>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t("landing.features.normalizeDesc")}
                </p>
              </div>
              <div className="card-premium card-hover p-6 text-center border-primary/20">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">{t("landing.features.map")}</span>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t("landing.features.mapDesc")}
                </p>
              </div>
              <div className="card-premium card-hover p-6 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">{t("landing.features.evidenceGen")}</span>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t("landing.features.evidenceGenDesc")}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border/60 bg-muted/40 py-16 sm:py-24">
          <div className="content-max">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/20">
                <Github className="h-7 w-7" />
              </div>
              <h2 className="mt-6 font-display text-3xl font-bold tracking-tight text-foreground section-title-accent inline-block">
                {t("landing.features.openSourceTitle")}
              </h2>
              <p className="mt-4 text-muted-foreground">
                {t("landing.features.openSourceDesc")}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/register">{t("landing.features.openSourceCta")}</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/login">{t("landing.features.openSourceLogin")}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24">
          <div className="content-max">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Lock className="h-6 w-6" />
              </div>
              <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl section-title-accent inline-block">
                {t("landing.features.securityTitle")}
              </h2>
              <p className="mt-3 text-muted-foreground">
                {t("landing.features.securityDesc")}
              </p>
            </div>
            <div className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-4 text-sm">
              {["auth", "https", "dataEncryption", "auditLogs", "gdpr", "soc2Hipaa"].map((k) => (
                <span key={k} className="rounded-full border border-border/80 bg-card px-4 py-2.5 text-muted-foreground shadow-sm transition-colors hover:border-primary/30 hover:text-foreground">
                  {t(`landing.features.${k}`)}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border/60 bg-muted/30 py-16 sm:py-24">
          <div className="content-max">
            <div className="mx-auto max-w-2xl text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <HelpCircle className="h-6 w-6" />
              </div>
              <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl section-title-accent inline-block">
                {t("landing.features.faqTitle")}
              </h2>
            </div>
            <Accordion type="single" collapsible className="mx-auto mt-10 max-w-2xl">
              <AccordionItem value="free">
                <AccordionTrigger>{t("landing.features.faqFreeQ")}</AccordionTrigger>
                <AccordionContent>{t("landing.features.faqFreeA")}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="data">
                <AccordionTrigger>{t("landing.features.faqDataQ")}</AccordionTrigger>
                <AccordionContent>{t("landing.features.faqDataA")}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="export">
                <AccordionTrigger>{t("landing.features.faqExportQ")}</AccordionTrigger>
                <AccordionContent>{t("landing.features.faqExportA")}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="language">
                <AccordionTrigger>{t("landing.features.faqLangQ")}</AccordionTrigger>
                <AccordionContent>{t("landing.features.faqLangA")}</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <section className="py-16 sm:py-24">
          <div className="content-max text-center">
            <h2 className="section-title-accent inline-block text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {t("landing.features.finalCtaTitle")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              {t("landing.features.finalCtaSubtitle")}
            </p>
            <Button size="lg" className="mt-8 gap-2" asChild>
              <Link href="/register">
                {t("landing.features.finalCtaButton")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 bg-muted/30 py-8">
        <div className="content-max flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">RegLens</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <Link href="/guide" className="hover:text-foreground hover:underline">
              {t("landing.features.footerGuide")}
            </Link>
            <Link href="/docs" className="hover:text-foreground hover:underline">
              {t("landing.features.footerDocs")}
            </Link>
            <Link href="/login" className="hover:text-foreground hover:underline">
              {t("landing.features.footerLogin")}
            </Link>
            <Link href="/register" className="hover:text-foreground hover:underline">
              {t("landing.features.footerRegister")}
            </Link>
            <span className="hidden sm:inline">·</span>
            <span>{t("landing.features.footerLicense")}</span>
          </div>
        </div>
        <div className="content-max mt-4 text-center text-xs text-muted-foreground sm:text-left">
          {t("landing.features.footerTagline")}
        </div>
        <div className="content-max mt-2 text-center text-xs text-muted-foreground sm:text-left">
          {t("landing.features.footerSupport")}
        </div>
      </footer>
    </div>
  )
}
