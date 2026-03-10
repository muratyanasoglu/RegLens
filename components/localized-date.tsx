"use client"

import { useTranslations } from "@/components/locale-provider"

type LocalizedDateProps = {
  value: string | number | Date
}

const localeToIntl: Record<string, string> = {
  en: "en-US",
  fr: "fr-FR",
  es: "es-ES",
  tr: "tr-TR",
}

export function LocalizedDate({ value }: LocalizedDateProps) {
  const { locale } = useTranslations()
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  const formatted = new Intl.DateTimeFormat(localeToIntl[locale] ?? "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)

  return <>{formatted}</>
}
