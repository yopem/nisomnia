import * as React from "react"
import type { Metadata } from "next"

import type { LanguageType } from "@nisomnia/db"

import env from "@/env"

const DashboardAdContent = React.lazy(async () => {
  const { DashboardAdContent } = await import("./content")
  return { default: DashboardAdContent }
})

export function generateMetadata({
  params,
}: {
  params: { locale: LanguageType }
}): Metadata {
  const { locale } = params

  return {
    title: "Ad Dashboard",
    description: "Ad Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/ad/`,
    },
    openGraph: {
      title: "Ad Dashboard",
      description: "Ad Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/ad/`,
      locale: locale,
    },
  }
}

export default function AdDashboardPage() {
  return <DashboardAdContent />
}
