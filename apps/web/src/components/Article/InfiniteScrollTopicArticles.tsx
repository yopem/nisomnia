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
import { useScopedI18n } from "@/locales/client"
import { ArticleCardHorizontal } from "./ArticleCardHorizontal"

export type InfinteScrollTopicArticlesDataProps = Pick<
  ArticleProps,
  "title" | "slug" | "excerpt"
> & {
  featured_image: Pick<MediaProps, "url">
}

interface InfiniteScrollTopicArticlesProps
  extends React.HTMLAttributes<HTMLDivElement> {
  slug: string
  locale: LanguageType
}

export const InfiniteScrollTopicArticles: React.FunctionComponent<
  InfiniteScrollTopicArticlesProps
> = (props) => {
  const { slug, locale } = props

  const ts = useScopedI18n("article")

  const loadMoreRef = React.useRef<HTMLDivElement>(null)

  const { data, hasNextPage, fetchNextPage } =
    api.topic.articlesByTopicSlugInfinite.useInfiniteQuery(
      {
        slug: slug,
        language: locale,
        limit: 10,
      },
      {
        initialCursor: null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        onError: (error) => {
          const errorData = error?.data?.zodError?.fieldErrors

          if (errorData) {
            for (const field in errorData) {
              if (errorData.hasOwnProperty(field)) {
                errorData[field]?.forEach((errorMessage) => {
                  toast({
                    variant: "danger",
                    description: errorMessage,
                  })
                })
              }
            }
          } else {
            toast({
              variant: "danger",
              description: ts("fetch_failed"),
            })
          }
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
      {data?.pages ? (
        data?.pages.map((page) => {
          return page?.topic?.articles.map((article) => {
            return (
              <ArticleCardHorizontal article={article} key={article.slug} />
            )
          })
        })
      ) : (
        <h3 className="my-16 text-center text-3xl">{ts("not_found")}</h3>
      )}
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
