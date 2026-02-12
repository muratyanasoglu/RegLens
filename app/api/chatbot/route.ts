import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/next-auth"

const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions"
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY ?? ""
const SYSTEM_PROMPT = `Sen RegLens web uygulamasının yardım asistanısın. Sadece RegLens ve bu web sitesi ile ilgili konularda yardım et.

Görevin:
- Kullanıcıya RegLens özelliklerini (Dashboard, Kaynaklar, Güncellemeler, Kontroller, Görevler, Kanıt, Denetim Paketleri, Çerçeveler, Uyumluluk, Güvenlik, Ayarlar) kısaca açıkla.
- Site içi navigasyon ve sayfa işlevleri hakkında bilgi ver.
- Sadece web sitesi ve uygulama kullanımı ile sınırlı kal; genel hukuk, genel siber güvenlik veya başka konularda tavsiye verme.
- Cevaplar kısa, net ve Türkçe olsun.
- Bilmediğin veya site dışı konularda: "Bu konuda yardımcı olamıyorum; sadece RegLens web sitesi ve özellikleri hakkında soru sorabilirsiniz." de.`

type Message = { role: "user" | "assistant"; content: string }

/** Fallback: site ile ilgili sık sorulan sorulara kısa yanıtlar (API key yoksa). */
function fallbackReply(userMessage: string): string {
  const q = userMessage.toLowerCase().trim()
  if (
    q.includes("reglens") &&
    (q.includes("ne") || q.includes("nedir") || q.includes("what") || q.includes("nasıl"))
  ) {
    return "RegLens, düzenleyici değişiklikleri izleyen, kontrollere eşleyen ve görev/kanıt üreten bir uyumluluk platformudur. Dashboard'dan genel özeti, Kaynaklar'dan beslemeleri, Güncellemeler'den değişiklikleri, Görevler'den aksiyonları yönetebilirsiniz."
  }
  if (q.includes("dashboard") || q.includes("ana sayfa")) {
    return "Dashboard'da güncel metrikler (güncelleme sayısı, açık görevler, kritik riskler, uyumluluk puanı), grafikler ve son güncellemeler ile öncelikli görevler gösterilir."
  }
  if (q.includes("kaynak") || q.includes("source")) {
    return "Kaynaklar sayfasından RSS veya API kaynakları ekleyebilirsiniz. Eklenen kaynaklar periyodik taranır; yeni düzenlemeler Güncellemeler'de listelenir."
  }
  if (q.includes("güncelleme") || q.includes("update")) {
    return "Güncellemeler, kaynaklardan tespit edilen düzenleyici değişikliklerdir. Her güncelleme için risk seviyesi, durum ve kontrol eşlemeleri görüntülenir; detay sayfasından ilgili görevlere gidebilirsiniz."
  }
  if (q.includes("kontrol") || q.includes("control")) {
    return "Kontroller, çerçevelere (örn. SOC 2, ISO 27001) ait maddelerdir. Kontroller sayfasından tüm kontrolleri ve hangi güncellemelere eşlendiğini inceleyebilirsiniz."
  }
  if (q.includes("görev") || q.includes("task")) {
    return "Görevler, eşlemelerden veya güncellemelerden üretilen aksiyon maddeleridir. Görevler sayfasından durum, öncelik ve atanan kişiye göre filtreleyebilirsiniz."
  }
  if (q.includes("kanıt") || q.includes("evidence")) {
    return "Kanıt çalışma alanında denetim için kanıt şablonları oluşturup görevlere bağlayabilirsiniz."
  }
  if (q.includes("denetim") || q.includes("audit")) {
    return "Denetim Paketleri ile görev ve kanıtları tek pakette toplayıp dışa aktarabilirsiniz. Yeni paket oluşturup ilgili görevleri seçebilirsiniz."
  }
  if (q.includes("çerçeve") || q.includes("framework")) {
    return "Çerçeveler sayfasında uyumluluk çerçeveleri ve kontrolleri listelenir. Uyumluluk sayfasında çerçeve bazlı kapsama oranını görebilirsiniz."
  }
  if (q.includes("uyumluluk") || q.includes("compliance")) {
    return "Uyumluluk sayfasında çerçeve bazlı özet, toplam kontroller ve eşleme sayıları, ortalama kapsama oranı gösterilir."
  }
  if (q.includes("güvenlik") || q.includes("security")) {
    return "Güvenlik bölümünde sertifikalar, güvenlik politikaları ve denetim kayıtları yer alır."
  }
  if (q.includes("ayar") || q.includes("setting")) {
    return "Ayarlar'dan hesap, veritabanı, AI (Mistral) ve entegrasyon yapılandırmalarına erişebilirsiniz."
  }
  if (q.includes("nasıl") && (q.includes("ekle") || q.includes("kaynak"))) {
    return "Kaynaklar sayfasına gidin, 'Add Source' ile yeni kaynak ekleyin; isim ve URL (RSS/API) girin. Kaynak ekledikten sonra 'Poll Now' ile manuel tarama yapabilirsiniz."
  }
  if (q.includes("giriş") || q.includes("login") || q.includes("kayıt")) {
    return "Giriş için e-posta veya kullanıcı adı ve şifre kullanılır. Şifremi unuttum ile güvenlik sorusuyla şifre sıfırlanabilir. Kayıt ol sayfasından yeni hesap oluşturabilirsiniz."
  }
  return "Bu konuda yardımcı olamıyorum; lütfen sadece RegLens web sitesi ve özellikleri (Dashboard, Kaynaklar, Güncellemeler, Görevler, Kanıt, Denetim Paketleri, Ayarlar vb.) hakkında soru sorun."
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: { message?: string; history?: Message[] }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const message = typeof body.message === "string" ? body.message.trim() : ""
  if (!message) {
    return NextResponse.json({ error: "message required" }, { status: 400 })
  }

  const history: Message[] = Array.isArray(body.history) ? body.history : []

  if (MISTRAL_API_KEY) {
    try {
      const messages: { role: string; content: string }[] = [
        { role: "system", content: SYSTEM_PROMPT },
        ...history.slice(-10).map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: message },
      ]
      const res = await fetch(MISTRAL_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MISTRAL_API_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.MISTRAL_MODEL || "mistral-large-latest",
          messages,
          temperature: 0.3,
          max_tokens: 512,
        }),
      })
      if (!res.ok) {
        const err = await res.text()
        console.error("[chatbot] Mistral error:", res.status, err)
        return NextResponse.json({
          reply: fallbackReply(message),
        })
      }
      const data = (await res.json()) as { choices?: { message?: { content?: string } }[] }
      const reply =
        data.choices?.[0]?.message?.content?.trim() || fallbackReply(message)
      return NextResponse.json({ reply })
    } catch (e) {
      console.error("[chatbot] Mistral request failed:", e)
      return NextResponse.json({ reply: fallbackReply(message) })
    }
  }

  return NextResponse.json({ reply: fallbackReply(message) })
}
