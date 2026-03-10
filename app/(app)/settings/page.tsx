"use client"

import { useState } from "react"
import Link from "next/link"
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
              <CardTitle className="text-sm font-medium text-card-foreground">Hesap ve Kimlik Doğrulama</CardTitle>
              <CardDescription>Şifre değiştirme, güvenlik sorusu ve oturum</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Kullanıcı adı, e-posta, şifre ve şifre kurtarma güvenlik sorusunu yönetmek için Kimlik Doğrulama sayfasına gidin.
            </p>
            <Button asChild variant="outline" size="sm" className="w-fit">
              <Link href="/security/authentication">
                <Lock className="mr-2 h-4 w-4" />
                Kimlik Doğrulama ayarları
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Database */}
        <Card className="card-premium card-hover">
          <CardHeader className="flex flex-row items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            <div>
              <CardTitle className="text-sm font-medium text-card-foreground">Database</CardTitle>
              <CardDescription>MySQL connection configuration</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-card-foreground">Connection Status</p>
                <p className="text-xs text-muted-foreground">MySQL 8.0 via Prisma ORM</p>
              </div>
              <Badge className="border-0 bg-success text-success-foreground">Demo Mode</Badge>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Database URL</Label>
              <Input
                type="password"
                value="mysql://root:****@localhost:3306/reglens"
                readOnly
                className="font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground">
                Set via DATABASE_URL environment variable
              </p>
            </div>
          </CardContent>
        </Card>

        {/* AI Provider */}
        <Card className="card-premium card-hover">
          <CardHeader className="flex flex-row items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            <div>
              <CardTitle className="text-sm font-medium text-card-foreground">AI Provider</CardTitle>
              <CardDescription>Mistral AI configuration</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>API Key</Label>
              <div className="relative">
                <Input
                  type={showApiKey ? "text" : "password"}
                  placeholder="Enter your Mistral API key..."
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
                {mistralKey ? "Key configured" : "No API key set - using deterministic mock outputs"}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Model</Label>
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
              <Label>Embedding Model</Label>
              <Input value="mistral-embed" readOnly className="font-mono text-xs" />
            </div>
          </CardContent>
        </Card>

        {/* Cron Jobs */}
        <Card className="card-premium card-hover">
          <CardHeader className="flex flex-row items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <div>
              <CardTitle className="text-sm font-medium text-card-foreground">Background Jobs</CardTitle>
              <CardDescription>Automated source polling and processing</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-card-foreground">Source Polling</p>
                <p className="text-xs text-muted-foreground">
                  Automatically fetch and process regulatory updates
                </p>
              </div>
              <Switch checked={cronEnabled} onCheckedChange={setCronEnabled} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Poll Interval (minutes)</Label>
              <Select value={cronInterval} onValueChange={setCronInterval}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">Every 15 minutes</SelectItem>
                  <SelectItem value="30">Every 30 minutes</SelectItem>
                  <SelectItem value="60">Every hour</SelectItem>
                  <SelectItem value="360">Every 6 hours</SelectItem>
                  <SelectItem value="1440">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              Cron endpoint: <code className="font-mono text-xs">/api/cron/poll-sources</code>
            </p>
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card className="card-premium card-hover">
          <CardHeader className="flex flex-row items-center gap-2">
            <Link2 className="h-4 w-4 text-primary" />
            <div>
              <CardTitle className="text-sm font-medium text-card-foreground">Integrations</CardTitle>
              <CardDescription>Task management export integrations</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium text-card-foreground">Jira</p>
                <p className="text-xs text-muted-foreground">Export tasks to Jira projects</p>
              </div>
              <Badge variant="outline" className="bg-transparent">Export Ready</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium text-card-foreground">Asana</p>
                <p className="text-xs text-muted-foreground">Sync tasks with Asana workspaces</p>
              </div>
              <Badge variant="secondary">Placeholder</Badge>
            </div>
          </CardContent>
        </Card>

        <Button className="self-end">Save Settings</Button>
        </div>
      </div>
    </div>
  )
}
