import * as React from "react"
import type { Metadata } from "next"

import type { LanguageType } from "@nisomnia/db"

import env from "@/env"

const DashboardArticleContent = React.lazy(async () => {
  const { DashboardArticleContent } = await import("./content")
  return { default: DashboardArticleContent }
})

export function generateMetadata({
  params,
}: {
  params: { locale: LanguageType }
}): Metadata {
  const { locale } = params

  return {
    title: "Article Dashboard",
    description: "Article Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/article/`,
    },
    openGraph: {
      title: "Article Dashboard",
      description: "Article Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/article/`,
      locale: locale,
    },
  }
}

export default function ArticleDashboardPage() {
  return <DashboardArticleContent />
}
