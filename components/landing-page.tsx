import Link from "next/link"
import {
  Eye,
  Rss,
  FileText,
  Shield,
  ListTodo,
  FileCheck,
  Archive,
  Sparkles,
  CheckCircle2,
  Github,
  ArrowRight,
  Target,
  Bot,
  Lock,
  HelpCircle,
  LayoutDashboard,
  BookOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    description:
      "Gerçek zamanlı uyumluluk metrikleri, risk dağılımı, görev durumu, son güncellemeler ve kritik görevler tek ekranda.",
  },
  {
    icon: Rss,
    title: "Kaynakları İzleyin",
    description:
      "RSS ve API kaynakları ekleyin; düzenleyici kurumları ve standartları tek yerden takip edin.",
  },
  {
    icon: FileText,
    title: "Değişiklikleri Tespit Edin",
    description:
      "AI ile metinleri yapılandırılmış forma dönüştürün; yeni, güncel ve kaldırılan maddeleri sınıflandırın.",
  },
  {
    icon: Shield,
    title: "Kontrollere Eşleyin",
    description:
      "SOC 2, ISO 27001, GDPR, HIPAA gibi çerçevelere otomatik kontrol eşlemesi; güven skoru ile.",
  },
  {
    icon: ListTodo,
    title: "Görevler Üretin",
    description:
      "Eşlemelerden otomatik görev oluşturun; öncelik, atama ve son tarih ile ekip yönetimi.",
  },
  {
    icon: FileCheck,
    title: "Kanıt Toplayın",
    description:
      "Denetim için kanıt şablonları oluşturun; görev ve kontrollere bağlayın, onay sürecini yönetin.",
  },
  {
    icon: Archive,
    title: "Denetim Paketleri",
    description:
      "Görev ve kanıtları tek pakette toplayın; PDF, Excel, CSV olarak dışa aktarın.",
  },
]

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="content-max flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-accent/50"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
              <Eye className="h-5 w-5 text-primary" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              RegLens
            </span>
          </Link>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" asChild size="sm">
              <Link href="/guide" className="gap-1.5">
                <BookOpen className="h-4 w-4" />
                Kılavuz
              </Link>
            </Button>
            <Button variant="ghost" asChild size="sm">
              <Link href="/docs" className="gap-1.5">
                <FileText className="h-4 w-4" />
                Dokümantasyon
              </Link>
            </Button>
            <ThemeToggle />
            <Button variant="ghost" asChild size="sm">
              <Link href="/login">Giriş Yap</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/register">Kayıt Ol</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero — elite, bold */}
        <section className="relative overflow-hidden border-b border-border/60 py-24 sm:py-32 lg:py-40 bg-hero-elite">
          <div className="content-max text-center relative z-10">
            <div className="mb-10 inline-flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/20 px-5 py-2 text-sm font-semibold text-primary shadow-card">
                <Sparkles className="h-4 w-4" />
                Açık Kaynak
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/50 bg-emerald-500/20 px-5 py-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 shadow-card">
                <CheckCircle2 className="h-4 w-4" />
                Ücretsiz
              </span>
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl xl:leading-[1.1]">
              Düzenleyici değişiklikleri
              <br />
              <span className="gradient-text block mt-1">eyleme dönüştürün</span>
            </h1>
            <p className="mx-auto mt-10 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl prose-read">
              RegLens, düzenleyici kaynakları izler, değişiklikleri tespit eder,
              kontrollere eşler ve denetim için kanıt üretir. Kurumsal RegTech
              ihtiyacınızı açık kaynak ve ücretsiz karşılayın.
            </p>
            <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild className="gap-2 text-base px-10 py-6 rounded-2xl shadow-card hover:shadow-glow transition-shadow">
                <Link href="/register">
                  Ücretsiz Başlayın
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-2xl border-2 px-8 py-6">
                <Link href="/login">Giriş Yap</Link>
              </Button>
            </div>
            <p className="mt-8 text-sm text-muted-foreground">
              Kayıt ve kullanım tamamen ücretsiz. Kendi sunucunuzda çalıştırabilirsiniz.
            </p>
          </div>
        </section>

        {/* Problem / Solution */}
        <section className="border-b border-border/60 py-16 sm:py-24">
          <div className="content-max">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Target className="h-6 w-6" />
              </div>
              <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Neden RegLens?
              </h2>
              <div className="mt-8 grid gap-8 text-left sm:grid-cols-2">
                <div className="card-premium card-hover p-6">
                  <h3 className="font-display font-semibold text-foreground text-lg">Sorun</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Uyumluluk ekipleri onlarca kaynağı manuel izlemek zorunda kalıyor;
                    kontroller ve kanıtlar güncel kalmıyor, süreçler dağınık.
                  </p>
                </div>
                <div className="card-premium card-hover p-6 border-primary/25 bg-primary/5">
                  <h3 className="font-display font-semibold text-foreground text-lg">Çözüm</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    RegLens, kaynak izlemeden denetim paketine kadar tüm değişiklik-eylem
                    sürecini otomatikleştirir; tek dashboard’da metrikler, riskler ve görevler.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 sm:py-24">
          <div className="content-max">
            <div className="text-center">
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Tek platformda uyumluluk
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Kaynak izlemeden denetim paketine kadar tüm süreç RegLens ile.
              </p>
            </div>
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div
                  key={f.title}
                  className={cn(
                    "group card-premium card-hover p-6"
                  )}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/25 transition-all duration-300 group-hover:bg-primary/25 group-hover:ring-primary/40 group-hover:scale-105">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                    {f.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground prose-read">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI-Powered */}
        <section className="border-y border-border/60 bg-muted/40 py-16 sm:py-24">
          <div className="content-max">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Bot className="h-6 w-6" />
              </div>
              <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                AI ile güçlü
              </h2>
              <p className="mt-3 text-muted-foreground">
                Mistral AI entegrasyonu ile metinleri yapılandırın, kontrollere eşleyin ve kanıt önerileri alın.
              </p>
            </div>
            <div className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-3">
              <div className="card-premium card-hover p-6 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">Normalize</span>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Ham düzenleyici metinleri başlık, özet, kategori ve etki alanına dönüştürün.
                </p>
              </div>
              <div className="card-premium card-hover p-6 text-center border-primary/20">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">Eşle</span>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Değişiklikleri çerçeve kontrollerine otomatik eşleyin; güven skoru ve gerekçe ile.
                </p>
              </div>
              <div className="card-premium card-hover p-6 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">Kanıt üret</span>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Görev ve kontroller için kanıt şablonları ve metin önerileri oluşturun.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Open Source */}
        <section className="border-b border-border/60 bg-muted/40 py-16 sm:py-24">
          <div className="content-max">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/20">
                <Github className="h-7 w-7" />
              </div>
              <h2 className="mt-6 font-display text-3xl font-bold tracking-tight text-foreground">
                Açık kaynak ve ücretsiz
              </h2>
              <p className="mt-4 text-muted-foreground">
                RegLens tamamen açık kaynaklıdır. Lisans kısıtı olmadan
                kullanabilir, kendi ortamınızda çalıştırabilir ve ihtiyacınıza
                göre uyarlayabilirsiniz. Topluluk katkılarına açığız.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/register">Hemen Başlayın</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/login">Zaten hesabınız var mı? Giriş yapın</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Security & Compliance */}
        <section className="py-16 sm:py-24">
          <div className="content-max">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Lock className="h-6 w-6" />
              </div>
              <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Güvenlik ve uyumluluk
              </h2>
              <p className="mt-3 text-muted-foreground">
                Kimlik doğrulama, şifreli veri, denetim kayıtları ve endüstri standartlarına uyum.
              </p>
            </div>
            <div className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-4 text-sm">
              <span className="rounded-full border border-border/80 bg-card px-4 py-2.5 text-muted-foreground shadow-sm transition-colors hover:border-primary/30 hover:text-foreground">
                Kimlik doğrulama (Auth)
              </span>
              <span className="rounded-full border border-border/80 bg-card px-4 py-2.5 text-muted-foreground shadow-sm transition-colors hover:border-primary/30 hover:text-foreground">
                HTTPS
              </span>
              <span className="rounded-full border border-border/80 bg-card px-4 py-2.5 text-muted-foreground shadow-sm transition-colors hover:border-primary/30 hover:text-foreground">
                Veri şifreleme
              </span>
              <span className="rounded-full border border-border/80 bg-card px-4 py-2.5 text-muted-foreground shadow-sm transition-colors hover:border-primary/30 hover:text-foreground">
                Denetim kayıtları
              </span>
              <span className="rounded-full border border-border/80 bg-card px-4 py-2.5 text-muted-foreground shadow-sm transition-colors hover:border-primary/30 hover:text-foreground">
                GDPR uyumlu
              </span>
              <span className="rounded-full border border-border/80 bg-card px-4 py-2.5 text-muted-foreground shadow-sm transition-colors hover:border-primary/30 hover:text-foreground">
                SOC 2 / HIPAA hazır
              </span>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-y border-border/60 bg-muted/30 py-16 sm:py-24">
          <div className="content-max">
            <div className="mx-auto max-w-2xl text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <HelpCircle className="h-6 w-6" />
              </div>
              <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Sıkça sorulan sorular
              </h2>
            </div>
            <Accordion type="single" collapsible className="mx-auto mt-10 max-w-2xl">
              <AccordionItem value="free">
                <AccordionTrigger>RegLens tamamen ücretsiz mi?</AccordionTrigger>
                <AccordionContent>
                  Evet. RegLens açık kaynaklıdır ve kullanım tamamen ücretsizdir. Kendi sunucunuzda kurup çalıştırabilir, lisans kısıtı olmadan kullanabilirsiniz.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="data">
                <AccordionTrigger>Verilerim güvende mi?</AccordionTrigger>
                <AccordionContent>
                  Kimlik doğrulama, HTTPS, veri şifreleme ve denetim kayıtları ile verileriniz güvende. GDPR ve SOC 2 / HIPAA uyumlu bir mimari hedeflenir.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="export">
                <AccordionTrigger>Verilerimi dışa aktarabilir miyim?</AccordionTrigger>
                <AccordionContent>
                  Evet. Denetim paketlerini PDF, Excel ve CSV olarak dışa aktarabilirsiniz. Tüm verilerinize standart formatlarda erişebilirsiniz.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="language">
                <AccordionTrigger>Hangi diller destekleniyor?</AccordionTrigger>
                <AccordionContent>
                  Arayüz Türkçe ve İngilizce kullanılabilir. Düzenleyici metinler kaynak dilinde işlenir; AI ile normalize ve eşleme yapılır.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 sm:py-24">
          <div className="content-max text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Uyumluluk yönetimini sadeleştirin
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              RegLens ile kaynakları izleyin, değişiklikleri eşleyin, görevleri
              yönetin ve denetim kanıtlarını tek yerden üretin.
            </p>
            <Button size="lg" className="mt-8 gap-2" asChild>
              <Link href="/register">
                Ücretsiz Kayıt Ol
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-muted/30 py-8">
        <div className="content-max flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">RegLens</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <Link href="/guide" className="hover:text-foreground hover:underline">
              Kılavuz
            </Link>
            <Link href="/docs" className="hover:text-foreground hover:underline">
              Dokümantasyon
            </Link>
            <Link href="/login" className="hover:text-foreground hover:underline">
              Giriş Yap
            </Link>
            <Link href="/register" className="hover:text-foreground hover:underline">
              Kayıt Ol
            </Link>
            <span className="hidden sm:inline">·</span>
            <span>MIT Lisansı</span>
          </div>
        </div>
        <div className="content-max mt-4 text-center text-xs text-muted-foreground sm:text-left">
          Açık kaynak · Ücretsiz kullanım · Continuous Regulatory Change-to-Action
        </div>
        <div className="content-max mt-2 text-center text-xs text-muted-foreground sm:text-left">
          Destek ve katkı için GitHub Issues veya topluluk kanallarını kullanabilirsiniz.
        </div>
      </footer>
    </div>
  )
}
