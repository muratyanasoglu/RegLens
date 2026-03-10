"use client"

import { useState, Suspense, useEffect } from "react"
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
import { useTranslations } from "@/components/locale-provider"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard"
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const t = useTranslations().t

  useEffect(() => {
    const err = searchParams.get("error")
    if (err) setError(t("auth.login.errorOAuth"))
  }, [searchParams, t])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!login.trim() || !password) {
      setError(t("auth.login.errorRequired"))
      return
    }
    setLoading(true)
    try {
      const res = await signIn("credentials", {
        login: login.trim(),
        password,
        redirect: false,
      })
      if (res?.error) {
        setError(t("auth.login.errorInvalid"))
        setLoading(false)
        return
      }
      router.push(callbackUrl)
      router.refresh()
    } catch {
      setError(t("auth.login.errorGeneric"))
      setLoading(false)
    }
  }

  return (
    <Card className="glass-card card-premium w-full max-w-md animate-fade-in-up shadow-card-hover">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="font-display text-2xl font-bold tracking-tight">
          {t("auth.login.title")}
        </CardTitle>
        <CardDescription>
          {t("auth.login.description")}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5">
          {error && (
            <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
              {error}
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="login">{t("auth.login.emailOrUsername")}</Label>
            <Input
              id="login"
              type="text"
              autoComplete="username"
              placeholder={t("auth.login.placeholderEmail")}
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="border-border bg-muted/50 placeholder:text-muted-foreground focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("auth.login.password")}</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-border bg-muted/50 placeholder:text-muted-foreground focus-visible:ring-primary"
            />
          </div>
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:text-primary/90 hover:underline"
            >
              {t("auth.login.forgotPassword")}
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pt-2">
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            size="lg"
          >
            {loading ? t("auth.login.submitting") : t("auth.login.submit")}
          </Button>
          <div className="relative">
              <span className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </span>
              <span className="relative flex justify-center text-xs uppercase text-muted-foreground">
                {t("auth.login.orDivider")}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                size="lg"
                onClick={() => signIn("google", { callbackUrl })}
              >
                {t("auth.login.signInWithGoogle")}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                size="lg"
                onClick={() => signIn("github", { callbackUrl })}
              >
                {t("auth.login.signInWithGitHub")}
              </Button>
            </div>
          <p className="text-center text-sm text-muted-foreground">
            {t("auth.login.noAccount")}{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:text-primary/90 hover:underline"
            >
              {t("auth.login.signUp")}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <Card className="glass-card card-premium w-full max-w-md p-8">
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </Card>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
