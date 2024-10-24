"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"

import { Icon } from "@/components/ui/icon"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import DashboardGenreHeader from "./header"
import GenreTable from "./table"

export default function DashboardGenreContent() {
  const searchParams = useSearchParams()

  const genreLangIdPage = searchParams.get("genreLangIdPage")
  const genreLangEnPage = searchParams.get("genreLangEnPage")

  const ts = useScopedI18n("genre")

  const { data: genresCountLangId, refetch: updateGenresCountLangId } =
    api.genre.countByLanguage.useQuery("id")
  const { data: genresCountLangEn, refetch: updateGenresCountLangEn } =
    api.genre.countByLanguage.useQuery("en")

  const perPage = 10

  const genreLangIdLastPage =
    genresCountLangId && Math.ceil(genresCountLangId / perPage)
  const genreLangEnLastPage =
    genresCountLangEn && Math.ceil(genresCountLangEn / perPage)

  const {
    data: genresLangId,
    isLoading: genresLangIdIsLoading,
    refetch: updateGenresLangId,
  } = api.genre.dashboard.useQuery({
    language: "id",
    page: genreLangIdPage ? parseInt(genreLangIdPage) : 1,
    perPage: perPage,
  })

  const {
    data: genresLangEn,
    isLoading: genresLangEnIsLoading,
    refetch: updateGenresLangEn,
  } = api.genre.dashboard.useQuery({
    language: "en",
    page: genreLangEnPage ? parseInt(genreLangEnPage) : 1,
    perPage: perPage,
  })

  React.useEffect(() => {
    if (
      genreLangIdLastPage &&
      genreLangIdPage &&
      parseInt(genreLangIdPage) !== 1 &&
      parseInt(genreLangIdPage) > genreLangIdLastPage
    ) {
      window.history.pushState(
        null,
        "",
        `?page=${genreLangIdLastPage.toString()}`,
      )
    }
  }, [genreLangIdLastPage, genreLangIdPage])

  React.useEffect(() => {
    if (
      genreLangEnLastPage &&
      genreLangEnPage &&
      parseInt(genreLangEnPage) !== 1 &&
      parseInt(genreLangEnPage) > genreLangEnLastPage
    ) {
      window.history.pushState(
        null,
        "",
        `?page=${genreLangEnLastPage.toString()}`,
      )
    }
  }, [genreLangEnLastPage, genreLangEnPage])

  return (
    <>
      <DashboardGenreHeader />
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
          {!genresLangIdIsLoading &&
          genresLangId !== undefined &&
          genresLangId.length > 0 ? (
            <GenreTable
              genres={genresLangId ?? 1}
              paramsName="genreLangIdPage"
              page={genreLangIdPage ? parseInt(genreLangIdPage) : 1}
              lastPage={genreLangIdLastPage ?? 2}
              updateGenres={updateGenresLangId}
              updateGenresCount={updateGenresCountLangId}
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
          {!genresLangEnIsLoading &&
          genresLangEn !== undefined &&
          genresLangEn.length > 0 ? (
            <GenreTable
              genres={genresLangEn ?? 1}
              paramsName="genreLangEnPage"
              page={genreLangEnPage ? parseInt(genreLangEnPage) : 1}
              lastPage={genreLangEnLastPage ?? 3}
              updateGenres={updateGenresLangEn}
              updateGenresCount={updateGenresCountLangEn}
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
