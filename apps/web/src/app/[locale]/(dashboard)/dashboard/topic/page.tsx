import * as React from "react"
import type { Metadata } from "next"
import dynamic from "next/dynamic"

import type { LanguageType } from "@nisomnia/db"

import env from "@/env"

const DashboardTopicContent = dynamic(async () => {
  const { DashboardTopicContent } = await import("./content")
  return { default: DashboardTopicContent }
})

export function generateMetadata({
  params,
}: {
  params: { locale: LanguageType }
}): Metadata {
  const { locale } = params

  return {
    title: "Topic Dashboard",
    description: "Topic Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/topic/`,
    },
    openGraph: {
      title: "Topic Dashboard",
      description: "Topic Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/topic/`,
      locale: locale,
    },
  }
}

export default function TopicDashboardPage() {
  return <DashboardTopicContent />
}
