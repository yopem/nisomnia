import * as React from "react"
import type { Metadata } from "next"

import type { LanguageType } from "@nisomnia/db"

import env from "@/env"

const DashboardArticleCommentContent = React.lazy(async () => {
  const { DashboardArticleCommentContent } = await import("./content")
  return { default: DashboardArticleCommentContent }
})

export function generateMetadata({
  params,
}: {
  params: { locale: LanguageType }
}): Metadata {
  const { locale } = params

  return {
    title: "Article Comment Dashboard",
    description: "Article Comment Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/article/comment/`,
    },
    openGraph: {
      title: "Article Comment Dashboard",
      description: "Article Comment Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/article/comment/`,
      locale: locale,
    },
  }
}

export default function ArticleCommentDashboardPage() {
  return <DashboardArticleCommentContent />
}
