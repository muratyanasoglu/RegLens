"use client"

import { useTranslations } from "@/components/locale-provider"

type TranslatedTextProps = {
  textKey: string
  fallback?: string
  values?: Record<string, string | number>
}

export function TranslatedText({ textKey, fallback, values }: TranslatedTextProps) {
  const t = useTranslations().t
  let text = t(textKey)

  if (text === textKey && fallback) {
    text = fallback
  }

  if (values) {
    for (const [key, value] of Object.entries(values)) {
      text = text.replaceAll(`{${key}}`, String(value))
    }
  }

  return <>{text}</>
}
