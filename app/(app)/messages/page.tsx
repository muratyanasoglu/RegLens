"use client"

import { Suspense, useState, useEffect, useRef, useCallback } from "react"
import { TranslatedPageHeader } from "@/components/translated-page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTranslations } from "@/components/locale-provider"
import { useSearchParams } from "next/navigation"
import { Send, MessageCircle, Paperclip, Image as ImageIcon, Search } from "lucide-react"
import { cn } from "@/lib/utils"

type User = { id: string; name: string | null; username: string; email: string }
type Conversation = {
  user: User
  lastMessage: {
    body: string
    type?: string
    attachmentUrl?: string | null
    createdAt: string
    readAt: string | null
    fromMe: boolean
  } | null
  unreadCount: number
}
type Message = {
  id: string
  body: string
  type: string
  attachmentUrl?: string | null
  attachmentName?: string | null
  createdAt: string
  readAt: string | null
  senderId: string
  sender: { id: string; name: string | null; username: string }
}

const POLL_INTERVAL_MS = 3000

function MessagesContent() {
  const t = useTranslations().t
  const searchParams = useSearchParams()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchQ, setSearchQ] = useState("")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [selectedUserDetail, setSelectedUserDetail] = useState<User | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const selectedUser =
    selectedUserDetail ??
    conversations.find((c) => c.user.id === selectedUserId)?.user ??
    searchResults.find((u) => u.id === selectedUserId) ??
    null

  useEffect(() => {
    if (selectedUserId && !selectedUserDetail) {
      const fromConv = conversations.find((c) => c.user.id === selectedUserId)?.user
      if (fromConv) setSelectedUserDetail(fromConv)
    }
    if (!selectedUserId) setSelectedUserDetail(null)
  }, [selectedUserId, conversations, selectedUserDetail])

  useEffect(() => {
    const withId = searchParams.get("with")
    if (withId) setSelectedUserId(withId)
  }, [searchParams])

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/chat/conversations")
      if (res.ok) {
        const data = await res.json()
        setConversations(data)
      }
    } catch {
      // ignore
    }
  }, [])

  const fetchMessages = useCallback(async (withUserId: string, cursor?: string) => {
    if (!withUserId) return
    const url = cursor
      ? `/api/chat/messages?with=${withUserId}&cursor=${cursor}&limit=50`
      : `/api/chat/messages?with=${withUserId}&limit=50`
    try {
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        if (cursor) {
          setMessages((prev) => [...(data.messages ?? []), ...prev])
        } else {
          setMessages(data.messages ?? [])
        }
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    fetchConversations().finally(() => setLoading(false))
  }, [fetchConversations])

  useEffect(() => {
    if (!selectedUserId) {
      setMessages([])
      return
    }
    fetchMessages(selectedUserId)
  }, [selectedUserId, fetchMessages])

  useEffect(() => {
    if (!selectedUserId) return
    const id = setInterval(() => {
      fetchMessages(selectedUserId)
      fetchConversations()
    }, POLL_INTERVAL_MS)
    return () => clearInterval(id)
  }, [selectedUserId, fetchMessages, fetchConversations])

  useEffect(() => {
    if (searchQ.trim().length < 1) {
      setSearchResults([])
      return
    }
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/chat/search?q=${encodeURIComponent(searchQ.trim())}`)
      if (res.ok) setSearchResults(await res.json())
      else setSearchResults([])
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQ])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  async function sendMessage(payload: { toUserId: string; body: string; type?: string; attachmentUrl?: string; attachmentName?: string }) {
    const res = await fetch("/api/chat/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toUserId: payload.toUserId, body: payload.body, type: payload.type ?? "text", attachmentUrl: payload.attachmentUrl, attachmentName: payload.attachmentName }),
    })
    if (res.ok) {
      const msg = await res.json()
      setMessages((prev) => [...prev, msg])
      fetchConversations()
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if ((!text && !selectedUserId) || !selectedUserId || sending) return
    setSending(true)
    setInput("")
    try {
      await sendMessage({ toUserId: selectedUserId, body: text || " " })
    } finally {
      setSending(false)
    }
  }

  async function handleFile(files: FileList | null, kind: "image" | "file") {
    if (!files?.length || !selectedUserId || sending) return
    setSending(true)
    try {
      const formData = new FormData()
      formData.set("file", files[0])
      formData.set("kind", kind)
      const up = await fetch("/api/upload", { method: "POST", body: formData })
      if (!up.ok) {
        setSending(false)
        return
      }
      const { url, name } = await up.json()
      await sendMessage({
        toUserId: selectedUserId,
        body: kind === "image" ? `📷 ${t("common.image")}` : `📎 ${t("common.file")}`,
        type: kind,
        attachmentUrl: url,
        attachmentName: name,
      })
    } finally {
      setSending(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
      if (imageInputRef.current) imageInputRef.current.value = ""
    }
  }

  function formatTime(iso: string) {
    const d = new Date(iso)
    const now = new Date()
    const sameDay = d.toDateString() === now.toDateString()
    if (sameDay) return d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
    return d.toLocaleDateString("tr-TR", { day: "numeric", month: "short" }) + " " + d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
  }

  const allChatUsers = [...conversations.map((c) => c.user), ...searchResults.filter((u) => !conversations.some((c) => c.user.id === u.id))]

  return (
    <div className="flex flex-col">
      <TranslatedPageHeader titleKey="messages.title" descriptionKey="messages.description" />

      <div className="content-max flex flex-1 flex-col gap-4 py-4 lg:flex-row lg:gap-6 lg:py-6">
        <Card className="card-premium w-full shrink-0 lg:w-80">
          <CardContent className="p-0">
            <div className="border-b p-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Arkadaş ara (kullanıcı adı)..."
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <ScrollArea className="h-[280px] lg:h-[calc(100vh-16rem)]">
              {loading ? (
                <div className="p-4 text-sm text-muted-foreground">{t("common.loading")}</div>
              ) : (
                <ul className="divide-y divide-border/60">
                  {searchResults.length > 0 && searchQ.trim() ? (
                    searchResults.map((u) => (
                      <li key={u.id}>
                        <button
                          type="button"
                          onClick={() => { setSelectedUserId(u.id); setSelectedUserDetail(u); setSearchQ(""); setSearchResults([]); }}
                          className={cn(
                            "flex w-full flex-col gap-0.5 px-4 py-3 text-left transition-colors hover:bg-muted/50",
                            selectedUserId === u.id && "bg-muted/80"
                          )}
                        >
                          <span className="truncate font-medium">{u.name || u.username}</span>
                          <span className="text-xs text-muted-foreground">@{u.username}</span>
                        </button>
                      </li>
                    ))
                  ) : conversations.length === 0 ? (
                    <div className="p-4 text-sm text-muted-foreground">Arkadaş listeniz boş. Arkadaş Ekle sayfasından istek gönderin.</div>
                  ) : (
                    conversations.map((c) => (
                      <li key={c.user.id}>
                        <button
                          type="button"
                          onClick={() => { setSelectedUserId(c.user.id); setSelectedUserDetail(c.user); }}
                          className={cn(
                            "flex w-full flex-col gap-0.5 px-4 py-3 text-left transition-colors hover:bg-muted/50",
                            selectedUserId === c.user.id && "bg-muted/80"
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate font-medium">{c.user.name || c.user.username || c.user.email}</span>
                            {c.unreadCount > 0 && (
                              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
                                {c.unreadCount}
                              </span>
                            )}
                          </div>
                          {c.lastMessage && (
                            <p className="truncate text-xs text-muted-foreground">
                              {c.lastMessage.fromMe ? "Siz: " : ""}
                              {c.lastMessage.type === "image" ? `📷 ${t("common.image")}` : c.lastMessage.type === "file" ? `📎 ${t("common.file")}` : c.lastMessage.body}
                            </p>
                          )}
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="card-premium flex flex-1 flex-col min-h-[360px] lg:min-h-[calc(100vh-14rem)]">
          {selectedUser ? (
            <>
              <div className="border-b border-border/60 px-4 py-2">
                <p className="font-medium">{selectedUser.name || selectedUser.username || selectedUser.email}</p>
                <p className="text-xs text-muted-foreground">@{selectedUser.username}</p>
              </div>
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4">
                <div className="flex flex-col gap-2 py-4">
                  {messages.length === 0 && (
                    <p className="py-8 text-center text-sm text-muted-foreground">Henüz mesaj yok. Metin yazın veya resim/dosya gönderin.</p>
                  )}
                  {messages.map((m) => {
                    const fromMe = m.senderId !== selectedUser.id
                    return (
                      <div
                        key={m.id}
                        className={cn(
                          "flex max-w-[85%] flex-col gap-0.5",
                          fromMe ? "self-end" : "self-start"
                        )}
                      >
                        <div
                          className={cn(
                            "rounded-2xl px-4 py-2",
                            fromMe ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted text-foreground rounded-bl-md"
                          )}
                        >
                          {m.type === "image" && m.attachmentUrl ? (
                            <a href={m.attachmentUrl} target="_blank" rel="noopener noreferrer" className="block">
                              <img src={m.attachmentUrl} alt="" className="max-w-full max-h-64 rounded-lg object-cover" />
                            </a>
                          ) : m.type === "file" && m.attachmentUrl ? (
                            <a href={m.attachmentUrl} download={m.attachmentName ?? undefined} className="flex items-center gap-2 underline">
                              📎 {m.attachmentName ?? t("common.file")}
                            </a>
                          ) : null}
                          {m.body && <p className="whitespace-pre-wrap break-words text-sm">{m.body}</p>}
                        </div>
                        <p className={cn("text-[10px] text-muted-foreground", fromMe ? "text-right" : "text-left")}>
                          {formatTime(m.createdAt)}
                          {fromMe && (m.readAt ? " ✓✓" : " ✓")}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
              <form onSubmit={handleSend} className="flex gap-2 border-t border-border/60 p-4">
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files, "image")}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,application/zip"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files, "file")}
                />
                <Button type="button" variant="outline" size="icon" onClick={() => imageInputRef.current?.click()} disabled={sending} title={t("common.image")}>
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button type="button" variant="outline" size="icon" onClick={() => fileInputRef.current?.click()} disabled={sending} title={t("common.file")}>
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Mesaj yazın..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1"
                  disabled={sending}
                />
                <Button type="submit" size="icon" disabled={sending}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-muted-foreground">
              <MessageCircle className="h-12 w-12" />
              <p className="text-sm">Sohbet başlatmak için soldan bir arkadaş seçin veya kullanıcı adıyla arayın.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="content-max flex min-h-[200px] items-center justify-center py-12 text-muted-foreground">
          Loading...
        </div>
      }
    >
      <MessagesContent />
    </Suspense>
  )
}
