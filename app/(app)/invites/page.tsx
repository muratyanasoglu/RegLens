"use client"

import { useState, useEffect } from "react"
import { TranslatedPageHeader } from "@/components/translated-page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTranslations } from "@/components/locale-provider"
import { Mail, UserPlus, Building2 } from "lucide-react"

type OrgInvite = {
  id: string
  role: string
  organization: { id: string; name: string }
  invitedBy: { id: string; username: string; name: string | null }
  createdAt: string
}
type FriendRequest = {
  id: string
  fromUser: { id: string; username: string; name: string | null; email: string }
  createdAt: string
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Yönetici",
  MANAGER: "Yönetici (İş)",
  AUDITOR: "Denetçi",
  USER: "Kullanıcı",
  VIEWER: "Görüntüleyici",
}

export default function InvitesPage() {
  const t = useTranslations().t
  const [orgInvites, setOrgInvites] = useState<OrgInvite[]>([])
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/invites/mine")
      .then((r) => r.ok ? r.json() : { orgInvites: [], friendRequests: [] })
      .then((data) => {
        setOrgInvites(data.orgInvites ?? [])
        setFriendRequests(data.friendRequests ?? [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function acceptOrgInvite(id: string) {
    try {
      const res = await fetch(`/api/invites/${id}/accept`, { method: "POST" })
      if (res.ok) {
        setOrgInvites((prev) => prev.filter((i) => i.id !== id))
        window.location.reload()
      }
    } catch {
      // ignore
    }
  }

  async function declineOrgInvite(id: string) {
    try {
      const res = await fetch(`/api/invites/${id}/decline`, { method: "POST" })
      if (res.ok) setOrgInvites((prev) => prev.filter((i) => i.id !== id))
    } catch {
      // ignore
    }
  }

  async function acceptFriend(id: string) {
    try {
      await fetch(`/api/friends/${id}`, { method: "POST" })
      setFriendRequests((prev) => prev.filter((f) => f.id !== id))
    } catch {
      // ignore
    }
  }

  async function declineFriend(id: string) {
    try {
      await fetch(`/api/friends/${id}`, { method: "DELETE" })
      setFriendRequests((prev) => prev.filter((f) => f.id !== id))
    } catch {
      // ignore
    }
  }

  return (
    <div className="flex flex-col">
      <TranslatedPageHeader titleKey="invites.title" descriptionKey="invites.description" />

      <div className="content-max flex flex-col gap-6 py-6 lg:py-8">
        {loading ? (
          <p className="text-muted-foreground">{t("common.loading")}</p>
        ) : (
          <>
            {orgInvites.length > 0 && (
              <Card className="card-premium card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Takım davetleri
                  </CardTitle>
                  <CardDescription>Bu davetleri kabul ederseniz ilgili organizasyona üye olursunuz (mevcut organizasyonunuz değişir).</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {orgInvites.map((inv) => (
                      <li
                        key={inv.id}
                        className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border/60 bg-muted/20 px-4 py-3"
                      >
                        <div>
                          <p className="font-medium">{inv.organization.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {inv.invitedBy.name || inv.invitedBy.username} sizi {ROLE_LABELS[inv.role] ?? inv.role} rolüyle davet etti.
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => declineOrgInvite(inv.id)}>
                            Reddet
                          </Button>
                          <Button size="sm" onClick={() => acceptOrgInvite(inv.id)}>
                            Kabul et
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {friendRequests.length > 0 && (
              <Card className="card-premium card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Arkadaşlık istekleri
                  </CardTitle>
                  <CardDescription>Kabul ettiğinizde arkadaş listenize eklenir ve Mesajlar üzerinden sohbet edebilirsiniz.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {friendRequests.map(({ id, fromUser }) => (
                      <li
                        key={id}
                        className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border/60 bg-muted/20 px-4 py-3"
                      >
                        <div>
                          <p className="font-medium">{fromUser.name || fromUser.username}</p>
                          <p className="text-sm text-muted-foreground">@{fromUser.username}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => declineFriend(id)}>
                            Reddet
                          </Button>
                          <Button size="sm" onClick={() => acceptFriend(id)}>
                            Kabul et
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {orgInvites.length === 0 && friendRequests.length === 0 && (
              <Card className="card-premium card-hover">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Mail className="h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">Bekleyen davet veya arkadaşlık isteği yok.</p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
