"use client"

import * as React from "react"

import type { Article as ArticleProps, Media as MediaProps } from "@nisomnia/db"
import { toast } from "@nisomnia/ui/next-client"

import { ArticleCardHorizontal } from "@/components/Article"
import { LoadingProgress } from "@/components/Layout"
import { api } from "@/lib/trpc/react"

export type InfinteScrollTopicArticlesDataProps = Pick<
  ArticleProps,
  "title" | "slug" | "excerpt"
> & {
  featured_image: Pick<MediaProps, "url">
}

interface InfiniteScrollTopicArticlesProps
  extends React.HTMLAttributes<HTMLDivElement> {
  slug: string
}

export const InfiniteScrollTopicArticles: React.FunctionComponent<
  InfiniteScrollTopicArticlesProps
> = (props) => {
  const { slug, ...rest } = props

  const loadMoreRef = React.useRef<HTMLDivElement>(null)

  const { data, hasNextPage, fetchNextPage } =
    api.topic.articlesByTopicSlugInfinite.useInfiniteQuery(
      {
        slug: slug,
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
        return page.topic?.articles.map((article) => {
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
