import * as React from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"

import type { LanguageType, TopicType } from "@nisomnia/db"

import env from "@/env"
import { api } from "@/lib/trpc/server"

const TranslateTopicForm = React.lazy(async () => {
  const { TranslateTopicForm } = await import("./form")
  return { default: TranslateTopicForm }
})

interface TranslateTopicMetaDataProps {
  params: {
    topic_translation_primary_id: string
    language: LanguageType
    locale: LanguageType
  }
}

export async function generateMetadata({
  params,
}: TranslateTopicMetaDataProps): Promise<Metadata> {
  const { topic_translation_primary_id, language, locale } = params

  const topicTranslationPrimary =
    await api.topic.topicTranslationPrimaryById.query(
      topic_translation_primary_id,
    )

  return {
    title: "Translate Topic Dashboard",
    description: "Translate Topic Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/topic/translate/${language}/${topicTranslationPrimary?.id}`,
    },
    openGraph: {
      title: "Translate Topic Dashboard",
      description: "Translate Topic Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/topic/translate/${language}/${topicTranslationPrimary?.id}`,
      locale: locale,
    },
  }
}

interface TranslateTopicDashboardProps {
  params: {
    topic_translation_primary_id: string
    language: LanguageType
    type: TopicType
  }
}

export default async function TranslateTopicDashboardPage({
  params,
}: TranslateTopicDashboardProps) {
  const { topic_translation_primary_id, language } = params

  const topicTranslationPrimary =
    await api.topic.topicTranslationPrimaryById.query(
      topic_translation_primary_id,
    )

  const otherLanguageTopic = topicTranslationPrimary?.topics.find(
    (topic) => topic.language === language,
  )

  if (otherLanguageTopic) {
    redirect(`/dashboard/topic/edit/${otherLanguageTopic.id}`)
  }

  const mainTopic = topicTranslationPrimary?.topics.find(
    (topic) => topic.language !== language,
  )

  return (
    <TranslateTopicForm
      topic_translation_primary_id={topic_translation_primary_id}
      language={language}
      type={mainTopic?.type}
    />
  )
}

export const revalidate = 60
