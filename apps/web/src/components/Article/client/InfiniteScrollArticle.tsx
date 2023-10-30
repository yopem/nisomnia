"use client"

import * as React from "react"

import type {
  Article as ArticleProps,
  LanguageType,
  Media as MediaProps,
} from "@nisomnia/db"

import { ArticleCardHorizontal } from "@/components/Article"
import { LoadingProgress } from "@/components/Layout"
import { api } from "@/lib/trpc/react"

export type InfinteScrollArticleDataProps = Pick<
  ArticleProps,
  "title" | "slug" | "excerpt"
> & {
  featured_image: Pick<MediaProps, "url">
}

interface InfiniteScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  articles: InfinteScrollArticleDataProps[]
  totalPage: number
  index?: number
  locale: LanguageType
}

export const InfiniteScrollArticle: React.FunctionComponent<
  InfiniteScrollProps
> = (props) => {
  const { articles, totalPage, index = 1, locale, ...rest } = props

  const loadMoreRef = React.useRef<HTMLDivElement>(null)
  const [page, setPage] = React.useState<number>(index)
  const [list, setList] =
    React.useState<InfinteScrollArticleDataProps[]>(articles)

  const { data: articlesData } = api.article.byLanguage.useQuery({
    language: locale,
    page: page,
    per_page: 10,
  })

  const handleObserver = React.useCallback(
    ([target]: IntersectionObserverEntry[]) => {
      if (target?.isIntersecting && totalPage >= page) {
        if (articlesData) {
          setList((prevList) => [
            ...prevList,
            ...(articles as InfinteScrollArticleDataProps[]),
          ])
          setPage((prevPage) => prevPage + 1)
        }
      }
    },
    [articles, articlesData, page, totalPage],
  )

  React.useEffect(() => {
    const lmRef = loadMoreRef.current
    const observer = new IntersectionObserver(handleObserver)

    if (loadMoreRef.current) observer.observe(loadMoreRef.current)

    return () => {
      if (lmRef) observer.unobserve(lmRef)
    }
  }, [handleObserver, index, articles])

  return (
    <div {...rest}>
      {list.map((article: InfinteScrollArticleDataProps) => (
        <ArticleCardHorizontal key={article.slug} article={article} />
      ))}
      {totalPage >= page && (
        <div ref={loadMoreRef}>
          <div className="text-center">
            <LoadingProgress />
          </div>
        </div>
      )}
    </div>
  )
}
