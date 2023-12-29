import * as React from "react"

import type { LanguageType } from "@nisomnia/db"

import { api } from "@/lib/trpc/server"
import { getScopedI18n } from "@/locales/server"
import { ArticleCardVertical } from "./ArticleCardVertical"

interface ArticleListHomeProps {
  locale: LanguageType
}

export const ArticleListHome: React.FunctionComponent<
  ArticleListHomeProps
> = async (props) => {
  const { locale } = props

  const ts = await getScopedI18n("home")

  const articles = await api.article.byLanguage.query({
    page: 1,
    per_page: 17,
    language: locale,
  })

  const remainingArticles = articles.slice(5)

  return (
    <>
      <h2>{ts("latest")}</h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8">
        {remainingArticles.map((article) => (
          <ArticleCardVertical key={article.id} article={article} />
        ))}
      </div>
    </>
  )
}
