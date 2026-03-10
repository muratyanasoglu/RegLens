import React from "react"
import Link from "next/link"
import { Eye } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen flex flex-col bg-background bg-content-elite">
      <div className="pointer-events-none fixed inset-0 bg-app-grid opacity-40" aria-hidden />
      <div
        className="pointer-events-none fixed inset-0 opacity-60"
        style={{
          background: "radial-gradient(ellipse 100% 70% at 50% -20%, hsl(var(--primary) / 0.15), transparent 55%)",
        }}
      />
      <header className="relative z-10 flex items-center justify-between p-6 sm:p-8">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-2 py-2 text-foreground transition-all duration-200 hover:bg-accent/70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/25 ring-1 ring-primary/40 shadow-sm">
            <Eye className="h-5 w-5 text-primary" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">RegLens</span>
        </Link>
        <LanguageSwitcher />
      </header>
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-8 sm:py-12">
        {children}
      </main>
    </div>
  )
}
