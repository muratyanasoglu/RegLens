"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { TranslatedPageHeader } from "@/components/translated-page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTranslations } from "@/components/locale-provider"
import { UserPlus, Users, Mail, Search } from "lucide-react"

type OrgUser = { id: string; name: string | null; username: string; email: string; role: string }
type InviteRow = {
  id: string
  email: string | null
  role: string
  status: string
  expiresAt: string
  invitee?: { id: string; username: string; name: string | null; email: string } | null
  invitedBy: { id: string; name: string | null; email: string }
}
type SearchUser = { id: string; username: string; name: string | null; email: string }

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Yönetici",
  MANAGER: "Yönetici (İş)",
  AUDITOR: "Denetçi",
  USER: "Kullanıcı",
  VIEWER: "Görüntüleyici",
}

export default function TeamPage() {
  const t = useTranslations().t
  const { data: session } = useSession()
  const [members, setMembers] = useState<OrgUser[]>([])
  const [invites, setInvites] = useState<InviteRow[]>([])
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteSearch, setInviteSearch] = useState("")
  const [searchResults, setSearchResults] = useState<SearchUser[]>([])
  const [selectedUser, setSelectedUser] = useState<SearchUser | null>(null)
  const [inviteRole, setInviteRole] = useState<string>("USER")
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [inviteSuccess, setInviteSuccess] = useState(false)
  const [canInvite, setCanInvite] = useState(false)
  const [loading, setLoading] = useState(true)

  const organizationId = (session?.user as { organizationId?: string } | undefined)?.organizationId
  useEffect(() => {
    if (!organizationId) return
    setLoading(true)
    Promise.all([
      fetch("/api/users").then((r) => (r.ok ? r.json() : [])),
      fetch("/api/invites")
        .then((r) => {
          if (r.ok) {
            setCanInvite(true)
            return r.json()
          }
          return []
        })
        .catch(() => []),
    ]).then(([users, invs]) => {
      setMembers(Array.isArray(users) ? users : [])
      setInvites(Array.isArray(invs) ? invs : [])
      setLoading(false)
    })
  }, [organizationId])

  useEffect(() => {
    if (inviteSearch.trim().length < 2) {
      setSearchResults([])
      return
    }
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(inviteSearch.trim())}`)
      if (res.ok) setSearchResults(await res.json())
      else setSearchResults([])
    }, 300)
    return () => clearTimeout(timer)
  }, [inviteSearch])

  async function handleCreateInvite(e: React.FormEvent) {
    e.preventDefault()
    setInviteError(null)
    setInviteSuccess(false)
    if (!selectedUser) return
    setInviteLoading(true)
    try {
      const res = await fetch("/api/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: selectedUser.username, role: inviteRole }),
      })
      const data = await res.json()
      if (!res.ok) {
        setInviteError(data.error ?? "Davet oluşturulamadı.")
        setInviteLoading(false)
        return
      }
      setInviteSuccess(true)
      setSelectedUser(null)
      setInviteSearch("")
      setSearchResults([])
      const invRes = await fetch("/api/invites")
      if (invRes.ok) setInvites(await invRes.json())
    } catch {
      setInviteError("Bağlantı hatası.")
    }
    setInviteLoading(false)
  }

  const pendingInvites = invites.filter((i) => i.status === "pending" && new Date(i.expiresAt) > new Date())
  const memberIds = new Set(members.map((m) => m.id))

  return (
    <div className="flex flex-col">
      <TranslatedPageHeader titleKey="team.title" descriptionKey="team.description" />

      <div className="content-max flex flex-col gap-6 py-6 lg:py-8">
        <Card className="card-premium card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Üyeler</CardTitle>
                <CardDescription>Organizasyondaki kullanıcılar</CardDescription>
              </div>
            </div>
            {canInvite && (
              <Button onClick={() => { setInviteOpen(true); setInviteSuccess(false); setInviteError(null); }}>
                <UserPlus className="mr-2 h-4 w-4" />
                Davet gönder
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
            ) : members.length === 0 ? (
              <p className="text-sm text-muted-foreground">Henüz üye yok.</p>
            ) : (
              <ul className="space-y-3">
                {members.map((u) => (
                  <li
                    key={u.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 bg-muted/30 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-sm font-medium text-primary">
                        {(u.name || u.username || u.email).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{u.name || u.username || u.email}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{ROLE_LABELS[u.role] ?? u.role}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {canInvite && pendingInvites.length > 0 && (
          <Card className="card-premium card-hover">
            <CardHeader className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Bekleyen davetler</CardTitle>
                <CardDescription>Davet edilen kullanıcı Davetler sayfasında ve bildirimde görecek.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {pendingInvites.map((inv) => (
                  <li
                    key={inv.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm"
                  >
                    <span>{inv.invitee ? `@${inv.invitee.username}` : inv.email ?? "-"}</span>
                    <Badge variant="outline">{ROLE_LABELS[inv.role] ?? inv.role}</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog
        open={inviteOpen}
        onOpenChange={(open) => {
          setInviteOpen(open)
          if (!open) {
            setInviteError(null)
            setInviteSuccess(false)
            setSelectedUser(null)
            setInviteSearch("")
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Üye davet et</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Kullanıcı adına göre arayın; davet gönderdiğiniz kişi bildirim ve Davetler sayfasında daveti görecek.
            </p>
          </DialogHeader>
          {inviteSuccess ? (
            <div className="py-4">
              <p className="text-sm text-primary font-medium">Davet gönderildi.</p>
              <p className="text-xs text-muted-foreground mt-1">Kullanıcı Davetler sayfasından kabul veya reddedebilir.</p>
            </div>
          ) : (
            <form onSubmit={handleCreateInvite} className="space-y-4">
              {inviteError && (
                <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {inviteError}
                </p>
              )}
              <div className="space-y-2">
                <Label>Kullanıcı ara</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Kullanıcı adı, ad veya e-posta..."
                    value={inviteSearch}
                    onChange={(e) => { setInviteSearch(e.target.value); setSelectedUser(null); }}
                    className="pl-9"
                  />
                </div>
                {searchResults.length > 0 && !selectedUser && (
                  <ul className="border rounded-lg divide-y max-h-40 overflow-auto">
                    {searchResults.filter((u) => !memberIds.has(u.id)).map((u) => (
                      <li key={u.id}>
                        <button
                          type="button"
                          className="w-full px-3 py-2 text-left text-sm hover:bg-muted/50 flex flex-col"
                          onClick={() => { setSelectedUser(u); setInviteSearch(u.name || u.username); setSearchResults([]); }}
                        >
                          <span className="font-medium">{u.name || u.username}</span>
                          <span className="text-xs text-muted-foreground">@{u.username}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {selectedUser && (
                  <p className="text-sm text-muted-foreground">
                    Seçilen: <strong>{selectedUser.name || selectedUser.username}</strong> (@{selectedUser.username})
                    <Button type="button" variant="ghost" size="sm" className="ml-2" onClick={() => setSelectedUser(null)}>Değiştir</Button>
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Rol</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["VIEWER", "USER", "AUDITOR", "MANAGER", "ADMIN"] as const).map((r) => (
                      <SelectItem key={r} value={r}>
                        {ROLE_LABELS[r]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setInviteOpen(false)}>
                  {t("common.cancel")}
                </Button>
                <Button type="submit" disabled={inviteLoading || !selectedUser}>
                  {inviteLoading ? t("common.loading") : "Davet gönder"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
