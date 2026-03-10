"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { getNested } from "@/lib/i18n"
import type { Locale } from "@/lib/i18n"
import en from "@/messages/en.json"
import fr from "@/messages/fr.json"
import es from "@/messages/es.json"
import tr from "@/messages/tr.json"

const messages: Record<Locale, Record<string, unknown>> = { en, fr, es, tr }

const STORAGE_KEY = "reglens-locale"

type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function getStoredLocale(): Locale {
  if (typeof window === "undefined") return "en"
  const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
  if (stored && ["en", "fr", "es", "tr"].includes(stored)) return stored
  return "en"
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setLocaleState(getStoredLocale())
    setMounted(true)
  }, [])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, next)
      document.documentElement.lang = next
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.lang = locale
  }, [mounted, locale])

  const t = useCallback(
    (key: string) => {
      const value = getNested(messages[locale] as Record<string, unknown>, key)
      if (value != null && value !== "") return value
      const enValue = getNested(en as Record<string, unknown>, key)
      return enValue ?? key
    },
    [locale]
  )

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useTranslations() {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    const fallbackT = (key: string) => {
      const value = getNested(en as Record<string, unknown>, key)
      return value ?? key
    }
    return { locale: "en" as Locale, setLocale: () => {}, t: fallbackT }
  }
  return ctx
}
