import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import { redirect } from "next/navigation"

import env from "@/env"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

const TranslateArticleForm = dynamicFn(async () => {
  const TranslateArticleForm = await import("./form")
  return TranslateArticleForm
})

interface TranslateArticleMetaDataProps {
  params: Promise<{
    locale: LanguageType
    articleTranslationId: string
    language: LanguageType
  }>
}

export async function generateMetadata(
  props: TranslateArticleMetaDataProps,
): Promise<Metadata> {
  const params = await props.params
  const { locale, articleTranslationId, language } = params

  const articleTranslation =
    await api.article.articleTranslationById(articleTranslationId)

  return {
    title: "Translate Article Dashboard",
    description: "Translate Article Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/article/translate/${language}/${articleTranslation?.id}`,
    },
    openGraph: {
      title: "Translate Article Dashboard",
      description: "Translate Article Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/article/translate/${language}/${articleTranslation?.id}`,
      locale: locale,
    },
  }
}

interface TranslateArticleDashboardProps {
  params: Promise<{
    articleTranslationId: string
    language: LanguageType
  }>
}

export default async function TranslateArticleDashboardPage(
  props: TranslateArticleDashboardProps,
) {
  const params = await props.params
  const { articleTranslationId, language } = params

  const articleTranslation =
    await api.article.articleTranslationById(articleTranslationId)

  const selectedArticle = articleTranslation?.articles?.find(
    (article) => article.language !== language,
  )
  const otherLanguageArticle = articleTranslation?.articles?.find(
    (article) => article.language === language,
  )

  if (otherLanguageArticle) {
    redirect(`/dashboard/article/edit/${otherLanguageArticle.id}`)
  }

  return (
    <TranslateArticleForm
      articleTranslationId={articleTranslationId}
      // @ts-expect-error FIX: drizzle join return string | null
      initialArticleData={selectedArticle}
      language={language}
    />
  )
}
