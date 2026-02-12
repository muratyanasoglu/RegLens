"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Loader2 } from "lucide-react"

type Control = {
  id: string
  controlRef: string
  title: string
  description: string
  category: string
}

type Framework = {
  id: string
  name: string
  version: string
  description: string
  frameworkType: string
  region: string
  controls: Control[]
}

export default function FrameworkDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const [framework, setFramework] = useState<Framework | null>(null)
  const [otherFrameworks, setOtherFrameworks] = useState<Framework[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([
      fetch(`/api/frameworks/${id}`).then((r) => (r.ok ? r.json() : null)),
      fetch("/api/frameworks").then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([fw, list]) => {
        setFramework(fw)
        setOtherFrameworks(Array.isArray(list) ? list.filter((f: Framework) => f.id !== id) : [])
      })
      .catch(() => setFramework(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <>
        <PageHeader title="Framework" />
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </>
    )
  }

  if (!framework) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-lg font-semibold">Framework not found</h1>
        <Link href="/frameworks" className="mt-2 inline-flex items-center text-sm text-primary hover:underline">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Frameworks
        </Link>
      </div>
    )
  }

  const controlCount = framework.controls?.length ?? 0
  const categories = Array.from(new Set((framework.controls ?? []).map((c) => c.category).filter(Boolean)))

  return (
    <>
      <PageHeader title={framework.name} description={framework.description}>
        <Button variant="outline" size="sm" asChild>
          <Link href="/frameworks">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Link>
        </Button>
      </PageHeader>

      <div className="content-max space-y-8 py-6 lg:py-8">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-premium">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Version</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{framework.version}</p>
          </CardContent>
        </Card>
        <Card className="card-premium">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{controlCount}</p>
          </CardContent>
        </Card>
        <Card className="card-premium">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Scope</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge>{framework.region}</Badge>
          </CardContent>
        </Card>
        <Card className="card-premium">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline">{framework.frameworkType}</Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
          <TabsTrigger value="related">Related Frameworks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="card-premium">
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Control categories in this framework</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <Badge key={cat} variant="outline">
                      {cat}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No categories</p>
                )}
              </div>
            </CardContent>
          </Card>

          {otherFrameworks.length > 0 && (
            <Card className="card-premium">
              <CardHeader>
                <CardTitle>Other Frameworks</CardTitle>
                <CardDescription>Other frameworks in the database</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {otherFrameworks.slice(0, 5).map((rf) => (
                    <Link key={rf.id} href={`/frameworks/${rf.id}`}>
                      <div className="rounded-lg border p-3 transition-colors hover:border-primary">
                        <p className="font-medium">{rf.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(rf.controls?.length ?? 0)} controls
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="controls" className="space-y-4">
          <Card className="card-premium">
            <CardHeader>
              <CardTitle>Controls</CardTitle>
              <CardDescription>{framework.name} controls from database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(framework.controls ?? []).length === 0 ? (
                  <p className="text-sm text-muted-foreground">No controls for this framework.</p>
                ) : (
                  (framework.controls ?? []).map((control) => (
                    <div key={control.id} className="space-y-2 rounded-lg border p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-mono text-sm font-medium text-primary">
                            {control.controlRef}
                          </p>
                          <p className="mt-1 font-medium text-sm">{control.title}</p>
                        </div>
                        <Badge variant="outline">{control.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{control.description}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="related" className="space-y-4">
          <Card className="card-premium">
            <CardHeader>
              <CardTitle>Related Frameworks</CardTitle>
              <CardDescription>Other frameworks you can map to</CardDescription>
            </CardHeader>
            <CardContent>
              {otherFrameworks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No other frameworks in database.</p>
              ) : (
                <div className="space-y-2">
                  {otherFrameworks.map((rf) => (
                    <Link key={rf.id} href={`/frameworks/${rf.id}`}>
                      <div className="rounded-lg border p-3 transition-colors hover:border-primary">
                        <p className="font-medium">{rf.name}</p>
                        <p className="text-sm text-muted-foreground">
                          v{rf.version} · {(rf.controls?.length ?? 0)} controls
                        </p>
                      </div>
                    </Link>
                  ))}
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
