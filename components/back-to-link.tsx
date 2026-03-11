"use client"

import Link from "next/link"
import { useTranslations } from "@/components/locale-provider"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

type Props = {
  href: string
  labelKey: string
}

export function BackToLink({ href, labelKey }: Props) {
  const t = useTranslations().t
  return (
    <Button variant="outline" size="sm" asChild>
      <Link href={href}>
        <ArrowLeft className="mr-1 h-4 w-4" />
        {t(labelKey)}
      </Link>
    </Button>
  )
}
