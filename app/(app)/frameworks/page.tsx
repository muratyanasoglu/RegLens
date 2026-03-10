"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { TranslatedPageHeader } from "@/components/translated-page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BarChart3, Search, Loader2 } from "lucide-react"
import Link from "next/link"

type Framework = {
  id: string
  name: string
  version: string
  description: string
  frameworkType: string
  region: string
  controls: { id: string }[]
}

export default function FrameworksPage() {
  const { data: session } = useSession()
  const organizationId = (session?.user as { organizationId?: string } | undefined)?.organizationId
  const [frameworks, setFrameworks] = useState<Framework[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (!organizationId) return
    setLoading(true)
    fetch("/api/frameworks")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setFrameworks(Array.isArray(data) ? data : []))
      .catch(() => setFrameworks([]))
      .finally(() => setLoading(false))
  }, [organizationId])

  const filtered = frameworks.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      (f.description ?? "").toLowerCase().includes(search.toLowerCase())
  )

  const getTypeColor = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    const colors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      standard: "default",
      regulation: "destructive",
      industry: "secondary",
      custom: "outline",
    }
    return colors[type] ?? "default"
  }

  const getRegionBadge = (region: string) => {
    const regionMap: Record<string, string> = {
      global: "Global",
      US: "USA",
      EU: "Europe",
      "US-CA": "California",
      Germany: "Germany",
    }
    return regionMap[region] ?? region
  }

  if (loading) {
    return (
      <>
        <TranslatedPageHeader titleKey="frameworks.title" descriptionKey="frameworks.description" />
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </>
    )
  }

  return (
    <>
      <TranslatedPageHeader
        titleKey="frameworks.title"
        descriptionKey="frameworks.description"
      />

      <div className="content-max space-y-6 py-6 lg:py-8">
        <div className="flex gap-2">
          <Input
            placeholder="Search frameworks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Button variant="secondary">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((framework) => (
            <Link key={framework.id} href={`/frameworks/${framework.id}`}>
              <Card className="card-premium card-hover h-full cursor-pointer transition-all hover:border-primary/30">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{framework.name}</CardTitle>
                      <CardDescription className="mt-1 text-xs">
                        v{framework.version}
                      </CardDescription>
                    </div>
                    <Badge variant={getTypeColor(framework.frameworkType)}>
                      {framework.frameworkType}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{framework.description}</p>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {getRegionBadge(framework.region)}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {(framework.controls?.length ?? 0)} Controls
                    </Badge>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      Map
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <Card className="card-premium">
            <CardContent className="pt-6 text-center">
              <BarChart3 className="mx-auto mb-2 h-12 w-12 opacity-50 text-muted-foreground" />
              <p className="text-muted-foreground">
                {frameworks.length === 0
                  ? "No frameworks in database. Run npm run db:seed to load frameworks and controls."
                  : "No frameworks found matching your search"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}
