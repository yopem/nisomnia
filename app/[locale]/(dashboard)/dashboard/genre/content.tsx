"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"

import { useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import DashboardGenreHeader from "./header"
import GenreTable from "./table"

export default function DashboardGenreContent() {
  const searchParams = useSearchParams()

  const page = searchParams.get("page")

  const ts = useScopedI18n("genre")

  const { data: genresCount, refetch: updateGenresCount } =
    api.genre.countDashboard.useQuery()

  const perPage = 10

  const lastPage = genresCount && Math.ceil(genresCount / perPage)

  const {
    data: genres,
    isLoading,
    refetch: updateGenres,
  } = api.genre.dashboard.useQuery({
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
      <DashboardGenreHeader />
      {!isLoading && genres !== undefined && genres.length > 0 ? (
        <GenreTable
          genres={genres ?? 1}
          paramsName="genreLangIdPage"
          page={page ? parseInt(page) : 1}
          lastPage={lastPage ?? 2}
          updateGenres={updateGenres}
          updateGenresCount={updateGenresCount}
        />
      ) : (
        <div className="my-64 flex items-center justify-center">
          <h3 className="text-center text-4xl font-bold">{ts("not_found")}</h3>
        </div>
      )}
    </>
  )
}
