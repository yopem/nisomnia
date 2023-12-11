"use client"

import * as React from "react"

import type {
  Article as ArticleProps,
  LanguageType,
  Media as MediaProps,
} from "@nisomnia/db"
import { toast } from "@nisomnia/ui/next-client"

import { LoadingProgress } from "@/components/LoadingProgress"
import { api } from "@/lib/trpc/react"
import { ArticleCardHorizontal } from "./ArticleCardHorizontal"

export type InfinteScrollRelatedArticlesDataProps = Pick<
  ArticleProps,
  "title" | "slug" | "excerpt"
> & {
  featured_image: Pick<MediaProps, "url">
}

interface InfiniteScrollRelatedArticlesProps
  extends React.HTMLAttributes<HTMLDivElement> {
  locale: LanguageType
  current_article_slug: string
  topic_slug: string
}

export const InfiniteScrollRelatedArticles: React.FunctionComponent<
  InfiniteScrollRelatedArticlesProps
> = (props) => {
  const { locale, current_article_slug, topic_slug } = props

  const loadMoreRef = React.useRef<HTMLDivElement>(null)

  const { data, hasNextPage, fetchNextPage } =
    api.article.relatedInfinite.useInfiniteQuery(
      {
        language: locale,
        current_article_slug: current_article_slug,
        topic_slug: topic_slug,
        limit: 10,
      },
      {
        initialCursor: null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        onError: (err) => {
          toast({ variant: "danger", description: err.message })
        },
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
      {data?.pages.map((page) => {
        return page.articles.map((article) => {
          return <ArticleCardHorizontal article={article} key={article.slug} />
        })
      })}
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
