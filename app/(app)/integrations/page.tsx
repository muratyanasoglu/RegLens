'use client'

import { TranslatedPageHeader } from "@/components/translated-page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { AlertCircle, CheckCircle2, RefreshCw, Plus } from 'lucide-react'
import { useState } from 'react'

export default function IntegrationsPage() {
  const [showAddModal, setShowAddModal] = useState(false)

  const integrations = [
    {
      id: 'sn-001',
      platform: 'ServiceNow',
      icon: '🔧',
      status: 'connected',
      lastSync: '2 hours ago',
      endpoint: 'https://dev12345.service-now.com',
      syncedItems: { controls: 2145, incidents: 89, changes: 34 },
    },
    {
      id: 'archer-001',
      platform: 'Archer',
      icon: '🏹',
      status: 'connected',
      lastSync: '4 hours ago',
      endpoint: 'https://archer.company.com',
      syncedItems: { risks: 342, assessments: 28, policies: 12 },
    },
    {
      id: 'workiva-001',
      platform: 'Workiva',
      icon: '📊',
      status: 'connected',
      lastSync: '6 hours ago',
      endpoint: 'https://workiva.company.com',
      syncedItems: { documents: 567, complexes: 3, packages: 12 },
    },
    {
      id: 'logicgate-001',
      platform: 'LogicGate',
      icon: '⚙️',
      status: 'connected',
      lastSync: '1 hour ago',
      endpoint: 'https://app.logicgate.com',
      syncedItems: { risks: 156, initiatives: 24, assessments: 45 },
    },
  ]

  const availablePlatforms = [
    { name: 'ServiceNow', description: 'ITSM & Governance Platform', category: 'ITSM' },
    { name: 'RSA Archer', description: 'GRC & Risk Management', category: 'GRC' },
    { name: 'Workiva', description: 'Enterprise Reporting & Analytics', category: 'Reporting' },
    { name: 'LogicGate', description: 'Risk & Compliance Management', category: 'GRC' },
    { name: 'Nessus', description: 'Vulnerability Scanner', category: 'Security' },
    { name: 'Tenable', description: 'Cyber Exposure Platform', category: 'Security' },
  ]

  return (
    <>
      <TranslatedPageHeader
        titleKey="integrations.title"
        descriptionKey="integrations.description"
      />

      <div className="content-max py-6 lg:py-8">
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active Integrations</TabsTrigger>
          <TabsTrigger value="available">Available Platforms</TabsTrigger>
          <TabsTrigger value="logs">Sync Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">{integrations.length} Connected Integrations</h2>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Integration
            </Button>
          </div>

          <div className="space-y-3">
            {integrations.map((integration) => (
              <Card key={integration.id} className="card-premium card-hover">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4 flex-1">
                        <div className="text-3xl">{integration.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{integration.platform}</h3>
                            <Badge className="bg-success text-success-foreground flex gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Connected
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{integration.endpoint}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Last synced: {integration.lastSync}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Sync Now
                        </Button>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                    </div>

                    <div className="grid gap-2 grid-cols-3 bg-muted p-3 rounded-lg">
                      {Object.entries(integration.syncedItems).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <p className="text-2xl font-bold">{value}</p>
                          <p className="text-xs text-muted-foreground capitalize">{key}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <div className="space-y-3">
            {availablePlatforms.map((platform) => (
              <Card key={platform.name} className="card-premium card-hover">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{platform.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{platform.description}</p>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {platform.category}
                      </Badge>
                    </div>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card className="card-premium">
            <CardHeader>
              <CardTitle>Sync History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="rounded-lg border p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">ServiceNow - Controls Sync</p>
                    <p className="text-sm text-muted-foreground">2 hours ago • 2,145 items</p>
                  </div>
                  <Badge className="bg-success text-success-foreground">Success</Badge>
                </div>
                <div className="rounded-lg border p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">LogicGate - Risk Assessment Sync</p>
                    <p className="text-sm text-muted-foreground">1 hour ago • 45 items</p>
                  </div>
                  <Badge className="bg-success text-success-foreground">Success</Badge>
                </div>
                <div className="rounded-lg border p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">Workiva - Document Export</p>
                    <p className="text-sm text-muted-foreground">30 min ago • 12 packages</p>
                  </div>
                  <Badge className="bg-warning text-warning-foreground">Warning</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </>
  )
}
