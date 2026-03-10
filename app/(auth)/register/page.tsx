"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SECURITY_QUESTIONS } from "@/lib/auth-constants"
import { useTranslations } from "@/components/locale-provider"

type InviteInfo = { email: string; role: string; organizationName: string; invitedByName: string }

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations().t
  const inviteToken = searchParams.get("invite") ?? undefined
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [securityQuestion, setSecurityQuestion] = useState("")
  const [securityAnswer, setSecurityAnswer] = useState("")
  const [error, setError] = useState<Record<string, string[]> | string | null>(null)
  const [loading, setLoading] = useState(false)
  const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null)
  const [inviteError, setInviteError] = useState<string | null>(null)

  useEffect(() => {
    if (!inviteToken) return
    fetch(`/api/invites/${inviteToken}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.email) {
          setInviteInfo(data)
          setEmail(data.email)
        } else setInviteError(data.error ?? "Davet yüklenemedi")
      })
      .catch(() => setInviteError("Davet yüklenemedi"))
  }, [inviteToken])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!username.trim() || !email.trim() || !password || !securityQuestion || !securityAnswer.trim()) {
      setError(t("auth.register.errorRequired"))
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          name: name.trim() || undefined,
          password,
          securityQuestion,
          securityAnswer: securityAnswer.trim(),
          ...(inviteToken ? { inviteToken } : {}),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? t("auth.register.errorFailed"))
        setLoading(false)
        return
      }
      router.push("/login?registered=1")
      router.refresh()
    } catch {
      setError(t("auth.register.errorGeneric"))
      setLoading(false)
    }
  }

  const errMsg = typeof error === "string" ? error : error && typeof error === "object" && !Array.isArray(error) ? Object.values(error).flat().join(" ") : null

  return (
    <Card className="glass-card card-premium w-full max-w-md animate-fade-in-up shadow-card-hover">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="font-display text-2xl font-bold tracking-tight">{t("auth.register.title")}</CardTitle>
        <CardDescription>
          {t("auth.register.description")}
        </CardDescription>
        {inviteToken && inviteError && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {inviteError}
          </p>
        )}
        {inviteToken && inviteInfo && (
          <p className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-foreground">
            <strong>{inviteInfo.organizationName}</strong> organizasyonuna <strong>{inviteInfo.invitedByName}</strong> tarafından davet edildiniz. Rol: {inviteInfo.role}.
          </p>
        )}
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5">
          {errMsg && (
            <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
              {errMsg}
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="username">{t("auth.register.username")}</Label>
            <Input
              id="username"
              type="text"
              autoComplete="username"
              placeholder={t("auth.register.placeholderUsername")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border-border bg-muted/50 placeholder:text-muted-foreground focus-visible:ring-primary"
            />
            <p className="text-xs text-muted-foreground">{t("auth.register.usernameHint")}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t("auth.register.email")}</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder={t("auth.register.placeholderEmail")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={!!inviteInfo}
              className="border-border bg-muted/50 placeholder:text-muted-foreground focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">{t("auth.register.name")}</Label>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              placeholder={t("auth.register.placeholderName")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-border bg-muted/50 placeholder:text-muted-foreground focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("auth.register.password")}</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder={t("auth.register.placeholderPassword")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-border bg-muted/50 placeholder:text-muted-foreground focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label>{t("auth.register.securityQuestion")}</Label>
            <Select value={securityQuestion} onValueChange={setSecurityQuestion}>
              <SelectTrigger className="border-border bg-muted/50 placeholder:text-muted-foreground focus-visible:ring-primary">
                <SelectValue placeholder={t("auth.register.placeholderSelectQuestion")} />
              </SelectTrigger>
              <SelectContent>
                {SECURITY_QUESTIONS.map((q) => (
                  <SelectItem key={q.value} value={q.value}>
                    {t(`auth.securityQuestions.${q.value}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="securityAnswer">{t("auth.register.securityAnswer")}</Label>
            <Input
              id="securityAnswer"
              type="text"
              autoComplete="off"
              placeholder={t("auth.register.placeholderAnswer")}
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              className="border-border bg-muted/50 placeholder:text-muted-foreground focus-visible:ring-primary"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pt-2">
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? t("auth.register.submitting") : t("auth.register.submit")}
          </Button>
          <div className="relative">
            <span className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </span>
            <span className="relative flex justify-center text-xs uppercase text-muted-foreground">
              {t("auth.register.orDivider")}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              size="lg"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
              {t("auth.register.signUpWithGoogle")}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              size="lg"
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            >
              {t("auth.register.signUpWithGitHub")}
            </Button>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            {t("auth.register.hasAccount")}{" "}
            <Link href="/login" className="font-medium text-primary hover:text-primary/90 hover:underline">
              {t("auth.register.logIn")}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
