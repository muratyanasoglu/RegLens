"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  FileText,
  ListTodo,
  Shield,
  ScrollText,
  Loader2,
  ArrowRight,
} from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"

type SearchResult = {
  updates: { id: string; title: string; riskLevel: string; href: string }[]
  tasks: { id: string; title: string; status: string; href: string }[]
  controls: { id: string; controlRef: string; title: string; frameworkName: string; href: string }[]
  frameworks: { id: string; name: string; version: string; href: string }[]
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SearchResult | null>(null)
  const router = useRouter()

  const runSearch = useCallback(async (q: string) => {
    if (!q || q.length < 2) {
      setResult(null)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      if (!res.ok) return
      const data = await res.json()
      setResult(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => runSearch(query), 200)
    return () => clearTimeout(t)
  }, [query, runSearch])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
        if (!open) setQuery("")
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open])

  const go = (href: string) => {
    router.push(href)
    setOpen(false)
    setQuery("")
    setResult(null)
  }

  const hasAny =
    result &&
    (result.updates.length > 0 ||
      result.tasks.length > 0 ||
      result.controls.length > 0 ||
      result.frameworks.length > 0)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-1.5 text-sm text-muted-foreground",
          "hover:bg-accent hover:text-accent-foreground",
          "max-w-[180px] sm:max-w-[220px]"
        )}
      >
        <span className="hidden sm:inline">Ara...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium sm:inline-flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Güncelleme, görev, kontrol veya çerçeve ara..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {loading && (
            <div className="flex justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
          {!loading && query.length >= 2 && !hasAny && (
            <CommandEmpty>Sonuç bulunamadı.</CommandEmpty>
          )}
          {!loading && hasAny && result && (
            <>
              {result.updates.length > 0 && (
                <CommandGroup heading="Güncellemeler">
                  {result.updates.map((u) => (
                    <CommandItem
                      key={u.id}
                      value={u.id}
                      onSelect={() => go(u.href)}
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4 shrink-0" />
                      <span className="truncate">{u.title}</span>
                      <span
                        className={cn(
                          "ml-auto shrink-0 text-xs",
                          u.riskLevel === "critical" && "text-destructive",
                          u.riskLevel === "high" && "text-orange-600"
                        )}
                      >
                        {u.riskLevel}
                      </span>
                      <ArrowRight className="h-3 w-3 shrink-0 opacity-50" />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {result.tasks.length > 0 && (
                <CommandGroup heading="Görevler">
                  {result.tasks.map((t) => (
                    <CommandItem
                      key={t.id}
                      value={t.id}
                      onSelect={() => go(t.href)}
                      className="flex items-center gap-2"
                    >
                      <ListTodo className="h-4 w-4 shrink-0" />
                      <span className="truncate">{t.title}</span>
                      <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                        {t.status}
                      </span>
                      <ArrowRight className="h-3 w-3 shrink-0 opacity-50" />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {result.controls.length > 0 && (
                <CommandGroup heading="Kontroller">
                  {result.controls.map((c) => (
                    <CommandItem
                      key={c.id}
                      value={c.id}
                      onSelect={() => go(c.href)}
                      className="flex items-center gap-2"
                    >
                      <Shield className="h-4 w-4 shrink-0" />
                      <span className="shrink-0 font-mono text-xs">
                        {c.controlRef}
                      </span>
                      <span className="truncate">{c.title}</span>
                      <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                        {c.frameworkName}
                      </span>
                      <ArrowRight className="h-3 w-3 shrink-0 opacity-50" />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {result.frameworks.length > 0 && (
                <CommandGroup heading="Çerçeveler">
                  {result.frameworks.map((f) => (
                    <CommandItem
                      key={f.id}
                      value={f.id}
                      onSelect={() => go(f.href)}
                      className="flex items-center gap-2"
                    >
                      <ScrollText className="h-4 w-4 shrink-0" />
                      <span className="truncate">{f.name}</span>
                      <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                        v{f.version}
                      </span>
                      <ArrowRight className="h-3 w-3 shrink-0 opacity-50" />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </>
          )}
          {!loading && query.length > 0 && query.length < 2 && (
            <CommandEmpty>En az 2 karakter girin.</CommandEmpty>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
