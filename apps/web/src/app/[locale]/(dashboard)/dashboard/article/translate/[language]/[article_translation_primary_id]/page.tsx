import * as React from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import env from "env"

import { getCurrentSession } from "@nisomnia/auth"
import type { LanguageType } from "@nisomnia/db"

import { api } from "@/lib/trpc/server"
import { TranslateArticleForm } from "./form"

export const revalidate = 60

interface TranslateArticleMetaDataProps {
  params: {
    article_translation_primary_id: string
    language: LanguageType
  }
}

export async function generateMetadata({
  params,
}: TranslateArticleMetaDataProps): Promise<Metadata> {
  const { article_translation_primary_id, language } = params

  const articleTranslationPrimary =
    await api.article.articleTranslationPrimaryById.query(
      article_translation_primary_id,
    )

  return {
    title: "Translate Article Dashboard",
    description: "Translate Article Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/article/translate/${language}/${articleTranslationPrimary?.id}`,
    },
  }
}

interface TranslateArticleDashboardProps {
  params: {
    article_translation_primary_id: string
    language: LanguageType
  }
}

export default async function TranslateArticleDashboardPage({
  params,
}: TranslateArticleDashboardProps) {
  const { article_translation_primary_id, language } = params

  const session = await getCurrentSession()

  const articleTranslationPrimary =
    await api.article.articleTranslationPrimaryById.query(
      article_translation_primary_id,
    )

  const otherLanguageArticle = articleTranslationPrimary?.articles.find(
    (article) => article.language === language,
  )

  if (otherLanguageArticle) {
    redirect(`/dashboard/article/edit/${otherLanguageArticle.id}`)
  }

  return (
    <>
      <TranslateArticleForm
        session={session}
        article_translation_primary_id={article_translation_primary_id}
        language={language}
      />
    </>
  )
}
