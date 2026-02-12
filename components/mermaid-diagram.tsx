"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type MermaidDiagramProps = {
  code: string
  className?: string
  title?: string
}

export function MermaidDiagram({ code, className, title }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !containerRef.current || !code.trim()) return

    let cancelled = false
    const id = `mermaid-${Math.random().toString(36).slice(2, 11)}`

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default
        mermaid.initialize({
          startOnLoad: false,
          theme: "neutral",
          securityLevel: "loose",
          flowchart: { useMaxWidth: true, htmlLabels: true },
          er: { useMaxWidth: true },
        })
        const { svg } = await mermaid.render(id, code)
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg
          setError(null)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Diyagram yüklenemedi.")
        }
      }
    }

    render()
    return () => {
      cancelled = true
    }
  }, [mounted, code])

  if (!mounted) {
    return (
      <div
        className={cn(
          "flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/30",
          className
        )}
      >
        <span className="text-sm text-muted-foreground">Yükleniyor…</span>
      </div>
    )
  }

  return (
    <div className={cn("space-y-2", className)}>
      {title && (
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
      )}
      {error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : (
        <div
          ref={containerRef}
          className="mermaid-container flex justify-center overflow-x-auto rounded-lg border border-border/80 bg-card p-4 [&_svg]:max-w-full"
        />
      )}
    </div>
  )
}
