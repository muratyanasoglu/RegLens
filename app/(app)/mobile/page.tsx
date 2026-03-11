'use client'

import { TranslatedPageHeader } from "@/components/translated-page-header"
import { useTranslations } from "@/components/locale-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Smartphone, Download, Lock, Share2, Bell, Zap } from 'lucide-react'

export default function MobilePage() {
  const t = useTranslations().t
  return (
    <>
      <TranslatedPageHeader
        titleKey="mobile.title"
        descriptionKey="mobile.description"
      />

      <div className="content-max flex flex-col gap-8 py-6 lg:py-8">
        <div className="grid gap-6 md:grid-cols-2">
        <Card className="card-premium card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              {t("mobile.iosTitle")}
            </CardTitle>
            <CardDescription>{t("mobile.iosDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ol className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="font-semibold text-muted-foreground">1.</span>
                <span>{t("mobile.iosStep1")}</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-muted-foreground">2.</span>
                <span>{t("mobile.iosStep2")}</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-muted-foreground">3.</span>
                <span>{t("mobile.iosStep3")}</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-muted-foreground">4.</span>
                <span>{t("mobile.iosStep4")}</span>
              </li>
            </ol>
            <Button className="w-full">
              <Download className="w-4 h-4 mr-2" />
              {t("mobile.openInSafari")}
            </Button>
          </CardContent>
        </Card>

        <Card className="card-premium card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              {t("mobile.androidTitle")}
            </CardTitle>
            <CardDescription>{t("mobile.androidDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ol className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="font-semibold text-muted-foreground">1.</span>
                <span>{t("mobile.androidStep1")}</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-muted-foreground">2.</span>
                <span>{t("mobile.androidStep2")}</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-muted-foreground">3.</span>
                <span>{t("mobile.androidStep3")}</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-muted-foreground">4.</span>
                <span>{t("mobile.androidStep4")}</span>
              </li>
            </ol>
            <Button className="w-full">
              <Download className="w-4 h-4 mr-2" />
              {t("mobile.openInChrome")}
            </Button>
          </CardContent>
        </Card>
        </div>

        <Card className="card-premium card-hover">
        <CardHeader>
          <CardTitle>{t("mobile.pwaFeatures")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex gap-3 p-3 rounded-lg border">
              <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium">{t("mobile.secureConnection")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("mobile.secureConnectionDesc")}
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-3 rounded-lg border">
              <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium">{t("mobile.offlineSupport")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("mobile.offlineSupportDesc")}
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-3 rounded-lg border">
              <Bell className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium">{t("mobile.pushNotifications")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("mobile.pushNotificationsDesc")}
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-3 rounded-lg border">
              <Share2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium">{t("mobile.fastLoading")}</p>
                <p className="text-sm text-muted-foreground">
                  Optimized for mobile networks
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        </Card>

        <Card className="card-premium card-hover">
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

        <Card className="card-premium card-hover">
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
