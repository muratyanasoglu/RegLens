import Link from "next/link"
import { FileText, ArrowRight } from "lucide-react"
import { TranslatedPageHeader } from "@/components/translated-page-header"
import { MermaidDiagram } from "@/components/mermaid-diagram"
import { Button } from "@/components/ui/button"

const architectureDiagram = `
flowchart TB
  subgraph Client
    UI[React / Next.js UI]
  end
  subgraph Server
    API[API Routes]
    Auth[Auth / Session]
  end
  subgraph Data
    DB[(MySQL / Prisma)]
  end
  subgraph External
    Mistral[Mistral AI]
  end
  UI --> API
  API --> Auth
  API --> DB
  API --> Mistral
`

const dataFlowDiagram = `
flowchart LR
  subgraph Girdi
    S[Source]
    S --> U[RegulatoryUpdate]
  end
  subgraph Çerçeve
    F[Framework]
    F --> C[Control]
  end
  U --> M[Mapping]
  C --> M
  M --> T[Task]
  T --> E[EvidenceItem]
  T --> AP[AuditPack]
  E --> AP
`

const erDiagram = `
erDiagram
  Organization ||--o{ User : has
  Organization ||--o{ Source : has
  Organization ||--o{ Task : has
  Organization ||--o{ AuditPack : has
  Organization ||--o{ AuditLog : has
  User ||--o{ Notification : receives
  User ||--o{ Task : assigned
  Source ||--o{ RegulatoryUpdate : produces
  RegulatoryUpdate ||--o{ Mapping : has
  Control ||--o{ Mapping : has
  Framework ||--o{ Control : contains
  Mapping ||--o{ Task : generates
  Task ||--o{ EvidenceItem : has
  Task }o--o{ AuditPack : included
  EvidenceItem }o--o{ AuditPack : included
  Organization {
    string id
    string name
    string slug
  }
  User {
    string id
    string email
    string username
  }
  Source {
    string id
    string name
    string url
    string type
  }
  RegulatoryUpdate {
    string id
    string title
    string riskLevel
    string status
  }
  Framework {
    string id
    string name
    string version
  }
  Control {
    string id
    string controlRef
    string title
  }
  Mapping {
    string id
    string confidence
  }
  Task {
    string id
    string title
    string status
    string priority
  }
  EvidenceItem {
    string id
    string title
    string status
  }
  AuditPack {
    string id
    string title
    string exportFormat
  }
`

const apiFlowDiagram = `
sequenceDiagram
  participant U as Kullanıcı
  participant API as API Routes
  participant DB as Veritabanı
  participant AI as Mistral AI
  U->>API: İstek (auth cookie)
  API->>API: Oturum kontrolü
  alt Yetkili
    API->>DB: Sorgu
    DB-->>API: Veri
    alt AI gerekli
      API->>AI: Normalize / Map / Evidence
      AI-->>API: Sonuç
    end
    API-->>U: JSON yanıt
  else Yetkisiz
    API-->>U: 401
  end
`

const deploymentDiagram = `
flowchart LR
  subgraph Geliştirici
    Git[Git push]
    Env[Env değişkenleri]
  end
  subgraph Hosting
    Vercel[Vercel / Node]
  end
  subgraph Veritabanı
    MySQL[(MySQL)]
  end
  subgraph Harici
    Mistral[Mistral API]
  end
  Git --> Vercel
  Env --> Vercel
  Vercel --> MySQL
  Vercel --> Mistral
`

const featureModulesDiagram = `
flowchart TB
  subgraph Uygulama Modülleri
    A[Dashboard]
    B[Sources]
    C[Updates]
    D[Controls]
    E[Tasks]
    F[Evidence]
    G[Audit Packs]
    H[Frameworks]
    I[Compliance]
    J[Security]
    K[Settings]
  end
  subgraph API Katmanı
    L["/api/dashboard"]
    M["/api/sources"]
    N["/api/updates"]
    O["/api/controls"]
    P["/api/tasks"]
    Q["/api/evidence"]
    R["/api/audit-packs"]
    S["/api/ai/*"]
  end
  A --> L
  B --> M
  C --> N
  D --> O
  E --> P
  F --> Q
  G --> R
  N --> S
  O --> S
  P --> S
`

