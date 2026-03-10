"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { TranslatedPageHeader } from "@/components/translated-page-header"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConfidenceBadge } from "@/components/risk-badge"
import { Search, Shield, Link2, Loader2 } from "lucide-react"

type Control = {
  id: string
  frameworkId: string
  frameworkName: string
  controlRef: string
  title: string
  description: string
  category: string
}

type Framework = {
  id: string
  name: string
  description: string
  controls: { id: string }[]
}

type Mapping = {
  id: string
  controlId: string
  update: { title: string }
  control: { controlRef: string; framework: { name: string } }
}

export default function ControlsPage() {
  const { data: session } = useSession()
  const organizationId = (session?.user as { organizationId?: string } | undefined)?.organizationId
  const [controls, setControls] = useState<Control[]>([])
  const [frameworks, setFrameworks] = useState<Framework[]>([])
  const [mappings, setMappings] = useState<Mapping[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [frameworkFilter, setFrameworkFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  useEffect(() => {
    if (!organizationId) return
    setLoading(true)
    Promise.all([
      fetch("/api/controls").then((r) => (r.ok ? r.json() : [])),
      fetch("/api/frameworks").then((r) => (r.ok ? r.json() : [])),
      fetch("/api/mappings").then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([controlsData, frameworksData, mappingsData]) => {
        setControls(Array.isArray(controlsData) ? controlsData : [])
        setFrameworks(Array.isArray(frameworksData) ? frameworksData : [])
        setMappings(Array.isArray(mappingsData) ? mappingsData : [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [organizationId])

  const categories = Array.from(new Set(controls.map((c) => c.category)))

  const filteredControls = controls.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.controlRef.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
    const matchesFramework = frameworkFilter === "all" || c.frameworkId === frameworkFilter
    const matchesCategory = categoryFilter === "all" || c.category === categoryFilter
    return matchesSearch && matchesFramework && matchesCategory
  })

  function getMappingCount(controlId: string) {
    return mappings.filter((m) => m.controlId === controlId).length
  }

  if (loading) {
    return (
      <div className="flex flex-col">
        <TranslatedPageHeader titleKey="controls.title" descriptionKey="controls.description" />
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
<TranslatedPageHeader
        titleKey="controls.title"
        descriptionKey="controls.description"
      />

      <div className="content-max flex flex-col gap-8 py-6 lg:py-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {frameworks.map((fw) => {
            const fwControls = controls.filter((c) => c.frameworkId === fw.id)
            const fwMappings = mappings.filter((m) => fwControls.some((c) => c.id === m.controlId))
            return (
              <Card key={fw.id} className="card-premium card-hover">
                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-sm font-medium text-card-foreground">
                    {fw.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2 text-xs text-muted-foreground">{fw.description}</p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground">{fwControls.length} controls</span>
                    <span className="text-muted-foreground">{fwMappings.length} mappings</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Tabs defaultValue="controls">
          <TabsList>
            <TabsTrigger value="controls">Controls</TabsTrigger>
            <TabsTrigger value="mappings">All Mappings</TabsTrigger>
          </TabsList>

          <TabsContent value="controls" className="mt-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative min-w-[200px] flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search controls..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={frameworkFilter} onValueChange={setFrameworkFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Framework" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Frameworks</SelectItem>
                    {frameworks.map((fw) => (
                      <SelectItem key={fw.id} value={fw.id}>
                        {fw.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="card-premium overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Control</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Framework</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Mappings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredControls.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-mono text-xs text-primary">
                          {c.controlRef}
                        </TableCell>
                        <TableCell className="font-medium text-card-foreground">
                          {c.title}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {c.frameworkName}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-transparent">
                            {c.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {getMappingCount(c.id)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredControls.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                          No controls match. Run db:seed to load frameworks and controls.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mappings" className="mt-4">
<div className="card-premium overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card">
            <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Update</TableHead>
                    <TableHead>Control</TableHead>
                    <TableHead>Framework</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mappings.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="font-medium text-card-foreground">
                        {m.update?.title ?? "—"}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-primary">
                        {m.control?.controlRef ?? "—"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {m.control?.framework?.name ?? "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                  {mappings.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                        No mappings yet. Map updates to controls via AI or manually.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
