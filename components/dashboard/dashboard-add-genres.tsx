// TODO: handle arrow down

"use client"

import * as React from "react"
import { useController, type Control, type FieldValues } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { FormLabel, FormMessage } from "@/components/ui/form"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/toast/use-toast"
import type { SelectGenre } from "@/lib/db/schema"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import type { LanguageType } from "@/lib/validation/language"

interface DashboardAddGenresProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  genres: string[]
  locale: LanguageType
  addGenres: React.Dispatch<React.SetStateAction<string[]>>
  mode?: "create" | "edit"
  selectedGenres: {
    id: string
    title: string
  }[]
  addSelectedGenres: React.Dispatch<
    React.SetStateAction<
      {
        id: string
        title: string
      }[]
    >
  >
  control: Control<TFieldValues>
  fieldName: string
}

const DashboardAddGenres: React.FC<DashboardAddGenresProps> = (props) => {
  const {
    genres,
    mode = "create",
    addGenres,
    selectedGenres,
    addSelectedGenres,
    locale,
    control,
    fieldName,
  } = props

  const [genreId, setGenreId] = React.useState<string>("")
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [loadingCreate, setLoadingCreate] = React.useState(false)

  const t = useI18n()
  const ts = useScopedI18n("genre")

  const {
    field: { onChange },
  } = useController({
    control,
    name: fieldName,
    rules: { required: ts("required") },
  })

  const handleLocaleChange = React.useCallback(() => {
    if (mode === "create") {
      setSearchQuery("")
      addGenres([])
      onChange([])
      addSelectedGenres([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  React.useEffect(() => {
    handleLocaleChange()
  }, [handleLocaleChange, locale])

  const assignGenre = React.useCallback(
    (id: string | never) => {
      const checkedGenres = [...genres]
      const index = checkedGenres.indexOf(id as never)
      if (index === -1) {
        checkedGenres.push(id as never)
      } else {
        checkedGenres.splice(index, 1)
      }
      addGenres(checkedGenres)
      onChange(checkedGenres)
    },
    [addGenres, onChange, genres],
  )

  const { data: searchResults, isFetching: searchResultsIsLoading } =
    api.genre.search.useQuery(
      {
        searchQuery: searchQuery,
        language: locale,
      },
      {
        enabled: !!searchQuery,
        refetchOnWindowFocus: false,
      },
    )

  const {
    data: genreTranslation,
    error,
    isSuccess,
    isError,
  } = api.genre.genreTranslationById.useQuery(genreId, {
    enabled: !!genreId && !!searchQuery,
  })

  React.useEffect(() => {
    if (isSuccess && genreTranslation) {
      const genreById = genreTranslation?.genres.find(
        (genreData) => genreData.language === locale,
      ) as SelectGenre
      if (genreById?.id) {
        addSelectedGenres((prev) => [
          ...prev,
          { ...genreById, title: searchQuery },
        ])
        addGenres((prev: string[]) => [...prev, genreById?.id])
        onChange([...genres, genreById?.id])
      } else {
        toast({ variant: "danger", description: t("something_went_wrong") })
      }
      setGenreId("")
      setSearchQuery("")
    } else if (isError && error) {
      toast({ variant: "danger", description: ts("find_failed") })
    }
    setLoadingCreate(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError, genreTranslation, error])

  const { mutate: createGenre } = api.genre.create.useMutation({
    onSuccess: (data) => {
      if (data) {
        setGenreId(data[0]?.id)
        handleSelectandAssign(data[0])
      }
      toast({ variant: "success", description: ts("create_success") })
    },
    onError: (error) => {
      setLoadingCreate(false)
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
      } else if (error?.message) {
        toast({
          variant: "danger",
          description: error.message,
        })
      } else {
        toast({
          variant: "danger",
          description: ts("create_failed"),
        })
      }
    },
  })

  const onSubmit = React.useCallback(() => {
    if (searchResults) {
      const searchResult = searchResults?.find(
        (genre) => genre.title === searchQuery,
      )

      if (searchResult) {
        if (
          !selectedGenres.some((genre) => genre.title === searchResult.title)
        ) {
          const resultValue = {
            id: searchResult.id,
            title: searchResult.title,
          }

          assignGenre(searchResult.id)
          addSelectedGenres((prev) => [...prev, resultValue])
        } else {
          toast({
            variant: "warning",
            description: searchQuery + ` ${t("already_selected")}`,
          })
          setSearchQuery("")
        }
        setSearchQuery("")
      } else {
        setLoadingCreate(true)
        createGenre({
          title: searchQuery,
          language: locale,
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    addSelectedGenres,
    assignGenre,
    createGenre,
    locale,
    searchQuery,
    searchResults,
    selectedGenres,
  ])

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
      setTimeout(onSubmit, 500)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setSearchQuery(e.target.value)
  }

  const handleSelectandAssign = (value: { id: string; title: string }) => {
    if (!selectedGenres.some((genre) => genre.title === value.title)) {
      setSearchQuery("")
      assignGenre(value.id)
      addSelectedGenres((prev) => [...prev, value])
    } else {
      toast({
        variant: "warning",
        description: value.title + ` ${t("already_selected")}`,
      })
      setSearchQuery("")
    }
  }

  const handleRemoveValue = (value: { id: string }) => {
    const filteredResult = selectedGenres.filter((item) => item.id !== value.id)
    const filteredData = genres.filter((item) => item !== value.id)
    addSelectedGenres(filteredResult)
    addGenres(filteredData)
    onChange(filteredData)
  }

  return (
    <div className="space-y-2">
      <FormLabel>{t("genres")}</FormLabel>
      <div className="rounded-md border bg-muted/100">
        <div className="flex w-full flex-row flex-wrap items-center justify-start gap-2 p-2">
          {selectedGenres.length > 0 &&
            selectedGenres.map((genre) => {
              return (
                <div
                  className="flex items-center gap-2 rounded-full bg-background px-3 py-1 text-[14px] text-foreground"
                  key={genre.id}
                >
                  <span>{genre.title}</span>
                  <Button
                    aria-label={t("delete")}
                    onClick={() => handleRemoveValue(genre)}
                    className="size-5 min-w-0 rounded-full bg-transparent text-foreground hover:bg-danger hover:text-white"
                    size="icon"
                  >
                    <Icon.Close aria-label={t("delete")} />
                  </Button>
                </div>
              )
            })}
          <Input
            type="text"
            className="h-auto min-h-6 w-full min-w-[50px] shrink grow basis-0 border-none !bg-transparent px-2 py-0 focus:border-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            name="genreTitle"
            onKeyDown={handleEnter}
            id="searchGenre"
            value={searchQuery}
            placeholder={ts("enter")}
            onChange={handleSearchChange}
          />
        </div>
        {(searchResultsIsLoading || loadingCreate) && (
          <div className="p-2">
            <Skeleton className="h-4 w-full rounded-md bg-foreground/60" />
            <p className="mt-2">
              {loadingCreate ? ts("creating") : ts("finding")}
            </p>
          </div>
        )}
        {!searchResultsIsLoading &&
        !loadingCreate &&
        searchResults !== undefined &&
        searchResults.length > 0 ? (
          <ul className="border-t">
            {searchResults.map((searchGenre) => {
              const genresData = {
                id: searchGenre.id,
                title: searchGenre.title,
              }
              return (
                <li
                  key={searchGenre.id}
                  className="bg-background p-2 hover:bg-muted/50"
                >
                  <Button
                    variant="ghost"
                    type="button"
                    aria-label={searchGenre.title}
                    onClick={() => handleSelectandAssign(genresData)}
                  >
                    {searchGenre.title}
                  </Button>
                </li>
              )
            })}
          </ul>
        ) : (
          !searchResultsIsLoading &&
          !loadingCreate &&
          searchResults !== undefined &&
          searchResults.length < 1 && (
            <div className="border-t border-muted/30 p-2">
              <p>{ts("not_found")}</p>
            </div>
          )
        )}
      </div>
      <FormMessage />
    </div>
  )
}

export default DashboardAddGenres
