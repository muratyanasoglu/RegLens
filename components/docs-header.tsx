import Link from "next/link"
import { Eye, BookOpen, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function DocsHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="content-max flex h-14 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-accent/50"
        >
          <Eye className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground">RegLens</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/guide" className="gap-1.5">
              <BookOpen className="h-4 w-4" />
              Kılavuz
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/docs" className="gap-1.5">
              <FileText className="h-4 w-4" />
              Dokümantasyon
            </Link>
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Giriş</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/register">Kayıt</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
