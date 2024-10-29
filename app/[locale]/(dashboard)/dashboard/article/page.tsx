import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"

import env from "@/env"
import type { LanguageType } from "@/lib/validation/language"

const DashboardArticleContent = dynamicFn(async () => {
  const DashboardArticleContent = await import("./content")
  return DashboardArticleContent
})

export async function generateMetadata(props: {
  params: Promise<{ locale: LanguageType }>
}): Promise<Metadata> {
  const params = await props.params
  const { locale } = params

  return {
    title: "Article Dashboard",
    description: "Article Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/topic`,
    },
    openGraph: {
      title: "Article Dashboard",
      description: "Article Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/topic`,
      locale: locale,
    },
  }
}

export default function DashboardArticleage() {
  return <DashboardArticleContent />
}
