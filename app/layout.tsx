import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Navigation } from "@/components/layout/navigation"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth/auth-provider"
import { UserModeProvider } from "@/components/providers/user-mode-provider"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "CyberBeats - Decentralized Music Platform",
  description: "A cyberpunk-themed decentralized music streaming platform",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} min-h-screen`}>
        <UserModeProvider>
          <AuthProvider>
            <Suspense fallback={<div>Cargando...</div>}>
              <Navigation />
              <main className="container mx-auto px-4 py-8">{children}</main>
            </Suspense>
            <Toaster />
          </AuthProvider>
        </UserModeProvider>
      </body>
    </html>
  )
}
