"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [securityQuestion, setSecurityQuestion] = useState("")
  const [securityAnswer, setSecurityAnswer] = useState("")
  const [error, setError] = useState<Record<string, string[]> | string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!username.trim() || !email.trim() || !password || !securityQuestion || !securityAnswer.trim()) {
      setError("Tüm zorunlu alanları doldurun.")
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
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Kayıt başarısız.")
        setLoading(false)
        return
      }
      router.push("/login?registered=1")
      router.refresh()
    } catch {
      setError("Kayıt sırasında bir hata oluştu.")
      setLoading(false)
    }
  }

  const errMsg = typeof error === "string" ? error : error && typeof error === "object" && !Array.isArray(error) ? Object.values(error).flat().join(" ") : null

  return (
    <Card className="glass-card card-premium w-full max-w-md animate-fade-in-up shadow-card-hover">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="font-display text-2xl font-bold tracking-tight">Kayıt ol</CardTitle>
        <CardDescription>
          Kullanıcı adı, e-posta ve güvenlik sorusu ile hesap oluşturun
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5">
          {errMsg && (
            <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
              {errMsg}
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="username">Kullanıcı adı *</Label>
            <Input
              id="username"
              type="text"
              autoComplete="username"
              placeholder="ornek_kullanici"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border-border bg-muted/50 placeholder:text-muted-foreground focus-visible:ring-primary"
            />
            <p className="text-xs text-muted-foreground">Sadece harf, rakam, tire ve alt çizgi (en az 3 karakter)</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-posta *</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="ornek@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-border bg-muted/50 placeholder:text-muted-foreground focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Ad Soyad (isteğe bağlı)</Label>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Adınız Soyadınız"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-border bg-muted/50 placeholder:text-muted-foreground focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Şifre *</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="En az 8 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-border bg-muted/50 placeholder:text-muted-foreground focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label>Şifre kurtarma sorusu *</Label>
            <Select value={securityQuestion} onValueChange={setSecurityQuestion}>
              <SelectTrigger className="border-border bg-muted/50 placeholder:text-muted-foreground focus-visible:ring-primary">
                <SelectValue placeholder="Bir soru seçin" />
              </SelectTrigger>
              <SelectContent>
                {SECURITY_QUESTIONS.map((q) => (
                  <SelectItem key={q.value} value={q.value}>
                    {q.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="securityAnswer">Güvenlik sorusu cevabı *</Label>
            <Input
              id="securityAnswer"
              type="text"
              autoComplete="off"
              placeholder="Cevabınızı girin (şifre unutulduğunda kullanılacak)"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              className="border-border bg-muted/50 placeholder:text-muted-foreground focus-visible:ring-primary"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pt-2">
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Kaydediliyor..." : "Kayıt ol"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Zaten hesabınız var mı?{" "}
            <Link href="/login" className="font-medium text-primary hover:text-primary/90 hover:underline">
              Giriş yapın
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
