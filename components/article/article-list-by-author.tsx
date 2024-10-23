"use client"

import * as React from "react"

import LoadingProgress from "@/components/loading-progress"
import type { SelectArticle } from "@/lib/db/schema"
import { api } from "@/lib/trpc/react"
import type { LanguageType } from "@/lib/validation/language"
import ArticleCardVertical from "./article-card-vertical"

export type ArticleListByAuthorDataProps = Pick<
  SelectArticle,
  "title" | "slug" | "excerpt" | "featuredImage"
>

interface ArticleListByAuthorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  authorId: string
  locale: LanguageType
}

const ArticleListByAuthor: React.FC<ArticleListByAuthorProps> = (props) => {
  const { authorId, locale } = props

  const loadMoreRef = React.useRef<HTMLDivElement>(null)

  const { data, hasNextPage, fetchNextPage } =
    api.article.byAuthorIdInfinite.useInfiniteQuery(
      {
        authorId: authorId,
        language: locale,
        limit: 10,
      },
      {
        initialCursor: null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    )

  const handleObserver = React.useCallback(
    ([target]: IntersectionObserverEntry[]) => {
      if (target?.isIntersecting && hasNextPage) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage],
  )

  React.useEffect(() => {
    const lmRef = loadMoreRef.current
    const observer = new IntersectionObserver(handleObserver)

    if (loadMoreRef.current) observer.observe(loadMoreRef.current)

    return () => {
      if (lmRef) observer.unobserve(lmRef)
    }
  }, [handleObserver])

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 2xl:grid-cols-4">
        {data?.pages.map((page) => {
          return page.articles.map((article) => {
            return <ArticleCardVertical article={article} key={article.id} />
          })
        })}
      </div>
      {hasNextPage && (
        <div ref={loadMoreRef}>
          <div className="text-center">
            <LoadingProgress />
          </div>
        </div>
      )}
    </div>
  )
}

export default ArticleListByAuthor
