"use client"

import * as React from "react"

import type {
  Article as ArticleProps,
  LanguageType,
  Media as MediaProps,
} from "@nisomnia/db"
import { toast } from "@nisomnia/ui/next-client"

import { ArticleCardHorizontal } from "@/components/Article"
import { LoadingProgress } from "@/components/LoadingProgress"
import { api } from "@/lib/trpc/react"

export type InfinteScrollUserArticlesDataProps = Pick<
  ArticleProps,
  "title" | "slug" | "excerpt"
> & {
  featured_image: Pick<MediaProps, "url">
}

interface InfiniteScrollUserArticlesProps
  extends React.HTMLAttributes<HTMLDivElement> {
  username: string
  locale: LanguageType
}

export const InfiniteScrollUserArticles: React.FunctionComponent<
  InfiniteScrollUserArticlesProps
> = (props) => {
  const { username, locale, ...rest } = props

  const loadMoreRef = React.useRef<HTMLDivElement>(null)

  const { data, hasNextPage, fetchNextPage } =
    api.user.articlesByUserUsernameInfinite.useInfiniteQuery(
      {
        username: username,
        language: locale,
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
    <div {...rest}>
      {data?.pages.map((page) => {
        return page.user?.article_authors.map((article) => {
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
