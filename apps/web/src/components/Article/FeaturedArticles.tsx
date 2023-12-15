import React from "react"

import type { LanguageType } from "@nisomnia/db"

import { api } from "@/lib/trpc/server"
import { ArticleCardFeatured } from "./ArticleCardFeatured"

interface FeaturedArticlesProps {
  locale: LanguageType
}

export const FeaturedArticles: React.FunctionComponent<
  FeaturedArticlesProps
> = async (props) => {
  const { locale } = props

  const articles = await api.article.byLanguage.query({
    page: 1,
    per_page: 5,
    language: locale,
  })

  const customClassName = (index: number) => {
    if (index === 0) {
      return "lg:row-[span_7]"
    } else if (index === 1) {
      return "lg:row-span-4"
    } else if (index === 2) {
      return "lg:row-span-3"
    } else if (index === 3) {
      return "lg:row-span-4"
    } else if (index === 4) {
      return "lg:row-span-3"
    } else {
      return ""
    }
  }

  return (
    <>
      <h2>Featured</h2>
      <div className="lg:grid-[rows_7] flex h-full flex-col gap-4 lg:grid lg:h-[600px] lg:grid-cols-3 lg:gap-8">
        {articles.map((article, index) => (
          <ArticleCardFeatured
            key={index}
            article={article}
            className={`w-full ${customClassName(index)}`}
          />
        ))}
      </div>
    </>
  )
}
