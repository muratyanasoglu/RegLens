"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { TranslatedPageHeader } from "@/components/translated-page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

type Framework = { id: string; name: string; controls: { id: string }[] }
type Mapping = { id: string; controlId: string; control: { frameworkId: string } }

export default function CompliancePage() {
  const { data: session } = useSession()
  const organizationId = (session?.user as { organizationId?: string } | undefined)?.organizationId
  const [frameworks, setFrameworks] = useState<Framework[]>([])
  const [mappings, setMappings] = useState<Mapping[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!organizationId) return
    setLoading(true)
    Promise.all([
      fetch("/api/frameworks").then((r) => (r.ok ? r.json() : [])),
      fetch("/api/mappings").then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([fwData, mapData]) => {
        setFrameworks(Array.isArray(fwData) ? fwData : [])
        setMappings(Array.isArray(mapData) ? mapData : [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [organizationId])

  const frameworkStats = frameworks.map((fw) => {
    const controlCount = fw.controls?.length ?? 0
    const implemented = mappings.filter((m) => m.control?.frameworkId === fw.id).length
    const coverage = controlCount > 0 ? Math.round((implemented / controlCount) * 100) : 0
    return {
      id: fw.id,
      name: fw.name,
      controls: controlCount,
      implemented,
      coverage,
    }
  })

  const totalFrameworks = frameworks.length
  const avgCoverage =
    frameworkStats.length > 0
      ? Math.round(
          frameworkStats.reduce((a, b) => a + b.coverage, 0) / frameworkStats.length
        )
      : 0
  const totalControls = frameworkStats.reduce((a, b) => a + b.controls, 0)
  const totalImplemented = frameworkStats.reduce((a, b) => a + b.implemented, 0)
  const gaps = totalControls - totalImplemented

  if (loading) {
    return (
      <>
        <TranslatedPageHeader titleKey="compliance.title" descriptionKey="compliance.description" />
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </>
    )
  }

  return (
    <>
      <TranslatedPageHeader
        titleKey="compliance.title"
        descriptionKey="compliance.description"
      />

      <div className="content-max py-6 lg:py-8">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
          <TabsTrigger value="mappings">Mappings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="card-premium card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Frameworks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalFrameworks}</div>
                <p className="mt-1 text-sm text-muted-foreground">From database</p>
              </CardContent>
            </Card>
            <Card className="card-premium card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Avg Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{avgCoverage}%</div>
                <p className="mt-1 text-sm text-muted-foreground">Across all frameworks</p>
              </CardContent>
            </Card>
            <Card className="card-premium card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Mapped Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {totalImplemented}/{totalControls}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {gaps} controls not yet mapped
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="frameworks" className="space-y-4">
          <div className="space-y-3">
            {frameworkStats.length === 0 ? (
              <Card className="card-premium">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">
                    No frameworks. Run npm run db:seed to load frameworks and controls.
                  </p>
                </CardContent>
              </Card>
            ) : (
              frameworkStats.map((fw) => (
                <Card key={fw.id} className="card-premium card-hover">
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Link href={`/frameworks/${fw.id}`} className="font-semibold hover:underline">
                          {fw.name}
                        </Link>
                        <Badge variant={fw.coverage >= 80 ? "default" : "secondary"}>
                          {fw.coverage}% Mapped
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {fw.implemented} of {fw.controls} controls have mappings
                      </p>
                      <div className="mt-2 h-2 rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${Math.min(fw.coverage, 100)}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="mappings" className="space-y-4">
          <Card className="card-premium card-hover">
            <CardHeader>
              <CardTitle>Organization Mappings</CardTitle>
              <CardDescription>
                Update-to-control mappings (from regulatory updates)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mappings.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No mappings yet. Map regulatory updates to controls in Updates or Controls.
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {mappings.length} total mapping(s) in your organization.
                  </p>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/controls">View Controls & Mappings</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </>
  )
}
