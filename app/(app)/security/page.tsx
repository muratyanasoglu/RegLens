"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Lock, Shield, Users, Loader2 } from "lucide-react"

type Certification = {
  id: string
  type: string
  status: string
  expiryDate: string | null
  certificationDate: string | null
}

type SecurityPolicy = {
  id: string
  name: string
  description: string
  policyType: string
  isActive: boolean
}

export default function SecurityPage() {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [policies, setPolicies] = useState<SecurityPolicy[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/security/certifications").then((r) => (r.ok ? r.json() : [])),
      fetch("/api/security/policies").then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([certs, pols]) => {
        setCertifications(Array.isArray(certs) ? certs : [])
        setPolicies(Array.isArray(pols) ? pols : [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const securityMetrics = [
    { label: "Certifications", value: `${certifications.length}`, icon: Shield },
    { label: "Security Policies", value: `${policies.length}`, icon: Lock },
    { label: "Active Policies", value: `${policies.filter((p) => p.isActive).length}`, icon: CheckCircle2 },
    { label: "Auth", value: "Credentials", icon: Users },
  ]

  if (loading) {
    return (
      <>
        <PageHeader title="Security & Compliance" description="Enterprise security" />
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader title="Security & Compliance" description="Certifications and policies from database" />

      <div className="content-max space-y-8 py-6 lg:py-8">
      <div className="grid gap-4 md:grid-cols-4">
        {securityMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <metric.icon className="h-8 w-8 opacity-50 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="certifications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="data-residency">Data Residency</TabsTrigger>
          <TabsTrigger value="policies">Security Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="certifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Certifications</CardTitle>
              <CardDescription>From your organization</CardDescription>
            </CardHeader>
            <CardContent>
              {certifications.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No certifications in database. Add via admin or seed.
                </p>
              ) : (
                <div className="space-y-3">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium">{cert.type}</p>
                        {cert.expiryDate && (
                          <p className="text-sm text-muted-foreground">
                            Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Badge variant={cert.status === "certified" ? "default" : "secondary"}>
                        {cert.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data-residency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Residency & Encryption</CardTitle>
              <CardDescription>Configure in organization settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                  Data residency and encryption are configured at the organization level in the database.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Policies</CardTitle>
              <CardDescription>From your organization</CardDescription>
            </CardHeader>
            <CardContent>
              {policies.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No security policies in database.
                </p>
              ) : (
                <div className="space-y-3">
                  {policies.map((pol) => (
                    <div key={pol.id} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{pol.name}</p>
                        <Badge variant={pol.isActive ? "default" : "outline"}>
                          {pol.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{pol.description}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{pol.policyType}</p>
                    </div>
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
