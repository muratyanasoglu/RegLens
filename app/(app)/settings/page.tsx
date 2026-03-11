"use client"

import { useState } from "react"
import Link from "next/link"
import { useTranslations } from "@/components/locale-provider"
import { TranslatedPageHeader } from "@/components/translated-page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Eye, EyeOff, Database, Brain, Clock, Link2, User, Lock } from "lucide-react"

export default function SettingsPage() {
  const t = useTranslations().t
  const [showApiKey, setShowApiKey] = useState(false)
  const [mistralKey, setMistralKey] = useState("")
  const [mistralModel, setMistralModel] = useState("mistral-large-latest")
  const [cronEnabled, setCronEnabled] = useState(true)
  const [cronInterval, setCronInterval] = useState("60")

  return (
    <div className="flex flex-col">
      <TranslatedPageHeader
        titleKey="settings.title"
        descriptionKey="settings.description"
      />

      <div className="content-max flex flex-col gap-8 py-6 lg:py-8">
        <div className="mx-auto w-full max-w-2xl space-y-6">
        {/* Account and Authentication */}
        <Card className="card-premium card-hover">
          <CardHeader className="flex flex-row items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <div>
              <CardTitle className="text-sm font-medium text-card-foreground">{t("settings.authCardTitle")}</CardTitle>
              <CardDescription>{t("settings.authCardDesc")}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              {t("settings.authCardText")}
            </p>
            <Button asChild variant="outline" size="sm" className="w-fit">
              <Link href="/security/authentication">
                <Lock className="mr-2 h-4 w-4" />
                {t("settings.authCardLink")}
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Database */}
        <Card className="card-premium card-hover">
          <CardHeader className="flex flex-row items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            <div>
              <CardTitle className="text-sm font-medium text-card-foreground">{t("settings.databaseTitle")}</CardTitle>
              <CardDescription>{t("settings.databaseDesc")}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-card-foreground">{t("settings.connectionStatus")}</p>
                <p className="text-xs text-muted-foreground">{t("settings.databaseTech")}</p>
              </div>
              <Badge className="border-0 bg-success text-success-foreground">{t("settings.demoMode")}</Badge>
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t("settings.databaseUrl")}</Label>
              <Input
                type="password"
                value="mysql://root:****@localhost:3306/reglens"
                readOnly
                className="font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground">
                {t("settings.databaseUrlHint")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* AI Provider */}
        <Card className="card-premium card-hover">
          <CardHeader className="flex flex-row items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            <div>
              <CardTitle className="text-sm font-medium text-card-foreground">{t("settings.aiProviderTitle")}</CardTitle>
              <CardDescription>{t("settings.aiProviderDesc")}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>{t("settings.apiKeyLabel")}</Label>
              <div className="relative">
                <Input
                  type={showApiKey ? "text" : "password"}
                  placeholder={t("settings.apiKeyPlaceholder")}
                  value={mistralKey}
                  onChange={(e) => setMistralKey(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                {mistralKey ? t("settings.keyConfigured") : t("settings.noApiKeySet")}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t("settings.modelLabel")}</Label>
              <Select value={mistralModel} onValueChange={setMistralModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mistral-large-latest">mistral-large-latest</SelectItem>
                  <SelectItem value="mistral-medium-latest">mistral-medium-latest</SelectItem>
                  <SelectItem value="mistral-small-latest">mistral-small-latest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t("settings.embeddingModelLabel")}</Label>
              <Input value="mistral-embed" readOnly className="font-mono text-xs" />
            </div>
          </CardContent>
        </Card>

        {/* Cron Jobs */}
        <Card className="card-premium card-hover">
          <CardHeader className="flex flex-row items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <div>
              <CardTitle className="text-sm font-medium text-card-foreground">{t("settings.backgroundJobsTitle")}</CardTitle>
              <CardDescription>{t("settings.backgroundJobsDesc")}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-card-foreground">{t("settings.sourcePolling")}</p>
                <p className="text-xs text-muted-foreground">
                  {t("settings.sourcePollingDesc")}
                </p>
              </div>
              <Switch checked={cronEnabled} onCheckedChange={setCronEnabled} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t("settings.pollIntervalLabel")}</Label>
              <Select value={cronInterval} onValueChange={setCronInterval}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">{t("settings.every15min")}</SelectItem>
                  <SelectItem value="30">{t("settings.every30min")}</SelectItem>
                  <SelectItem value="60">{t("settings.everyHour")}</SelectItem>
                  <SelectItem value="360">{t("settings.every6hours")}</SelectItem>
                  <SelectItem value="1440">{t("settings.daily")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              {t("settings.cronEndpointHint")} <code className="font-mono text-xs">/api/cron/poll-sources</code>
            </p>
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card className="card-premium card-hover">
          <CardHeader className="flex flex-row items-center gap-2">
            <Link2 className="h-4 w-4 text-primary" />
            <div>
              <CardTitle className="text-sm font-medium text-card-foreground">{t("settings.integrationsTitle")}</CardTitle>
              <CardDescription>{t("settings.integrationsDesc")}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium text-card-foreground">{t("settings.jiraTitle")}</p>
                <p className="text-xs text-muted-foreground">{t("settings.jiraDesc")}</p>
              </div>
              <Badge variant="outline" className="bg-transparent">{t("settings.exportReady")}</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium text-card-foreground">{t("settings.asanaTitle")}</p>
                <p className="text-xs text-muted-foreground">{t("settings.asanaDesc")}</p>
              </div>
              <Badge variant="secondary">{t("settings.placeholder")}</Badge>
            </div>
          </CardContent>
        </Card>

        <Button className="self-end">{t("settings.saveSettings")}</Button>
        </div>
      </div>
    </div>
  )
}
