"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Plus, Mail } from "lucide-react"

type Org = { id: string; name: string; slug: string; role: string }

export default function OrganizationsPage() {
  const router = useRouter()
  const { update } = useSession()
  const [organizations, setOrganizations] = useState<Org[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [name, setName] = useState("")
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/me/organizations")
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => setOrganizations(Array.isArray(list) ? list : []))
      .catch(() => setOrganizations([]))
      .finally(() => setLoading(false))
  }, [])

  async function handleSwitch(organizationId: string) {
    const res = await fetch("/api/me/switch-org", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organizationId }),
    })
    if (res.ok) {
      await update()
      router.refresh()
      router.push("/dashboard")
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!name.trim()) return
    setCreating(true)
    try {
      const res = await fetch("/api/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error?.name?.[0] ?? data.error ?? "Oluşturulamadı.")
        return
      }
      setOrganizations((prev) => [...prev, { id: data.id, name: data.name, slug: data.slug, role: "ADMIN" }])
      setName("")
      setCreateOpen(false)
      router.refresh()
      router.push("/dashboard")
    } catch {
      setError("Bağlantı hatası.")
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="flex flex-col">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Organizasyonlar</h1>
        <p className="text-muted-foreground max-w-2xl">
          Birden fazla organizasyon oluşturabilir veya davet kabul edebilirsiniz. <strong>Aktif organizasyon</strong> (sol menüden seçtiğiniz) tüm sayfalardaki verileri belirler: kaynaklar, güncellemeler, görevler, grafikler ve raporlar yalnızca o organizasyona aittir. Organizasyon değiştirdiğinizde veriler karışmaz.
        </p>
      </div>
      <div className="content-max flex flex-col gap-6 py-6 lg:py-8">
        {loading ? (
          <p className="text-muted-foreground">Yükleniyor...</p>
        ) : organizations.length === 0 && !createOpen ? (
          <Card className="card-premium max-w-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Organizasyon yok
              </CardTitle>
              <CardDescription>
                Devam etmek için yeni bir organizasyon oluşturun veya size gönderilen bir daveti kabul edin.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button onClick={() => setCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Organizasyon oluştur
              </Button>
              <Button variant="outline" asChild>
                <Link href="/invites">
                  <Mail className="mr-2 h-4 w-4" />
                  Davetlerim
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {organizations.length > 0 && (
              <Card className="card-premium">
                <CardHeader>
                  <CardTitle>Organizasyonlarım</CardTitle>
                  <CardDescription>Aktif olarak kullanmak istediğiniz organizasyonu seçin. Seçtiğiniz organizasyon tüm sayfalarda (dashboard, kaynaklar, güncellemeler, görevler, uyumluluk, grafikler) gösterilecek veriyi belirler.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {organizations.map((org) => (
                      <li key={org.id}>
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-3"
                          onClick={() => handleSwitch(org.id)}
                        >
                          <Building2 className="h-4 w-4" />
                          <span className="font-medium">{org.name}</span>
                          <span className="text-muted-foreground text-sm">({org.role})</span>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            <Card className="card-premium max-w-lg">
              <CardHeader>
                <CardTitle>Yeni organizasyon</CardTitle>
                <CardDescription>Yeni bir organizasyon oluşturduğunuzda o organizasyonda yönetici (ADMIN) olursunuz; ardından takım daveti gönderebilirsiniz.</CardDescription>
              </CardHeader>
              <CardContent>
                {createOpen || organizations.length === 0 ? (
                  <form onSubmit={handleCreate} className="space-y-4">
                    {error && (
                      <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="org-name">Organizasyon adı</Label>
                      <Input
                        id="org-name"
                        placeholder="Örn. Acme Corp"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={creating}>
                        {creating ? "Oluşturuluyor..." : "Oluştur"}
                      </Button>
                      {organizations.length > 0 && (
                        <Button type="button" variant="outline" onClick={() => { setCreateOpen(false); setError(null); }}>
                          İptal
                        </Button>
                      )}
                    </div>
                  </form>
                ) : (
                  <Button onClick={() => setCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Başka organizasyon oluştur
                  </Button>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
