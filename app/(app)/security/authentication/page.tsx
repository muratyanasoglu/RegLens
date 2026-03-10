"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { TranslatedPageHeader } from "@/components/translated-page-header"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  User,
  Lock,
  HelpCircle,
  LogOut,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { signOut } from "next-auth/react"
import { SECURITY_QUESTIONS } from "@/lib/auth-constants"

type Profile = {
  id: string
  username: string
  email: string
  name: string | null
  role: string
  securityQuestion: string | null
  securityQuestionLabel: string | null
  lastLoginAt: string | null
  mfaEnabled: boolean
  createdAt: string
}

export default function AuthenticationPage() {
  const { data: session, status } = useSession()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)

  const [secCurrentPassword, setSecCurrentPassword] = useState("")
  const [secQuestion, setSecQuestion] = useState("")
  const [secAnswer, setSecAnswer] = useState("")
  const [secError, setSecError] = useState<string | null>(null)
  const [secSuccess, setSecSuccess] = useState(false)
  const [secLoading, setSecLoading] = useState(false)

  useEffect(() => {
    if (status !== "authenticated") return
    let cancelled = false
    fetch("/api/user/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) setProfile(data)
      })
      .finally(() => {
        if (!cancelled) setProfileLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [status])

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(false)
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Tüm alanları doldurun.")
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Yeni şifre ve tekrarı eşleşmiyor.")
      return
    }
    if (newPassword.length < 8) {
      setPasswordError("Yeni şifre en az 8 karakter olmalıdır.")
      return
    }
    setPasswordLoading(true)
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        const msg =
          data.error?.currentPassword?.[0] ||
          (typeof data.error === "string" ? data.error : "Şifre güncellenemedi.")
        setPasswordError(msg)
        setPasswordLoading(false)
        return
      }
      setPasswordSuccess(true)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch {
      setPasswordError("İstek sırasında bir hata oluştu.")
    }
    setPasswordLoading(false)
  }

  async function handleUpdateSecurityQuestion(e: React.FormEvent) {
    e.preventDefault()
    setSecError(null)
    setSecSuccess(false)
    if (!secCurrentPassword || !secQuestion || !secAnswer.trim()) {
      setSecError("Tüm alanları doldurun.")
      return
    }
    setSecLoading(true)
    try {
      const res = await fetch("/api/user/security-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: secCurrentPassword,
          securityQuestion: secQuestion,
          securityAnswer: secAnswer.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        const msg =
          data.error?.currentPassword?.[0] ||
          data.error?.securityQuestion?.[0] ||
          (typeof data.error === "string" ? data.error : "Güncellenemedi.")
        setSecError(msg)
        setSecLoading(false)
        return
      }
      setSecSuccess(true)
      setSecCurrentPassword("")
      setSecAnswer("")
      if (profile) {
        const q = SECURITY_QUESTIONS.find((x) => x.value === secQuestion)
        setProfile({
          ...profile,
          securityQuestion: secQuestion,
          securityQuestionLabel: q?.label ?? secQuestion,
        })
      }
    } catch {
      setSecError("İstek sırasında bir hata oluştu.")
    }
    setSecLoading(false)
  }

  if (status === "loading" || profileLoading) {
    return (
      <>
        <TranslatedPageHeader
          titleKey="security.authentication"
          descriptionKey="security.authenticationDesc"
        />
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </>
    )
  }

  if (!session) {
    return (
      <>
        <TranslatedPageHeader
          titleKey="security.authentication"
          descriptionKey="security.authenticationDescGuest"
        />
        <Card className="card-premium max-w-md">
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              Oturum açmanız gerekiyor. Lütfen giriş yapın.
            </p>
            <Button asChild className="mt-4">
              <a href="/login">Giriş yap</a>
            </Button>
          </CardContent>
        </Card>
      </>
    )
  }

  return (
    <>
      <TranslatedPageHeader
        titleKey="security.authentication"
        descriptionKey="security.authenticationDescAuth"
      />

      <div className="content-max py-6 lg:py-8">
      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Hesap
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Şifre
          </TabsTrigger>
          <TabsTrigger value="security-question" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Güvenlik sorusu
          </TabsTrigger>
          <TabsTrigger value="session" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Oturum
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-4">
          <Card className="card-premium max-w-2xl">
            <CardHeader>
              <CardTitle>Hesap özeti</CardTitle>
              <CardDescription>
                Kullanıcı adı ve e-posta ile giriş yapabilirsiniz; şifre kurtarma güvenlik sorusu ile yapılır.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label className="text-muted-foreground">Kullanıcı adı</Label>
                <p className="font-medium">{profile?.username ?? session.user?.email ?? "—"}</p>
              </div>
              <div className="grid gap-2">
                <Label className="text-muted-foreground">E-posta</Label>
                <p className="font-medium">{profile?.email ?? "—"}</p>
              </div>
              <div className="grid gap-2">
                <Label className="text-muted-foreground">Ad Soyad</Label>
                <p className="font-medium">{profile?.name || "—"}</p>
              </div>
              <div className="grid gap-2">
                <Label className="text-muted-foreground">Rol</Label>
                <Badge variant="secondary">{profile?.role ?? "—"}</Badge>
              </div>
              {profile?.securityQuestionLabel && (
                <div className="grid gap-2">
                  <Label className="text-muted-foreground">Şifre kurtarma sorusu</Label>
                  <p className="text-sm text-muted-foreground">{profile.securityQuestionLabel}</p>
                </div>
              )}
              {profile?.lastLoginAt && (
                <div className="grid gap-2">
                  <Label className="text-muted-foreground">Son giriş</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(profile.lastLoginAt).toLocaleString("tr-TR")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="space-y-4">
          <Card className="card-premium max-w-2xl">
            <CardHeader>
              <CardTitle>Şifre değiştir</CardTitle>
              <CardDescription>
                Mevcut şifrenizi girip yeni şifre belirleyin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                {passwordError && (
                  <div className="flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {passwordError}
                  </div>
                )}
                {passwordSuccess && (
                  <div className="flex items-center gap-2 rounded-md border border-green-500/50 bg-green-500/10 px-3 py-2 text-sm text-green-700 dark:text-green-400">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    Şifre başarıyla güncellendi.
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="current-password">Mevcut şifre</Label>
                  <Input
                    id="current-password"
                    type="password"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Yeni şifre</Label>
                  <Input
                    id="new-password"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="En az 8 karakter"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Yeni şifre (tekrar)</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Aynı şifreyi tekrar girin"
                  />
                </div>
                <Button type="submit" disabled={passwordLoading}>
                  {passwordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Şifreyi güncelle
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security-question" className="space-y-4">
          <Card className="card-premium max-w-2xl">
            <CardHeader>
              <CardTitle>Güvenlik sorusu</CardTitle>
              <CardDescription>
                Şifremi unuttum akışında kullanılır. Sorusu ve cevabını değiştirmek için mevcut şifrenizi girin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {profile?.securityQuestionLabel && (
                <p className="mb-4 text-sm text-muted-foreground">
                  Mevcut soru: <span className="font-medium text-foreground">{profile.securityQuestionLabel}</span>
                </p>
              )}
              <form onSubmit={handleUpdateSecurityQuestion} className="space-y-4">
                {secError && (
                  <div className="flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {secError}
                  </div>
                )}
                {secSuccess && (
                  <div className="flex items-center gap-2 rounded-md border border-green-500/50 bg-green-500/10 px-3 py-2 text-sm text-green-700 dark:text-green-400">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    Güvenlik sorusu güncellendi.
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="sec-current-password">Mevcut şifre</Label>
                  <Input
                    id="sec-current-password"
                    type="password"
                    autoComplete="current-password"
                    value={secCurrentPassword}
                    onChange={(e) => setSecCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Yeni güvenlik sorusu</Label>
                  <Select value={secQuestion} onValueChange={setSecQuestion}>
                    <SelectTrigger>
                      <SelectValue placeholder="Soru seçin" />
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
                  <Label htmlFor="sec-answer">Cevap</Label>
                  <Input
                    id="sec-answer"
                    type="text"
                    autoComplete="off"
                    value={secAnswer}
                    onChange={(e) => setSecAnswer(e.target.value)}
                    placeholder="Cevabınızı girin"
                  />
                </div>
                <Button type="submit" disabled={secLoading}>
                  {secLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Güvenlik sorusunu güncelle
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="session" className="space-y-4">
          <Card className="card-premium max-w-2xl">
            <CardHeader>
              <CardTitle>Oturum</CardTitle>
              <CardDescription>
                Şu an bu cihazda giriş yaptınız. Tüm cihazlardan çıkış yapmak için aşağıdaki düğmeyi kullanın.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <p className="font-medium">Bu cihaz</p>
                <p className="text-sm text-muted-foreground">
                  Oturum JWT ile yönetiliyor. Çıkış yapınca bu cihazda oturum kapanır.
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Tüm cihazlardan çıkış yap
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </>
  )
}
