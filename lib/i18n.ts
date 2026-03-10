export type Locale = "en" | "fr" | "es" | "tr"

export const DEFAULT_LOCALE: Locale = "en"
export const LOCALES: Locale[] = ["en", "fr", "es", "tr"]

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  tr: "Türkçe",
}

/** Get nested value from object by dot path, e.g. "landing.hero.title" */
export function getNested(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split(".")
  let current: unknown = obj
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined
    current = (current as Record<string, unknown>)[part]
  }
  return typeof current === "string" ? current : undefined
}
