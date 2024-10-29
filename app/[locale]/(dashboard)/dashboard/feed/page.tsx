import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"

import env from "@/env"
import type { LanguageType } from "@/lib/validation/language"

const DashboardFeedContent = dynamicFn(async () => {
  const DashboardFeedContent = await import("./content")
  return DashboardFeedContent
})

export async function generateMetadata(props: {
  params: Promise<{ locale: LanguageType }>
}): Promise<Metadata> {
  const params = await props.params
  const { locale } = params

  return {
    title: "Feed Dashboard",
    description: "Feed Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/feed`,
    },
    openGraph: {
      title: "Feed Dashboard",
      description: "Feed Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/feed`,
      locale: locale,
    },
  }
}

export default function DashboardFeedPage() {
  return <DashboardFeedContent />
}
