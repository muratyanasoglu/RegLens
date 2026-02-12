"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Loader2 } from "lucide-react"

type Message = { role: "user" | "assistant"; content: string }

const WELCOME =
  "Merhaba. RegLens ve bu web sitesi hakkında sorularınızı sorabilirsiniz (Dashboard, Kaynaklar, Güncellemeler, Görevler, Kanıt, Denetim Paketleri, Ayarlar vb.)."

export function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: WELCOME },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [open, messages])

  async function send() {
    const text = input.trim()
    if (!text || loading) return
    setInput("")
    const userMessage: Message = { role: "user", content: text }
    setMessages((prev) => [...prev, userMessage])
    setLoading(true)
    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }))
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      })
      const data = await res.json()
      const reply =
        typeof data.reply === "string"
          ? data.reply
          : "Yanıt alınamadı. Lütfen sadece site ile ilgili soru sorun."
      setMessages((prev) => [...prev, { role: "assistant", content: reply }])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Bağlantı hatası. Lütfen tekrar deneyin veya sadece site ile ilgili soru sorun.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full border-border/80 bg-card shadow-lg transition-all hover:bg-accent hover:shadow-md"
        aria-label="Yardım asistanı"
      >
        {open ? (
          <X className="h-5 w-5" />
        ) : (
          <MessageCircle className="h-5 w-5" />
        )}
      </Button>

      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 flex w-[360px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-card-hover"
          role="dialog"
          aria-label="Yardım asistanı"
        >
          <div className="border-b border-border/80 bg-muted/50 px-4 py-3">
            <h3 className="text-sm font-semibold text-foreground">
              RegLens Yardım
            </h3>
            <p className="text-xs text-muted-foreground">
              Sadece web sitesi ve özellikleri hakkında soru sorabilirsiniz.
            </p>
          </div>
          <div
            ref={scrollRef}
            className="flex h-[280px] flex-col gap-3 overflow-y-auto p-4"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Yanıtlanıyor...
                </div>
              </div>
            )}
          </div>
          <div className="border-t border-border/80 p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                send()
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Site hakkında soru yazın..."
                className="flex-1"
                disabled={loading}
              />
              <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
