import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import { notFound } from "next/navigation"

import env from "@/env"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

const EditArticleForm = dynamicFn(async () => {
  const EditArticleForm = await import("./form")
  return EditArticleForm
})

export async function generateMetadata(props: {
  params: Promise<{ articleId: string; locale: LanguageType }>
}): Promise<Metadata> {
  const params = await props.params
  const { articleId, locale } = params

  const article = await api.article.byId(articleId)

  return {
    title: "Edit Article Dashboard",
    description: "Edit Article Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/article/edit/${article?.id}`,
    },
    openGraph: {
      title: "Edit Article Dashboard",
      description: "Edit Article Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/article/edit/${article?.id}`,
      locale: locale,
    },
  }
}

interface EditArticlesDashboardProps {
  params: Promise<{ articleId: string }>
}

export default async function CreateArticlesDashboard(
  props: EditArticlesDashboardProps,
) {
  const params = await props.params
  const { articleId } = params

  const article = await api.article.byId(articleId)

  if (!article) {
    notFound()
  }

  // @ts-expect-error FIX: drizzle join return string | null
  return <EditArticleForm article={article} />
}
