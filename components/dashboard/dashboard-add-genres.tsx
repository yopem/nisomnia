// TODO: handle arrow down

"use client"

import * as React from "react"
import { useController, type Control } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { FormLabel, FormMessage } from "@/components/ui/form"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/toast/use-toast"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"

interface DashboardAddGenresProps {
  genres: string[]
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  fieldName: string
}

const DashboardAddGenres: React.FC<DashboardAddGenresProps> = (props) => {
  const {
    genres,
    addGenres,
    selectedGenres,
    addSelectedGenres,
    control,
    fieldName,
  } = props

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
        limit: 10,
      },
      {
        enabled: !!searchQuery,
        refetchOnWindowFocus: false,
      },
    )

  const { mutate: createGenre } = api.genre.create.useMutation({
    onSuccess: (data) => {
      if (data) {
        assignGenre(data[0]?.id)
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
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    addSelectedGenres,
    assignGenre,
    createGenre,
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
