//TODO: add conditional if language changed

import * as React from "react"
import NextLink from "next/link"

import type { LanguageType } from "@nisomnia/db"
import { cn } from "@nisomnia/ui/next"

import { api } from "@/lib/trpc/server"
import { ArticleCardVertical } from "./ArticleCardVertical"

interface ArticleListByTopicProps extends React.HTMLAttributes<HTMLDivElement> {
  locale: LanguageType
  topic_title: string
  topic_slug: string
}

export const ArticleListByTopic: React.FunctionComponent<
  ArticleListByTopicProps
> = async (props) => {
  const { locale, topic_title, topic_slug, className } = props

  const articles = await api.article.byTopic.query({
    page: 1,
    per_page: 4,
    language: locale,
    topic: topic_title,
  })

  return (
    <div className={cn("space-y-2 rounded-lg bg-foreground/20 p-5", className)}>
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-zinc-900">{topic_title}</h1>
        <NextLink
          aria-label="See more"
          href={`/article/topic/${topic_slug}`}
          className="text-zinc-900 hover:text-zinc-950"
        >
          See more
        </NextLink>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8">
        {articles.map((article) => (
          <ArticleCardVertical
            key={article.id}
            article={article}
            className="text-zinc-900 hover:text-zinc-950"
          />
        ))}
      </div>
    </div>
  )
}
