import * as React from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import env from "env"

import { api } from "@/lib/trpc/server"
import { EditArticleForm } from "./form"

export async function generateMetadata({
  params,
}: {
  params: { article_id: string }
}): Promise<Metadata> {
  const { article_id } = params

  const article = await api.article.byId.query(article_id)

  return {
    title: "Edit Article Dashboard",
    description: "Edit Article Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/article/edit/${article?.id}`,
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

  return <EditArticleForm article={article} />
}
