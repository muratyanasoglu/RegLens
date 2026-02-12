'use client'

import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Smartphone, Download, Lock, Share2, Bell, Zap } from 'lucide-react'

export default function MobilePage() {
  return (
    <>
      <PageHeader
        title="Mobile & PWA Support"
        description="Install ComplianceHub as a mobile app on any device"
      />

      <div className="content-max flex flex-col gap-8 py-6 lg:py-8">
        <div className="grid gap-6 md:grid-cols-2">
        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              iOS Installation
            </CardTitle>
            <CardDescription>Install on iPhone or iPad</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ol className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="font-semibold text-muted-foreground">1.</span>
                <span>Open this page in Safari browser</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-muted-foreground">2.</span>
                <span>Tap the Share button at the bottom</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-muted-foreground">3.</span>
                <span>Select "Add to Home Screen"</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-muted-foreground">4.</span>
                <span>Tap Add to complete installation</span>
              </li>
            </ol>
            <Button className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Open in Safari
            </Button>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Android Installation
            </CardTitle>
            <CardDescription>Install on Android phone or tablet</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ol className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="font-semibold text-muted-foreground">1.</span>
                <span>Open this page in Chrome browser</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-muted-foreground">2.</span>
                <span>Tap the menu (3 dots) at the top right</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-muted-foreground">3.</span>
                <span>Select "Install app"</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-muted-foreground">4.</span>
                <span>Tap Install to complete</span>
              </li>
            </ol>
            <Button className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Open in Chrome
            </Button>
          </CardContent>
        </Card>
        </div>

        <Card className="card-premium">
        <CardHeader>
          <CardTitle>Progressive Web App Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex gap-3 p-3 rounded-lg border">
              <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium">Secure Connection</p>
                <p className="text-sm text-muted-foreground">
                  All data encrypted with HTTPS
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-3 rounded-lg border">
              <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium">Offline Access</p>
                <p className="text-sm text-muted-foreground">
                  View cached data without internet
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-3 rounded-lg border">
              <Bell className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Get alerts for new tasks and updates
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-3 rounded-lg border">
              <Share2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium">Fast Loading</p>
                <p className="text-sm text-muted-foreground">
                  Optimized for mobile networks
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        </Card>

        <Card className="card-premium">
        <CardHeader>
          <CardTitle>Device Support</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center p-2 rounded border">
              <span>iOS 13.4 and later</span>
              <Badge className="bg-success text-success-foreground">Supported</Badge>
            </div>
            <div className="flex justify-between items-center p-2 rounded border">
              <span>Android 5.0 and later</span>
              <Badge className="bg-success text-success-foreground">Supported</Badge>
            </div>
            <div className="flex justify-between items-center p-2 rounded border">
              <span>Windows 11</span>
              <Badge className="bg-success text-success-foreground">Supported</Badge>
            </div>
            <div className="flex justify-between items-center p-2 rounded border">
              <span>macOS 11 and later</span>
              <Badge className="bg-success text-success-foreground">Supported</Badge>
            </div>
          </div>
        </CardContent>
        </Card>

        <Card className="card-premium">
        <CardHeader>
          <CardTitle>Benefits of Mobile App</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>Access compliance data from anywhere</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>Receive instant notifications for urgent tasks</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>Works offline with cached data</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>Full-screen immersive experience</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>No app store installation required</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>Automatic updates with latest features</span>
            </li>
          </ul>
        </CardContent>
        </Card>
      </div>
    </>
  )
}
