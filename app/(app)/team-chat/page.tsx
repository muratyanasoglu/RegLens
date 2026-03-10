"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useSession } from "next-auth/react"
import { TranslatedPageHeader } from "@/components/translated-page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslations } from "@/components/locale-provider"
import { Send, Users } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

type GroupMessage = {
  id: string
  body: string
  type: string
  attachmentUrl?: string | null
  attachmentName?: string | null
  createdAt: string
  senderId: string
  sender: { id: string; name: string | null; username: string }
}

const POLL_INTERVAL_MS = 4000

export default function TeamChatPage() {
  const { data: session, status } = useSession()
  const t = useTranslations().t
  const [messages, setMessages] = useState<GroupMessage[]>([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const currentUserId = (session?.user as { id?: string } | undefined)?.id

  const organizationId = (session?.user as { organizationId?: string } | undefined)?.organizationId
  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch("/api/chat/group?limit=100")
      if (res.ok) {
        const data = await res.json()
        setMessages(data.messages ?? [])
        setError(null)
      } else if (res.status === 401 || res.status === 400) {
        setError(t("teamChat.selectOrgOrMember"))
        setMessages([])
      }
    } catch {
      setError(t("teamChat.messagesLoadFailed"))
    } finally {
      setLoading(false)
    }
  }, [organizationId])

  useEffect(() => {
    if (status !== "authenticated" || !organizationId) return
    setLoading(true)
    fetchMessages()
  }, [status, organizationId, fetchMessages])

  useEffect(() => {
    if (status !== "authenticated") return
    const id = setInterval(fetchMessages, POLL_INTERVAL_MS)
    return () => clearInterval(id)
  }, [status, fetchMessages])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || sending) return
    setSending(true)
    setInput("")
    try {
      const res = await fetch("/api/chat/group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: text, type: "text" }),
      })
      if (res.ok) {
        const msg = await res.json()
        setMessages((prev) => [...prev, msg])
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? t("teamChat.sendFailed"))
      }
    } finally {
      setSending(false)
    }
  }

  if (status !== "authenticated") {
    return (
      <div className="flex flex-col">
        <TranslatedPageHeader titleKey="teamChat.title" descriptionKey="teamChat.description" />
        <Card className="content-max card-premium mt-4">
          <CardContent className="flex min-h-[200px] items-center justify-center p-6">
            <p className="text-muted-foreground">{t("common.loading")}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <TranslatedPageHeader titleKey="teamChat.title" descriptionKey="teamChat.description" />
      <Card className="content-max card-premium mt-4 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">{t("teamChat.orgOnly")}</span>
        </div>
        <CardContent className="flex flex-1 flex-col p-0">
          {error && (
            <div className="border-b bg-destructive/10 px-4 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center p-6">
              <p className="text-muted-foreground">{t("common.loading")}</p>
            </div>
          ) : (
            <div
              ref={scrollRef}
              className="flex min-h-[300px] max-h-[60vh] flex-1 flex-col gap-3 overflow-y-auto p-4"
            >
                {messages.length === 0 && !error && (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    {t("teamChat.noMessages")}
                  </p>
                )}
                {messages.map((msg) => {
                  const isMe = msg.senderId === currentUserId
                  const displayName = msg.sender.name || msg.sender.username
                  return (
                    <div
                      key={msg.id}
                      className={isMe ? "ml-auto flex max-w-[85%] flex-col items-end" : "flex max-w-[85%] flex-col"}
                    >
                      {!isMe && (
                        <span className="mb-0.5 text-xs font-medium text-muted-foreground">
                          {displayName}
                        </span>
                      )}
                      <div
                        className={cn(
                          "rounded-2xl px-3 py-2 text-sm",
                          isMe
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        )}
                      >
                        {msg.type === "image" && msg.attachmentUrl && (
                          <a
                            href={msg.attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <img
                              src={msg.attachmentUrl}
                              alt={msg.attachmentName ?? t("common.image")}
                              className="max-h-48 rounded-lg object-cover"
                            />
                          </a>
                        )}
                        {msg.type === "file" && msg.attachmentUrl && (
                          <a
                            href={msg.attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs underline"
                          >
                            {msg.attachmentName ?? t("common.file")}
                          </a>
                        )}
                        {(msg.type === "text" || !msg.attachmentUrl) && msg.body && (
                          <p className="whitespace-pre-wrap break-words">{msg.body}</p>
                        )}
                      </div>
                      <span className="mt-0.5 text-[10px] text-muted-foreground">
                        {format(new Date(msg.createdAt), "dd.MM.yyyy HH:mm")}
                      </span>
                    </div>
                  )
                })}
            </div>
          )}
          <form
            onSubmit={handleSend}
            className="flex gap-2 border-t bg-background p-3"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("teamChat.placeholder")}
              className="flex-1"
              maxLength={10000}
              disabled={sending || !!error}
            />
            <Button type="submit" size="icon" disabled={sending || !input.trim() || !!error}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
