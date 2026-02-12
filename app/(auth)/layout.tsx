import React from "react"
import Link from "next/link"
import { Eye } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <div className="pointer-events-none fixed inset-0 bg-app-grid opacity-50" aria-hidden />
      <div
        className="pointer-events-none fixed inset-0 opacity-40"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 0%, hsl(var(--primary) / 0.12), transparent 60%)",
        }}
      />
      <header className="relative z-10 flex items-center p-6 sm:p-8">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-2 py-1.5 text-foreground transition-colors hover:bg-accent/80"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 ring-1 ring-primary/30">
            <Eye className="h-5 w-5 text-primary" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">RegLens</span>
        </Link>
      </header>
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-8 sm:py-12">
        {children}
      </main>
    </div>
  )
}
