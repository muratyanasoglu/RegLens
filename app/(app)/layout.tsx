"use client"

import React from "react"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Chatbot } from "@/components/chatbot"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-h-screen bg-background bg-app-grid">{children}</SidebarInset>
      <ScrollToTop />
      <Chatbot />
    </SidebarProvider>
  )
}