export default function DocsPage() {
  return (
    <div className="flex flex-col">
      <TranslatedPageHeader
        titleKey="docs.pageTitle"
        descriptionKey="docs.pageDescription"
      />
      <div className="content-max py-6 lg:py-8">
        <div className="mx-auto max-w-3xl space-y-12">

          <section className="space-y-4">
            <h2 className="section-title-accent text-xl font-semibold text-foreground">1. Proje özeti</h2>
            <p className="text-muted-foreground">
              RegLens, düzenleyici kaynakları izleyen, değişiklikleri tespit eden, kontrollere eşleyen ve görev/kanıt üreten bir <strong>RegTech</strong> platformudur. Açık kaynak ve ücretsizdir; Next.js, Prisma ve Mistral AI ile geliştirilmiştir.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="section-title-accent text-xl font-semibold text-foreground">2. Mimari</h2>
            <p className="text-muted-foreground">
              Tek sayfa uygulaması (SPA) tarafında React 19 ve Next.js 16 App Router kullanılır. API istekleri Next.js API Routes üzerinden gider; kimlik doğrulama Auth.js (NextAuth) ile yapılır. Veriler MySQL veritabanında Prisma ORM ile yönetilir. AI işlemleri (normalize, map, evidence) Mistral API ile çalışır.
            </p>
            <MermaidDiagram
              code={architectureDiagram}
              title="Yüksek seviye mimari"
            />
          </section>

          <section className="space-y-4">
            <h2 className="section-title-accent text-xl font-semibold text-foreground">3. Teknoloji yığını</h2>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              <li><strong>Frontend:</strong> React 19, Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Recharts</li>
              <li><strong>Backend:</strong> Next.js API Routes, Auth.js (NextAuth)</li>
              <li><strong>Veritabanı:</strong> MySQL, Prisma ORM</li>
              <li><strong>AI:</strong> Mistral AI (normalize, map, evidence)</li>
              <li><strong>PWA:</strong> next-pwa (opsiyonel)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="section-title-accent text-xl font-semibold text-foreground">4. Veri modeli (kavramsal)</h2>
            <p className="text-muted-foreground">
              <strong>Organization</strong> altında kullanıcılar ve kaynaklar yer alır. <strong>Source</strong> (RSS/API) düzenleyici içerikleri çeker; <strong>RegulatoryUpdate</strong> olarak saklanır. <strong>Framework</strong> ve <strong>Control</strong> çerçeve tanımlarıdır. <strong>Mapping</strong>, güncellemeyi kontrole bağlar. <strong>Task</strong> eşlemeden üretilir; <strong>EvidenceItem</strong> kanıtları görevlere bağlıdır. <strong>AuditPack</strong> görev ve kanıtları paketleyip dışa aktarır.
            </p>
            <MermaidDiagram
              code={dataFlowDiagram}
              title="Ana varlıklar ve ilişkiler (akış)"
            />
            <MermaidDiagram
              code={erDiagram}
              title="Veritabanı ilişki diyagramı (sadeleştirilmiş)"
            />
          </section>

          <section className="space-y-4">
            <h2 className="section-title-accent text-xl font-semibold text-foreground">5. Uygulama ve API modülleri</h2>
            <p className="text-muted-foreground">
              Her sayfa ilgili API route'larına bağlıdır. AI endpoint'leri (/api/ai/normalize, map, evidence) Mistral ile çalışır. Cron ile /api/cron/poll-sources kaynakları periyodik tarayabilir.
            </p>
            <MermaidDiagram
              code={featureModulesDiagram}
              title="Sayfalar ve API eşlemesi"
            />
          </section>

          <section className="space-y-4">
            <h2 className="section-title-accent text-xl font-semibold text-foreground">6. API istek akışı</h2>
            <p className="text-muted-foreground">
              Her istekte oturum kontrolü yapılır; yetkili kullanıcılar için veritabanı ve gerekirse Mistral AI çağrılır. Yetkisiz isteklerde 401 dönülür.
            </p>
            <MermaidDiagram
              code={apiFlowDiagram}
              title="Örnek API istek sırası"
            />
          </section>

          <section className="space-y-4">
            <h2 className="section-title-accent text-xl font-semibold text-foreground">7. Dağıtım</h2>
            <p className="text-muted-foreground">
              Proje Vercel veya benzeri bir Node.js ortamında çalıştırılabilir. <code className="rounded bg-muted px-1.5 py-0.5 text-sm">DATABASE_URL</code>, <code className="rounded bg-muted px-1.5 py-0.5 text-sm">NEXTAUTH_SECRET</code>, <code className="rounded bg-muted px-1.5 py-0.5 text-sm">NEXTAUTH_URL</code> ve isteğe bağlı <code className="rounded bg-muted px-1.5 py-0.5 text-sm">MISTRAL_API_KEY</code> ortam değişkenleri tanımlanmalıdır. Migrations ile veritabanı şeması uygulanır.
            </p>
            <MermaidDiagram
              code={deploymentDiagram}
              title="Dağıtım bileşenleri"
            />
          </section>

          <section className="space-y-4">
            <h2 className="section-title-accent text-xl font-semibold text-foreground">8. Güvenlik ve uyumluluk</h2>
            <p className="text-muted-foreground">
              Kimlik doğrulama (Auth.js), HTTPS, hassas verilerin şifrelenmesi ve denetim kayıtları (AuditLog) kullanılır. Organizasyon bazlı veri izolasyonu vardır. GDPR ve SOC 2 / HIPAA uyumlu bir mimari hedeflenir.
            </p>
          </section>

          <section className="flex flex-wrap gap-4 border-t border-border/60 pt-10">
            <Button variant="outline" asChild>
              <Link href="/guide" className="gap-2">
                Kullanım kılavuzu
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </section>
        </div>
      </div>
    </div>
  )
}
