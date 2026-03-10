import Link from "next/link"
import { ArrowRight, BookOpen } from "lucide-react"
import { TranslatedPageHeader } from "@/components/translated-page-header"
import { MermaidDiagram } from "@/components/mermaid-diagram"
import { Button } from "@/components/ui/button"

const userJourneyDiagram = `
flowchart LR
  subgraph Giriş
    A[Kayıt Ol / Giriş Yap] --> B[Dashboard]
  end
  subgraph İzleme
    B --> C[Kaynaklar]
    C --> D[Güncellemeler]
  end
  subgraph Eşleme
    D --> E[Kontroller]
    E --> F[Görevler]
  end
  subgraph Çıktı
    F --> G[Kanıt]
    G --> H[Denetim Paketleri]
  end
  H --> I[Dışa Aktar]
`

const addSourceFlow = `
flowchart TD
  A[Kaynaklar sayfasına git] --> B[Add Source tıkla]
  B --> C[İsim ve URL gir]
  C --> D[RSS veya API seç]
  D --> E[Kaydet]
  E --> F[Poll Now ile manuel tarama]
  F --> G[Güncellemeler listesinde görünür]
`

const updateToTaskFlow = `
flowchart TD
  A[Güncellemeler listesi] --> B[Bir güncelleme seç]
  B --> C[Detay sayfasında kontrollere eşle]
  C --> D[AI veya manuel eşleme]
  D --> E[Görev oluştur]
  E --> F[Göreve atama yap]
  F --> G[Kanıt ekle]
  G --> H[Denetim paketine ekle]
`

const sidebarSections = `
flowchart TB
  subgraph Sol Menü
    M[Monitor]
    W[Workspace]
    G[Governance]
  end
  M --> D[Dashboard]
  M --> S[Sources]
  M --> U[Updates]
  M --> C[Controls]
  M --> T[Tasks]
  W --> E[Evidence]
  W --> A[Audit Packs]
  G --> F[Frameworks]
  G --> P[Compliance]
  G --> Sec[Security]
`

export default function GuidePage() {
  return (
    <div className="flex flex-col">
      <TranslatedPageHeader
        titleKey="guide.title"
        descriptionKey="guide.subtitle"
      />
      <div className="content-max py-6 lg:py-8">
        <div className="mx-auto max-w-3xl space-y-12">
          <section className="space-y-4">
            <h2 className="section-title-accent text-xl font-semibold text-foreground">1. Başlarken</h2>
            <p className="text-muted-foreground">
              Hesap oluşturmak için <Link href="/register" className="text-primary underline">Kayıt Ol</Link> sayfasına gidin.
              E-posta veya kullanıcı adı ve şifre ile giriş yapabilirsiniz. Giriş sonrası otomatik olarak <strong>Dashboard</strong> sayfasına yönlendirilirsiniz.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="section-title-accent text-xl font-semibold text-foreground">2. Genel akış</h2>
            <p className="text-muted-foreground">
              RegLens'te iş akışı: önce düzenleyici <strong>kaynakları</strong> ekleyin, sistem <strong>güncellemeleri</strong> tespit etsin;
              sonra bunları <strong>kontrollere</strong> eşleyin, <strong>görevler</strong> üretin, <strong>kanıt</strong> toplayın ve sonunda <strong>denetim paketleri</strong> ile dışa aktarın.
            </p>
            <MermaidDiagram
              code={userJourneyDiagram}
              title="Kaynaktan dışa aktarıma genel akış"
            />
          </section>

          <section className="space-y-4">
            <h2 className="section-title-accent text-xl font-semibold text-foreground">3. Sol menü ve sayfalar</h2>
            <p className="text-muted-foreground">
              Giriş yaptıktan sonra soldaki menüden tüm sayfalara ulaşırsınız. <strong>⌘K</strong> (veya <strong>Ctrl+K</strong>) ile global arama açabilirsiniz.
            </p>
            <MermaidDiagram
              code={sidebarSections}
              title="Sol menü yapısı"
            />
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li><strong>Dashboard:</strong> Metrikler, risk dağılımı, son güncellemeler ve kritik görevler.</li>
              <li><strong>Sources:</strong> RSS/API kaynakları ekleme, düzenleme ve tarama.</li>
              <li><strong>Updates:</strong> Tespit edilen düzenleyici değişiklikler; risk ve duruma göre filtreleme.</li>
              <li><strong>Controls:</strong> Çerçeve kontrolleri ve güncellemelere eşlemeler.</li>
              <li><strong>Tasks:</strong> Oluşturulan görevler; atama, öncelik ve son tarih.</li>
              <li><strong>Evidence:</strong> Kanıt şablonları ve görevlere bağlama.</li>
              <li><strong>Audit Packs:</strong> Görev ve kanıtları paketleyip PDF/Excel/CSV dışa aktarma.</li>
              <li><strong>Frameworks / Compliance / Security:</strong> Çerçeveler, uyumluluk özeti ve güvenlik ayarları.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="section-title-accent text-xl font-semibold text-foreground">4. Kaynak ekleme</h2>
            <p className="text-muted-foreground">
              Düzenleyici içerikleri izlemek için önce kaynak tanımlayın. Kaynaklar sayfasında &quot;Add Source&quot; ile isim ve URL (RSS veya API) girin; kaydettikten sonra &quot;Poll Now&quot; ile manuel tarama yapabilirsiniz.
            </p>
            <MermaidDiagram
              code={addSourceFlow}
              title="Kaynak ekleme adımları"
            />
          </section>

          <section className="space-y-4">
            <h2 className="section-title-accent text-xl font-semibold text-foreground">5. Güncellemeden göreve</h2>
            <p className="text-muted-foreground">
              Güncellemeler sayfasından bir değişiklik seçin. Detay sayfasında kontrollere eşleme yapın (AI önerisi veya manuel). Eşlemeden görev oluşturun, atama yapın, kanıt ekleyin ve gerekirse denetim paketine dahil edin.
            </p>
            <MermaidDiagram
              code={updateToTaskFlow}
              title="Güncelleme → Görev → Kanıt → Paket akışı"
            />
          </section>

          <section className="space-y-4">
            <h2 className="section-title-accent text-xl font-semibold text-foreground">6. Bildirimler ve arama</h2>
            <p className="text-muted-foreground">
              Sağ üstteki <strong>çan ikonu</strong> ile atanan görevler ve diğer bildirimlere bakabilirsiniz. <strong>Global arama</strong> (⌘K) ile güncelleme, görev, kontrol veya çerçeve arayıp ilgili sayfaya gidebilirsiniz. Dashboard'daki <strong>Son Aktiviteler</strong> bölümü ile son işlemleri takip edebilirsiniz.
            </p>
          </section>

          <section className="flex flex-wrap gap-4 border-t border-border/60 pt-10">
            <Button variant="outline" asChild>
              <Link href="/docs" className="gap-2">
                Dokümantasyon
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </section>
        </div>
      </div>
    </div>
  )
}
