import * as React from "react"
import type { Metadata } from "next"

import { getCurrentSession } from "@nisomnia/auth"
import type { LanguageType } from "@nisomnia/db"

import env from "@/env"
import { CreateArticleForm } from "./form"

export function generateMetadata({
  params,
}: {
  params: { locale: LanguageType }
}): Metadata {
  const { locale } = params

  return {
    title: "Create Article Dashboard",
    description: "Create Article Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/article/new`,
    },
    openGraph: {
      title: "Create Article Dashboard",
      description: "Create Article Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/article/new`,
      locale: locale,
    },
  }
}

export default async function CreateArticlesDashboard() {
  const session = await getCurrentSession()
  return <CreateArticleForm session={session} />
}
