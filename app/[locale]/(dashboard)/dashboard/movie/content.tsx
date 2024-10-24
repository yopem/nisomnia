"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"

import { Icon } from "@/components/ui/icon"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import DashboardMovieHeader from "./header"
import MovieTable from "./table"

export default function DashboardMovieContent() {
  const searchParams = useSearchParams()

  const movieLangIdPage = searchParams.get("movieLangIdPage")
  const movieLangEnPage = searchParams.get("movieLangEnPage")

  const ts = useScopedI18n("movie")

  const { data: moviesCountLangId, refetch: updateMoviesCountLangId } =
    api.movie.countByLanguage.useQuery("id")
  const { data: moviesCountLangEn, refetch: updateMoviesCountLangEn } =
    api.movie.countByLanguage.useQuery("en")

  const perPage = 10

  const movieLangIdLastPage =
    moviesCountLangId && Math.ceil(moviesCountLangId / perPage)
  const movieLangEnLastPage =
    moviesCountLangEn && Math.ceil(moviesCountLangEn / perPage)

  const {
    data: moviesLangId,
    isLoading: moviesLangIdIsLoading,
    refetch: updateMoviesLangId,
  } = api.movie.dashboard.useQuery({
    language: "id",
    page: movieLangIdPage ? parseInt(movieLangIdPage) : 1,
    perPage: perPage,
  })

  const {
    data: moviesLangEn,
    isLoading: moviesLangEnIsLoading,
    refetch: updateMoviesLangEn,
  } = api.movie.dashboard.useQuery({
    language: "en",
    page: movieLangEnPage ? parseInt(movieLangEnPage) : 1,
    perPage: perPage,
  })

  React.useEffect(() => {
    if (
      movieLangIdLastPage &&
      movieLangIdPage &&
      parseInt(movieLangIdPage) !== 1 &&
      parseInt(movieLangIdPage) > movieLangIdLastPage
    ) {
      window.history.pushState(
        null,
        "",
        `?page=${movieLangIdLastPage.toString()}`,
      )
    }
  }, [movieLangIdLastPage, movieLangIdPage])

  React.useEffect(() => {
    if (
      movieLangEnLastPage &&
      movieLangEnPage &&
      parseInt(movieLangEnPage) !== 1 &&
      parseInt(movieLangEnPage) > movieLangEnLastPage
    ) {
      window.history.pushState(
        null,
        "",
        `?page=${movieLangEnLastPage.toString()}`,
      )
    }
  }, [movieLangEnLastPage, movieLangEnPage])

  return (
    <>
      <DashboardMovieHeader />
      {/* TODO: assign tab to link params */}
      <Tabs defaultValue="id">
        <TabsList>
          <TabsTrigger value="id">
            <Icon.IndonesiaFlag className="mr-2 size-4" />
            Indonesia
          </TabsTrigger>
          <TabsTrigger value="en">
            <Icon.USAFlag className="mr-2 size-4" />
            English
          </TabsTrigger>
        </TabsList>
        <TabsContent value="id">
          {!moviesLangIdIsLoading &&
          moviesLangId !== undefined &&
          moviesLangId.length > 0 ? (
            <MovieTable
              movies={moviesLangId ?? 1}
              paramsName="movieLangIdPage"
              page={movieLangIdPage ? parseInt(movieLangIdPage) : 1}
              lastPage={movieLangIdLastPage ?? 2}
              updateMovies={updateMoviesLangId}
              updateMoviesCount={updateMoviesCountLangId}
            />
          ) : (
            <div className="my-64 flex items-center justify-center">
              <h3 className="text-center text-4xl font-bold">
                {ts("not_found")}
              </h3>
            </div>
          )}
        </TabsContent>
        <TabsContent value="en">
          {!moviesLangEnIsLoading &&
          moviesLangEn !== undefined &&
          moviesLangEn.length > 0 ? (
            <MovieTable
              movies={moviesLangEn ?? 1}
              paramsName="movieLangEnPage"
              page={movieLangEnPage ? parseInt(movieLangEnPage) : 1}
              lastPage={movieLangEnLastPage ?? 3}
              updateMovies={updateMoviesLangEn}
              updateMoviesCount={updateMoviesCountLangEn}
            />
          ) : (
            <div className="my-64 flex items-center justify-center">
              <h3 className="text-center text-4xl font-bold">
                {ts("not_found")}
              </h3>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  )
}
