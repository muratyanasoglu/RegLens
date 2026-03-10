"use client"

import { PageHeader } from "@/components/page-header"
import { useTranslations } from "@/components/locale-provider"

interface TranslatedPageHeaderProps {
  titleKey?: string
  title?: string
  descriptionKey?: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export function TranslatedPageHeader({
  titleKey,
  title,
  descriptionKey,
  description,
  children,
  className,
}: TranslatedPageHeaderProps) {
  const t = useTranslations().t
  const resolvedTitle = titleKey ? t(titleKey) : (title ?? "")
  const resolvedDescription = descriptionKey ? t(descriptionKey) : description
  return (
    <PageHeader
      title={resolvedTitle}
      description={resolvedDescription}
      className={className}
    >
      {children}
    </PageHeader>
  )
}
