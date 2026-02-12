"use client"

import { useState, Suspense } from "react"
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

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard"
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!login.trim() || !password) {
      setError("E-posta veya kullanıcı adı ve şifre girin.")
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
        setError("Giriş bilgileri hatalı veya hesap kilitli.")
        setLoading(false)
        return
      }
      router.push(callbackUrl)
      router.refresh()
    } catch {
      setError("Giriş sırasında bir hata oluştu.")
      setLoading(false)
    }
  }

  return (
    <Card className="glass-card card-premium w-full max-w-md animate-fade-in-up shadow-card-hover">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="font-display text-2xl font-bold tracking-tight">
          Giriş yap
        </CardTitle>
        <CardDescription>
          E-posta veya kullanıcı adı ile giriş yapın
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
            <Label htmlFor="login">
              E-posta veya kullanıcı adı
            </Label>
            <Input
              id="login"
              type="text"
              autoComplete="username"
              placeholder="ornek@email.com veya kullaniciadi"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="border-border bg-muted/50 placeholder:text-muted-foreground focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">
              Şifre
            </Label>
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
              Şifremi unuttum
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
            {loading ? "Giriş yapılıyor..." : "Giriş yap"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Hesabınız yok mu?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:text-primary/90 hover:underline"
            >
              Kayıt olun
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
<Card className="glass-card w-full max-w-md p-8">
        <p className="text-muted-foreground">Yükleniyor...</p>
      </Card>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
