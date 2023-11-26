import * as React from "react"
import { Inter } from "next/font/google"
import { headers } from "next/headers"

import type { LanguageType } from "@nisomnia/db"
import { Toaster } from "@nisomnia/ui/next-client"

import "@/styles/globals.css"

import { LoadAdsense } from "@/components/Ad/client"
import { AuthProvider } from "@/components/Auth/client"
import { ThemeProvider } from "@/components/Theme/client"
import env from "@/env"
import { TRPCReactProvider } from "@/lib/trpc/react"

const inter = Inter({ subsets: ["latin"] })

export function generateMetadata({
  params,
}: {
  params: { locale: LanguageType }
}) {
  const { locale } = params

  return {
    title: {
      default: env.NEXT_PUBLIC_SITE_TITLE,
      template: `%s | ${env.NEXT_PUBLIC_SITE_TITLE}`,
    },
    description: env.NEXT_PUBLIC_SITE_DESCRIPTION,
    alternates: {
      canonical: env.NEXT_PUBLIC_SITE_URL,
    },
    openGraph: {
      title: env.NEXT_PUBLIC_SITE_TITLE,
      description: env.NEXT_PUBLIC_SITE_DESCRIPTION,
      url: env.NEXT_PUBLIC_SITE_URL,
      siteName: env.NEXT_PUBLIC_SITE_TITLE,
      images: [
        {
          url: env.NEXT_PUBLIC_LOGO_OG_URL,
          width: env.NEXT_PUBLIC_LOGO_OG_WIDTH,
          height: env.NEXT_PUBLIC_LOGO_OG_HEIGHT,
        },
      ],
      locale: locale,
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    twitter: {
      title: env.NEXT_PUBLIC_TWITTER_USERNAME,
      card: "summary_large_image",
      images: [
        {
          url: env.NEXT_PUBLIC_LOGO_OG_URL,
          width: env.NEXT_PUBLIC_LOGO_OG_WIDTH,
          height: env.NEXT_PUBLIC_LOGO_OG_HEIGHT,
        },
      ],
    },
    icons: {
      shortcut: "/icon/favicon.ico",
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <Toaster />
        <ThemeProvider>
          <AuthProvider>
            <TRPCReactProvider headers={headers()}>
              {children}
            </TRPCReactProvider>
          </AuthProvider>
        </ThemeProvider>
        {process.env.APP_ENV === "production" && <LoadAdsense />}
      </body>
    </html>
  )
}
