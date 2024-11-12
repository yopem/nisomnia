"use client"

import * as React from "react"

import LoadingProgress from "@/components/loading-progress"
import type { SelectMovie } from "@/lib/db/schema"
import { api } from "@/lib/trpc/react"
import MovieCard from "./movie-card"

export type MovieListDataProps = Pick<SelectMovie, "title" | "slug" | "poster">
interface MovieListProps extends React.HTMLAttributes<HTMLDivElement> {}

const MovieList: React.FC<MovieListProps> = () => {
  const loadMoreRef = React.useRef<HTMLDivElement>(null)

  const { data, hasNextPage, fetchNextPage } =
    api.movie.latestInfinite.useInfiniteQuery(
      {
        limit: 24,
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
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 2xl:grid-cols-6">
        {data?.pages.map((page) => {
          return page.movies.map((movie) => {
            return <MovieCard movie={movie} key={movie.id} />
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

export default MovieList
