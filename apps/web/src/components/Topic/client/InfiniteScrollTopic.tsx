"use client"

import * as React from "react"

import type { Article as ArticleProps, Media as MediaProps } from "@nisomnia/db"

import { ArticleCardHorizontal } from "@/components/Article"
import { LoadingProgress } from "@/components/Layout"
import { api } from "@/lib/trpc/react"

type ArticleDataProps = Pick<ArticleProps, "title" | "slug" | "excerpt"> & {
  featured_image: Pick<MediaProps, "url">
}

interface InfiniteScrollTopicArticlesProps
  extends React.HTMLAttributes<HTMLDivElement> {
  slug: string
  articles: ArticleDataProps[]
  index?: number
  totalPage: number
}

export const InfiniteScrollTopicArticles: React.FunctionComponent<
  InfiniteScrollTopicArticlesProps
> = (props) => {
  const { slug, articles, totalPage, index = 1, ...rest } = props

  const loadMoreRef = React.useRef<HTMLDivElement>(null)
  const [page, setPage] = React.useState<number>(index)
  const [list, setList] = React.useState<ArticleDataProps[]>(articles)

  const { data: articlesData } = api.topic.articlesByTopicSlug.useQuery({
    slug: slug,
    page: page,
    per_page: 10,
  })

  const handleObserver = React.useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries
      if (target?.isIntersecting && totalPage >= page) {
        if (articlesData) {
          setList((list) => [
            ...list,
            ...(articlesData?.articles as ArticleDataProps[]),
          ])
          setPage((prev: number) => prev + 1)
        }
      }
    },
    [totalPage, page, articlesData],
  )

  React.useEffect(() => {
    const lmRef = loadMoreRef.current
    const observer = new IntersectionObserver(handleObserver)

    if (loadMoreRef.current) observer.observe(loadMoreRef.current)
    return () => {
      if (lmRef) {
        observer.unobserve(lmRef)
      }
    }
  }, [handleObserver, articles])

  return (
    <div {...rest}>
      {list.map((article: ArticleDataProps) => {
        return <ArticleCardHorizontal key={article.slug} article={article} />
      })}
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
