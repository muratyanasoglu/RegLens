<p align="center">
  <strong>RegLens</strong>
</p>
<p align="center">
  <em>Kurumsal RegTech · Düzenleyici Değişiklikten Aksiyona Tek Platform</em>
</p>

<p align="center">
  <a href="#-kurulum">Kurulum</a> ·
  <a href="#-özellikler">Özellikler</a> ·
  <a href="#-ortam-değişkenleri">Ortam</a> ·
  <a href="#-api">API</a> ·
  <a href="#-dağıtım">Dağıtım</a> ·
  <a href="#-sss">SSS</a>
</p>

---

## 📖 İçindekiler

| Bölüm | Açıklama |
|-------|----------|
| [RegLens Nedir?](#-reglens-nedir) | Platform özeti ve değer önerisi |
| [Kurulum](#-kurulum) | Adım adım kurulum (npm / pnpm) |
| [Ortam Değişkenleri](#-ortam-değişkenleri) | Tüm `.env` değişkenleri ve açıklamaları |
| [NPM Scriptleri](#-npm-scriptleri) | Tüm komutlar ve kullanım |
| [Proje Yapısı](#-proje-yapısı) | Klasör ve modül organizasyonu |
| [Özellikler](#-özellikler) | Modüller ve yetenekler |
| [AI Entegrasyonu](#-ai-entegrasyonu-mistral) | Normalize, Map, Evidence |
| [API Dokümantasyonu](#-api-dokümantasyonu) | Endpoint’ler ve örnekler |
| [Güvenlik ve Uyumluluk](#-güvenlik-ve-uyumluluk) | Auth, şifreleme, standartlar |
| [Dağıtım](#-dağıtım) | Production build ve deploy |
| [SSS](#-sss) | Sık sorulan sorular |

---

## 🎯 RegLens Nedir?

**RegLens**, düzenleyici kaynakları izleyen, değişiklikleri tespit eden, kontrollere eşleyen ve denetim için kanıt üreten **kurumsal sınıf bir RegTech platformudur**. Tüm süreç tek bir arayüzde ve AI destekli iş akışlarıyla yönetilir.

| Sorun | RegLens ile Çözüm |
|-------|-------------------|
| Kaynakların manuel takibi | RSS/API kaynakları tek yerden izlenir, otomatik polling |
| Güncel olmayan kontroller ve kanıtlar | AI ile normalize, eşleme ve kanıt önerisi |
| Dağınık süreçler | Tek dashboard: metrikler, riskler, görevler, aktivite |

**Temel yetenekler:** Kaynak yönetimi · Değişiklik tespiti · Kontrol eşlemesi · Görev üretimi · Kanıt toplama · Denetim paketi dışa aktarma · PWA ve modern UI.

---

## 🚀 Kurulum

### Gereksinimler

| Gereksinim | Sürüm / Not |
|------------|-------------|
| **Node.js** | 18.x veya üzeri |
| **Paket yöneticisi** | npm 9+ veya pnpm 8+ |
| **Veritabanı** | MySQL 8.x (veya uyumlu) |
| **Mistral AI** | API anahtarı (opsiyonel; mock modunda çalışır) |

### Adım 1: Depoyu klonlayın ve bağımlılıkları yükleyin

```bash
git clone https://github.com/yourusername/reg-lens-mvp-build.git
cd reg-lens-mvp-build
```

**npm:**
```bash
npm install
```

**pnpm:**
```bash
pnpm install
```

### Adım 2: Ortam dosyasını oluşturun

```bash
cp .env.example .env.local
```

`.env.local` içinde aşağıdaki değişkenleri doldurun (detaylar için [Ortam Değişkenleri](#-ortam-değişkenleri) bölümüne bakın):

- `DATABASE_URL` — **Zorunlu.** MySQL bağlantı dizesi.
- `NEXTAUTH_SECRET` — **Zorunlu.** Oturum imzası için (örn. `openssl rand -hex 32`).
- `NEXTAUTH_URL` — Geliştirme için `http://localhost:3000`.
- `JWT_SECRET` — JWT token’lar için güçlü bir secret.
- `MISTRAL_API_KEY` — İsteğe bağlı; yoksa deterministik mock çıktı kullanılır.

### Adım 3: Veritabanını hazırlayın

**Mevcut migration’ları uygulayın:**
```bash
npm run db:migrate
# veya
pnpm db:migrate
```

**Alternatif: Şema ile doğrudan push (geliştirme):**
```bash
npm run db:push
```

**İsteğe bağlı: Seed verisi:**
```bash
npm run db:seed
```

### Adım 4: Geliştirme sunucusunu başlatın

```bash
npm run dev
# veya
pnpm dev
```

Tarayıcıda **http://localhost:3000** adresini açın. Kayıt olup giriş yaparak platformu kullanabilirsiniz.

---

## 🔧 Ortam Değişkenleri

Aşağıdaki değişkenler `.env.example` ile uyumludur. Production’da güçlü secret’lar ve gerçek servis URL’leri kullanın.

| Değişken | Zorunlu | Açıklama |
|----------|--------|----------|
| `DATABASE_URL` | Evet | MySQL bağlantı dizesi. Örnek: `mysql://user:password@127.0.0.1:3306/reglens?charset=utf8mb4` |
| `NEXTAUTH_SECRET` | Evet | NextAuth oturum imzası. Üretmek için: `openssl rand -hex 32` |
| `NEXTAUTH_URL` | Evet | Uygulama URL’i. Geliştirme: `http://localhost:3000` |
| `JWT_SECRET` | Evet | JWT token üretimi ve doğrulama için secret |
| `MISTRAL_API_KEY` | Hayır | Mistral AI API anahtarı. Boşsa mock cevaplar kullanılır |
| `MISTRAL_MODEL` | Hayır | Model adı (varsayılan: `mistral-small-latest`) |
| `MISTRAL_EMBED_MODEL` | Hayır | Embedding modeli (varsayılan: `mistral-embed`) |
| `CRON_SECRET` | Hayır | Cron endpoint’leri için güvenlik (örn. `/api/cron/poll-sources`) |
| `ENCRYPTION_KEY` | Hayır | Hassas alan şifrelemesi (production’da güçlü key kullanın) |
| `UPSTASH_REDIS_REST_URL` | Hayır | Upstash Redis REST URL (rate limit için) |
| `UPSTASH_REDIS_REST_TOKEN` | Hayır | Upstash Redis REST token |
| `SENDGRID_API_KEY` | Hayır | E-posta gönderimi (isteğe bağlı) |

Örnek **minimal** `.env.local` (geliştirme):

```env
DATABASE_URL="mysql://user:password@127.0.0.1:3306/reglens?charset=utf8mb4"
NEXTAUTH_SECRET="your-nextauth-secret-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"
JWT_SECRET="your-jwt-secret-min-32-chars"
```

---

## 📜 NPM Scriptleri

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusu (Turbo). Varsayılan: http://localhost:3000 |
| `npm run build` | Production build (Next.js + webpack) |
| `npm run start` | Production sunucusunu başlatır (`build` sonrası) |
| `npm run lint` | ESLint ile kod kontrolü |
| `npm run db:generate` | Prisma Client üretir |
| `npm run db:push` | Şemayı veritabanına push eder (migration dosyası oluşturmaz) |
| `npm run db:migrate` | Bekleyen migration’ları uygular |
| `npm run db:migrate:deploy` | Production ortamında migration’ları uygular |
| `npm run db:studio` | Prisma Studio arayüzünü açar |
| `npm run db:seed` | Seed script’ini çalıştırır (`prisma/seed.ts`) |

---

## 🏗️ Proje Yapısı

```
reg-lens-mvp-build/
├── app/
│   ├── (app)/                    # Oturum gerektiren sayfalar
│   │   ├── dashboard/            # Metrikler, grafikler, sürükle-bırak bölümler
│   │   ├── sources/              # Kaynak yönetimi (RSS, API)
│   │   ├── updates/              # Düzenleyici güncellemeler
│   │   ├── frameworks/           # Çerçeveler ve kontroller
│   │   ├── controls/             # Kontrol kütüphanesi
│   │   ├── tasks/                # Görevler
│   │   ├── evidence/             # Kanıt yönetimi
│   │   ├── audit-packs/          # Denetim paketleri (oluşturma, export)
│   │   ├── compliance/           # Uyumluluk görünümü
│   │   ├── integrations/         # Entegrasyonlar
│   │   ├── security/             # Güvenlik, audit log, kimlik doğrulama
│   │   ├── collaboration/        # İş birliği
│   │   ├── settings/             # Sistem ve AI ayarları
│   │   ├── ai-insights/          # AI önerileri
│   │   ├── analytics/            # Analitik
│   │   └── mobile/               # Mobil bilgi
│   ├── (auth)/                   # Giriş, kayıt, şifre sıfırlama
│   ├── api/                      # API route’ları
│   │   ├── ai/                   # normalize, map, evidence
│   │   ├── cron/                 # poll-sources
│   │   ├── auth/                 # NextAuth, register, forgot-password
│   │   ├── dashboard/            # Metrikler
│   │   └── ...                   # sources, updates, tasks, evidence, vb.
│   ├── docs/                     # Dokümantasyon sayfası
│   ├── guide/                    # Kılavuz
│   ├── globals.css               # Global stiller, tasarım sistemi
│   └── layout.tsx
├── components/
│   ├── dashboard/                # Dashboard bileşenleri, sürükle-bırak
│   ├── ui/                       # shadcn/ui bileşenleri
│   ├── landing-page.tsx
│   ├── page-header.tsx
│   ├── app-sidebar.tsx
│   └── chatbot.tsx
├── lib/
│   ├── auth.ts                   # JWT, hash, RBAC, audit
│   ├── auth-server.ts            # Sunucu tarafı oturum
│   ├── db-queries.ts             # Prisma sorguları
│   ├── mistral.ts                # Mistral AI entegrasyonu
│   ├── encryption.ts             # Şifreleme, pseudonymization
│   ├── rate-limit.ts             # Rate limit, brute-force koruması
│   ├── mapping-engine.ts         # Eşleme motoru
│   └── ...
├── prisma/
│   ├── schema.prisma             # Veritabanı şeması (MySQL)
│   ├── seed.ts                   # Seed script
│   └── migrations/
└── public/
```

---

## ✨ Özellikler

- **Dashboard:** Metrikler, grafikler, son güncellemeler, kritik görevler, aktivite akışı. Bölümler sürükle-bırak ile sıralanabilir; tercih `localStorage`’da saklanır.
- **Kaynaklar:** RSS ve API kaynakları ekleme/düzenleme, manuel/otomatik polling, sağlık göstergeleri.
- **Değişiklik tespiti:** Ham metinlerin AI ile yapılandırılması, risk seviyesi, kategori, etki alanı.
- **Kontroller ve eşleme:** Çerçeve kütüphanesi (SOC 2, ISO 27001, GDPR, HIPAA vb.), AI destekli eşleme, güven skoru.
- **Görevler:** Eşlemelerden otomatik görev, öncelik, atama, son tarih, kanıt bağlantısı.
- **Kanıt:** Şablonlar, görev/kontrol bağlantısı, durum (taslak, inceleme, onaylı).
- **Denetim paketleri:** Görev ve kanıtları paketleyip PDF, Excel, CSV export.
- **Ayarlar:** Veritabanı, AI provider (Mistral), cron aralığı, entegrasyonlar.
- **Güvenlik:** Kimlik doğrulama, denetim logları, şifre sıfırlama, güvenlik sorusu.
- **PWA:** Offline destek, kurulabilir uygulama.

---

## 🤖 AI Entegrasyonu (Mistral)

Mistral AI üç ana işlem için kullanılır:

1. **Normalize** — Ham düzenleyici metnini başlık, özet, kategori, risk seviyesi ve etki alanına dönüştürür.
2. **Map** — Değişiklikleri çerçeve kontrollerine eşler; güven skoru ve gerekçe üretir.
3. **Evidence** — Görev ve kontroller için kanıt şablonları ve metin önerileri üretir.

API anahtarı yoksa deterministik mock çıktılar kullanılır. Ayarlar sayfasından model ve embedding seçenekleri yapılandırılabilir.

---

## 📡 API Dokümantasyonu

### AI endpoint’leri

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/api/ai/normalize` | Ham metni yapılandırılmış forma normalize eder. Body: `{ "text": "..." }` |
| POST | `/api/ai/map` | Değişikliği kontrollere eşler. Body: `{ "changeId", "frameworkId" }` vb. |
| POST | `/api/ai/evidence` | Görev/kontrol için kanıt önerisi üretir. Body: `{ "taskId", "controlId" }` vb. |

### Arka plan işleri

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/cron/poll-sources` | Tüm aktif kaynakları tarar. Vercel Cron veya harici scheduler ile tetiklenir. İsteğe bağlı: `CRON_SECRET` header. |

Diğer REST endpoint’leri: `/api/sources`, `/api/updates`, `/api/tasks`, `/api/evidence`, `/api/frameworks`, `/api/controls`, `/api/audit-packs`, `/api/dashboard`, `/api/activity`, `/api/audit-logs` vb. İstek biçimleri ilgili route dosyalarından çıkarılabilir.

---

## 🔐 Güvenlik ve Uyumluluk

- **Kimlik doğrulama:** NextAuth (Credentials), JWT, oturum yönetimi.
- **Yetkilendirme:** Rol tabanlı erişim (RBAC), izin kontrolleri.
- **Veri:** Hassas alan şifreleme, pseudonymization, tokenization seçenekleri.
- **Ağ:** HTTPS, rate limiting (Upstash Redis isteğe bağlı), brute-force koruması.
- **Denetim:** Giriş, veri erişimi, export ve yapılandırma değişiklikleri için loglama.
- **Uyumluluk:** GDPR, SOC 2, HIPAA uyumlu mimari hedeflenir; veri saklama ve erişim politikalarına göre yapılandırılmalıdır.

---

## 📦 Dağıtım

### Production build

```bash
npm run build
npm run start
```

`build` çıktısı `.next` içinde üretilir. `start` ile production sunucusu başlatılır.

### Ortam ayarları (production)

- `NEXTAUTH_URL`: Canlı site URL’i (örn. `https://reglens.example.com`).
- `DATABASE_URL`: Production MySQL (veya uyumlu) bağlantısı.
- `NEXTAUTH_SECRET`, `JWT_SECRET`: Güçlü, rastgele secret’lar.
- İsteğe bağlı: `MISTRAL_API_KEY`, `ENCRYPTION_KEY`, `UPSTASH_*`, `CRON_SECRET`, `SENDGRID_API_KEY`.

### Vercel’e deploy

1. Repoyu GitHub’a push edin.
2. [Vercel](https://vercel.com/new) üzerinden projeyi import edin.
3. Environment variables’ı yukarıdaki listeye göre ekleyin.
4. Deploy’u tetikleyin; `build` komutu otomatik çalışır.
5. Cron için Vercel Cron Jobs veya harici bir scheduler ile `/api/cron/poll-sources` çağrılabilir.

---

## ❓ SSS

**RegLens’i kendi sunucumda çalıştırabilir miyim?**  
Evet. Kaynak kodu açıktır; lisans koşullarına uygun şekilde kendi ortamınızda kurup çalıştırabilirsiniz.

**Mistral API anahtarı zorunlu mu?**  
Hayır. Anahtar yoksa normalize, map ve evidence için mock çıktılar kullanılır.

**Hangi veritabanları destekleniyor?**  
Şema MySQL için tanımlıdır. Prisma ile PostgreSQL’e geçmek mümkündür; şema ve migration’lar buna göre uyarlanmalıdır.

**Dashboard’daki bölüm sırası nasıl saklanıyor?**  
Tarayıcı `localStorage`’da `reglens-dashboard-section-order` anahtarı ile saklanır; cihaz/browser bazlıdır.

**Verilerim güvende mi?**  
Kimlik doğrulama, HTTPS, isteğe bağlı alan şifreleme ve denetim logları ile güvenlik hedeflenir. Production’da güçlü secret’lar ve erişim politikaları kullanın.

---

## 📄 Lisans ve Destek

Bu proje MIT lisansı altında sunulabilir; detay için `LICENSE` dosyasına bakın.

- **Dokümantasyon:** Proje içi `/docs` ve `/guide` sayfaları.
- **Katkı:** Fork, feature branch, commit ve Pull Request adımlarıyla katkı kabul edilir.

---

**Son güncelleme:** Şubat 2026 · **Sürüm:** 1.0.0 · **Durum:** Production için hazır
