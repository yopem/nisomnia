import * as React from "react"
import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { notFound } from "next/navigation"

import type { LanguageType } from "@nisomnia/db"

import env from "@/env"
import { api } from "@/lib/trpc/server"

const EditArticleForm = dynamic(async () => {
  const { EditArticleForm } = await import("./form")
  return { default: EditArticleForm }
})

export async function generateMetadata({
  params,
}: {
  params: { article_id: string; locale: LanguageType }
}): Promise<Metadata> {
  const { article_id, locale } = params

  const article = await api.article.byId.query(article_id)

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
  params: { article_id: string }
}

export default async function CreateArticlesDashboard({
  params,
}: EditArticlesDashboardProps) {
  const { article_id } = params

  const article = await api.article.byId.query(article_id)

  if (!article) {
    notFound()
  }

  return <EditArticleForm article={article!} />
}
