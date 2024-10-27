"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"

import { useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import DashboardMovieHeader from "./header"
import MovieTable from "./table"

export default function DashboardMovieContent() {
  const searchParams = useSearchParams()

  const page = searchParams.get("page")

  const ts = useScopedI18n("movie")

  const { data: moviesCount, refetch: updateMoviesCount } =
    api.movie.countDashboard.useQuery()

  const perPage = 10

  const lastPage = moviesCount && Math.ceil(moviesCount / perPage)

  const {
    data: movies,
    isLoading,
    refetch: upateMovies,
  } = api.movie.dashboard.useQuery({
    page: page ? parseInt(page) : 1,
    perPage: perPage,
  })

  React.useEffect(() => {
    if (lastPage && page && parseInt(page) !== 1 && parseInt(page) > lastPage) {
      window.history.pushState(null, "", `?page=${lastPage.toString()}`)
    }
  }, [lastPage, page])

  return (
    <>
      <DashboardMovieHeader />
      {!isLoading && movies !== undefined && movies.length > 0 ? (
        <MovieTable
          movies={movies}
          paramsName="movieLangIdPage"
          page={page ? parseInt(page) : 1}
          lastPage={lastPage ?? 2}
          updateMovies={upateMovies}
          updateMoviesCount={updateMoviesCount}
        />
      ) : (
        <div className="my-64 flex items-center justify-center">
          <h3 className="text-center text-4xl font-bold">{ts("not_found")}</h3>
        </div>
      )}
    </>
  )
}
