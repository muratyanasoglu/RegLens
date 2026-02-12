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

type Step = "request" | "reset"

export default function ForgotPasswordPage() {
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
      setError("E-posta veya kullanıcı adı girin.")
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
        setError(data.error ?? "İşlem başarısız.")
        setLoading(false)
        return
      }
      setSecurityQuestion(data.securityQuestion)
      setStep("reset")
      setError("")
    } catch {
      setError("İstek sırasında bir hata oluştu.")
    }
    setLoading(false)
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!answer.trim() || !newPassword || newPassword.length < 8) {
      setError("Güvenlik cevabı ve en az 8 karakterlik yeni şifre girin.")
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
            "Şifre güncellenemedi."
        )
        setLoading(false)
        return
      }
      setSuccess(true)
    } catch {
      setError("Şifre güncellenirken bir hata oluştu.")
    }
    setLoading(false)
  }

  if (success) {
    return (
      <Card className="w-full max-w-md animate-fade-in-up border-slate-700/80 bg-slate-800/60 shadow-xl backdrop-blur-sm text-slate-100">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl font-semibold tracking-tight">Şifre güncellendi</CardTitle>
          <CardDescription className="text-slate-400">
            Yeni şifrenizle giriş yapabilirsiniz.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/login" className="w-full">
            <Button className="w-full" size="lg">Giriş sayfasına git</Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md animate-fade-in-up border-slate-700/80 bg-slate-800/60 shadow-xl backdrop-blur-sm text-slate-100">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-semibold tracking-tight">Şifremi unuttum</CardTitle>
        <CardDescription className="text-slate-400">
          {step === "request"
            ? "E-posta veya kullanıcı adınızı girin; size güvenlik sorusunu göstereceğiz."
            : "Güvenlik sorusunu cevaplayıp yeni şifre belirleyin."}
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
              <Label htmlFor="emailOrUsername">E-posta veya kullanıcı adı</Label>
              <Input
                id="emailOrUsername"
                type="text"
                autoComplete="username"
                placeholder="ornek@email.com veya kullaniciadi"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                className="border-slate-600 bg-slate-900/50 placeholder:text-slate-500 focus-visible:ring-primary"
              />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Güvenlik sorusu</Label>
                <p className="text-sm text-slate-300 rounded-md bg-slate-900/50 border border-slate-600 px-3 py-2">
                  {securityQuestion}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="answer">Cevabınız</Label>
                <Input
                  id="answer"
                  type="text"
                  autoComplete="off"
                  placeholder="Cevabı girin"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="border-slate-600 bg-slate-900/50 placeholder:text-slate-500 focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Yeni şifre</Label>
                <Input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="En az 8 karakter"
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
              ? "İşleniyor..."
              : step === "request"
                ? "Güvenlik sorusunu getir"
                : "Şifreyi güncelle"}
          </Button>
          {step === "reset" && (
            <Button
              type="button"
              variant="ghost"
              className="w-full text-slate-400"
              onClick={() => setStep("request")}
            >
              Geri
            </Button>
          )}
          <Link href="/login" className="text-center text-sm font-medium text-primary hover:text-primary/90 hover:underline">
            Giriş sayfasına dön
          </Link>
        </CardFooter>
      </form>
    </Card>
  )
}
