"use client"

import { useState } from "react"
import Link from "next/link"
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
import { useTranslations } from "@/components/locale-provider"

type Step = "request" | "reset"

export default function ForgotPasswordPage() {
  const t = useTranslations().t
  const [step, setStep] = useState<Step>("request")
  const [emailOrUsername, setEmailOrUsername] = useState("")
  const [securityQuestion, setSecurityQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!emailOrUsername.trim()) {
      setError(t("auth.forgotPassword.errorEmailRequired"))
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/forgot-password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrUsername: emailOrUsername.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? t("auth.forgotPassword.errorRequestFailed"))
        setLoading(false)
        return
      }
      setSecurityQuestion(data.securityQuestion)
      setStep("reset")
      setError("")
    } catch {
      setError(t("auth.forgotPassword.errorRequest"))
    }
    setLoading(false)
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!answer.trim() || !newPassword || newPassword.length < 8) {
      setError(t("auth.forgotPassword.errorResetRequired"))
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailOrUsername: emailOrUsername.trim(),
          answer: answer.trim(),
          newPassword,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(
          (data.error && (typeof data.error === "string" ? data.error : data.error.answer?.[0])) ??
            t("auth.forgotPassword.errorResetFailed")
        )
        setLoading(false)
        return
      }
      setSuccess(true)
    } catch {
      setError(t("auth.forgotPassword.errorReset"))
    }
    setLoading(false)
  }

  if (success) {
    return (
      <Card className="glass-card card-premium w-full max-w-md animate-fade-in-up shadow-card-hover">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl font-semibold tracking-tight">{t("auth.forgotPassword.successTitle")}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {t("auth.forgotPassword.successDescription")}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/login" className="w-full">
            <Button className="w-full" size="lg">{t("auth.forgotPassword.goToLogin")}</Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="glass-card card-premium w-full max-w-md animate-fade-in-up shadow-card-hover">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-semibold tracking-tight">{t("auth.forgotPassword.title")}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {step === "request"
            ? t("auth.forgotPassword.descriptionRequest")
            : t("auth.forgotPassword.descriptionReset")}
        </CardDescription>
      </CardHeader>
      <form onSubmit={step === "request" ? handleRequest : handleReset}>
        <CardContent className="space-y-5">
          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-300">
              {error}
            </p>
          )}
          {step === "request" ? (
            <div className="space-y-2">
              <Label htmlFor="emailOrUsername">{t("auth.forgotPassword.emailOrUsername")}</Label>
              <Input
                id="emailOrUsername"
                type="text"
                autoComplete="username"
                placeholder={t("auth.login.placeholderEmail")}
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                className="border-slate-600 bg-slate-900/50 placeholder:text-slate-500 focus-visible:ring-primary"
              />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label>{t("auth.forgotPassword.securityQuestion")}</Label>
                <p className="text-sm text-slate-300 rounded-md bg-slate-900/50 border border-slate-600 px-3 py-2">
                  {securityQuestion && t(`auth.securityQuestions.${securityQuestion}`) !== `auth.securityQuestions.${securityQuestion}` ? t(`auth.securityQuestions.${securityQuestion}`) : securityQuestion}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="answer">{t("auth.forgotPassword.yourAnswer")}</Label>
                <Input
                  id="answer"
                  type="text"
                  autoComplete="off"
                  placeholder={t("auth.forgotPassword.placeholderAnswer")}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="border-slate-600 bg-slate-900/50 placeholder:text-slate-500 focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">{t("auth.forgotPassword.newPassword")}</Label>
                <Input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder={t("auth.register.placeholderPassword")}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border-slate-600 bg-slate-900/50 placeholder:text-slate-500 focus-visible:ring-primary"
                />
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pt-2">
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading
              ? t("auth.forgotPassword.processing")
              : step === "request"
                ? t("auth.forgotPassword.getQuestion")
                : t("auth.forgotPassword.updatePassword")}
          </Button>
          {step === "reset" && (
            <Button
              type="button"
              variant="ghost"
              className="w-full text-slate-400"
              onClick={() => setStep("request")}
            >
              {t("auth.forgotPassword.back")}
            </Button>
          )}
          <Link href="/login" className="text-center text-sm font-medium text-primary hover:text-primary/90 hover:underline">
            {t("auth.forgotPassword.backToLogin")}
          </Link>
        </CardFooter>
      </form>
    </Card>
  )
}
