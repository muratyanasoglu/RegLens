"use client"

import { useTranslations } from "@/components/locale-provider"
import { User, Calendar, Shield } from "lucide-react"
import { format } from "date-fns"

type Props = {
  assigneeName: string | null
  dueDate: Date | null
  controlRef: string
}

export function TaskDetailInfo({ assigneeName, dueDate, controlRef }: Props) {
  const t = useTranslations().t
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-xs text-muted-foreground">{t("tasksDetail.assignee")}</p>
          <p className="text-sm text-card-foreground">{assigneeName ?? t("common.unassigned")}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-xs text-muted-foreground">{t("tasksDetail.dueDate")}</p>
          <p className="text-sm text-card-foreground">
            {dueDate ? format(dueDate, "MMM d, yyyy") : t("common.notSet")}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-xs text-muted-foreground">{t("tasksDetail.control")}</p>
          <p className="text-sm font-mono text-primary">{controlRef}</p>
        </div>
      </div>
    </div>
  )
}
