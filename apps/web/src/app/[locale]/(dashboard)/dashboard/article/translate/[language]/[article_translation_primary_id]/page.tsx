import * as React from "react"
import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { redirect } from "next/navigation"

import { getCurrentSession } from "@nisomnia/auth"
import type { LanguageType } from "@nisomnia/db"

import env from "@/env"
import { api } from "@/lib/trpc/server"

const TranslateArticleForm = dynamic(async () => {
  const { TranslateArticleForm } = await import("./form")
  return { default: TranslateArticleForm }
})

interface TranslateArticleMetaDataProps {
  params: {
    article_translation_primary_id: string
    language: LanguageType
    locale: LanguageType
  }
}

export async function generateMetadata({
  params,
}: TranslateArticleMetaDataProps): Promise<Metadata> {
  const { article_translation_primary_id, language, locale } = params

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
    openGraph: {
      title: "Translate Article Dashboard",
      description: "Translate Article Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/article/translate/${language}/${articleTranslationPrimary?.id}`,
      locale: locale,
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

export const revalidate = 60
