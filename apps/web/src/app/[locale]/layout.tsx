import * as React from "react"
import { Inter } from "next/font/google"
import { cookies } from "next/headers"

import type { LanguageType } from "@nisomnia/db"
import { Toaster } from "@nisomnia/ui/next-client"

import { ThemeProvider } from "@/components/Theme/ThemeProvider"

import "@/styles/globals.css"

import { Scripts } from "@/components/Scripts"
import { TopLoader } from "@/components/TopLoader"
import { AuthProvider } from "@/components/User/AuthProvider"
import env from "@/env"
import { TRPCReactProvider } from "@/lib/trpc/react"
import { I18nProviderClient } from "@/locales/client"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

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

interface RootLayoutProps {
  children: React.ReactNode
  params: { locale: LanguageType }
}

export default function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = params

  return (
    <html
      lang={locale}
      className={inter.className}
      suppressHydrationWarning={true}
    >
      <body>
        <I18nProviderClient locale={locale}>
          <Toaster />
          <TopLoader />
          <ThemeProvider>
            <AuthProvider>
              <TRPCReactProvider cookies={cookies().toString()}>
                {children}
              </TRPCReactProvider>
            </AuthProvider>
          </ThemeProvider>
          <Scripts />
        </I18nProviderClient>
      </body>
    </html>
  )
}
