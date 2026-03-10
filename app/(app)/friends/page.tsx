"use client"

import { useState, useEffect, useCallback } from "react"
import { TranslatedPageHeader } from "@/components/translated-page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslations } from "@/components/locale-provider"
import { UserPlus, Users, Search } from "lucide-react"

type User = { id: string; username: string; name: string | null; email: string }
type PendingOut = { id: string; user: User }
type PendingIn = { id: string; user: User }

export default function FriendsPage() {
  const t = useTranslations().t
  const [friends, setFriends] = useState<User[]>([])
  const [pendingOut, setPendingOut] = useState<PendingOut[]>([])
  const [pendingIn, setPendingIn] = useState<PendingIn[]>([])
  const [searchQ, setSearchQ] = useState("")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [searching, setSearching] = useState(false)
  const [sendingId, setSendingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/friends")
      if (res.ok) {
        const data = await res.json()
        setFriends(data.friends ?? [])
        setPendingOut(data.pendingOut ?? [])
        setPendingIn(data.pendingIn ?? [])
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (searchQ.trim().length < 2) {
      setSearchResults([])
      return
    }
    const t = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(searchQ.trim())}`)
        if (res.ok) setSearchResults(await res.json())
        else setSearchResults([])
      } catch {
        setSearchResults([])
      }
      setSearching(false)
    }, 300)
    return () => clearTimeout(t)
  }, [searchQ])

  async function sendRequest(toUserId: string) {
    setError(null)
    setSendingId(toUserId)
    try {
      const res = await fetch("/api/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toUserId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "İstek gönderilemedi.")
        return
      }
      setSearchQ("")
      setSearchResults([])
      load()
    } finally {
      setSendingId(null)
    }
  }

  async function acceptFriend(id: string) {
    try {
      await fetch(`/api/friends/${id}`, { method: "POST" })
      load()
    } catch {
      // ignore
    }
  }

  async function declineFriend(id: string) {
    try {
      await fetch(`/api/friends/${id}`, { method: "DELETE" })
      load()
    } catch {
      // ignore
    }
  }

  const friendIds = new Set(friends.map((f) => f.id))
  const pendingOutIds = new Set(pendingOut.map((p) => p.user.id))

  return (
    <div className="flex flex-col">
      <TranslatedPageHeader titleKey="addFriend.title" descriptionKey="addFriend.description" />

      <div className="content-max flex flex-col gap-6 py-6 lg:py-8">
        <Card className="card-premium card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Kullanıcı adına göre ara
            </CardTitle>
            <CardDescription>En az 2 karakter girin; arkadaşlık isteği gönderebileceğiniz kullanıcılar listelenir.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Kullanıcı adı, ad veya e-posta..."
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              className="max-w-md"
            />
            {error && (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
            )}
            {searching && <p className="text-sm text-muted-foreground">{t("common.loading")}</p>}
            {searchResults.length > 0 && (
              <ul className="space-y-2">
                {searchResults.map((u) => (
                  <li
                    key={u.id}
                    className="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-muted/30 px-4 py-3"
                  >
                    <div>
                      <p className="font-medium">{u.name || u.username}</p>
                      <p className="text-xs text-muted-foreground">@{u.username} · {u.email}</p>
                    </div>
                    {friendIds.has(u.id) ? (
                      <span className="text-sm text-muted-foreground">Zaten arkadaşsınız</span>
                    ) : pendingOutIds.has(u.id) ? (
                      <span className="text-sm text-muted-foreground">İstek gönderildi</span>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => sendRequest(u.id)}
                        disabled={sendingId === u.id}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        {sendingId === u.id ? t("common.loading") : "Arkadaşlık isteği gönder"}
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {pendingIn.length > 0 && (
          <Card className="card-premium card-hover">
            <CardHeader>
              <CardTitle>Gelen arkadaşlık istekleri</CardTitle>
              <CardDescription>Davetler sayfasından da kabul/red edebilirsiniz.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {pendingIn.map(({ id, user }) => (
                  <li
                    key={id}
                    className="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-muted/20 px-4 py-3"
                  >
                    <div>
                      <p className="font-medium">{user.name || user.username}</p>
                      <p className="text-xs text-muted-foreground">@{user.username}</p>
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

        <Card className="card-premium card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Arkadaşlarım
            </CardTitle>
            <CardDescription>{t("addFriend.chatFromMessages")}</CardDescription>
          </CardHeader>
          <CardContent>
            {friends.length === 0 ? (
              <p className="text-sm text-muted-foreground">Henüz arkadaş yok. Yukarıdan kullanıcı arayıp istek gönderin.</p>
            ) : (
              <ul className="space-y-2">
                {friends.map((u) => (
                  <li
                    key={u.id}
                    className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-4 py-3"
                  >
                    <div>
                      <p className="font-medium">{u.name || u.username}</p>
                      <p className="text-xs text-muted-foreground">@{u.username}</p>
                    </div>
                    <Button size="sm" variant="ghost" asChild>
                      <a href={`/messages?with=${u.id}`}>Mesaj gönder</a>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
