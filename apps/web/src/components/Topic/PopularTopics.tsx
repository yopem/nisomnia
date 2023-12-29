//TODO: handle topic featured image

import * as React from "react"

import type { LanguageType } from "@nisomnia/db"

import { api } from "@/lib/trpc/server"
import { getScopedI18n } from "@/locales/server"
import { TopicCard } from "./TopicCard"

interface PopularTopicsProps extends React.HTMLAttributes<HTMLDivElement> {
  locale: LanguageType
}

export const PopularTopics: React.FunctionComponent<
  PopularTopicsProps
> = async (props) => {
  const { locale } = props

  const ts = await getScopedI18n("home")

  const topics = await api.topic.byArticleCount.query({
    page: 1,
    per_page: 6,
    language: locale,
  })

  return (
    <>
      <h2>{ts("popular_topics")}</h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        {topics.map((topic) => (
          <TopicCard topic={topic} key={topic.id} />
        ))}
      </div>
    </>
  )
}
