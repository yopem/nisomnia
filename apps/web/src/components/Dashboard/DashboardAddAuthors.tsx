"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import { Button, Icon, IconButton } from "@nisomnia/ui/next"
import {
  FormErrorMessage,
  FormLabel,
  Input,
  toast,
} from "@nisomnia/ui/next-client"

import { api } from "@/lib/trpc/react"

interface FormValues {
  name: string
  content: string
  excerpt?: string
  meta_title?: string
  meta_description?: string
}

interface DashboardAddAuthorsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  authors: string[]
  addAuthors: React.Dispatch<React.SetStateAction<string[]>>
  selectedAuthors: {
    id: string
    name: string
  }[]
  addSelectedAuthors: React.Dispatch<
    React.SetStateAction<
      {
        id: string
        name: string
      }[]
    >
  >
}

interface FormValues {
  name: string
}

export const DashboardAddAuthors = React.forwardRef<
  HTMLDivElement,
  DashboardAddAuthorsProps
>((props, ref) => {
  const { authors, addAuthors, selectedAuthors, addSelectedAuthors } = props

  const [searchQuery, setSearchQuery] = React.useState<string>("")

  const { data: searchResults } = api.user.search.useQuery(searchQuery)

  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>({ mode: "all", reValidateMode: "onChange" })

  const assignAuthor = React.useCallback(
    (id: string | never) => {
      const checkedAuthors = [...authors]
      const index = checkedAuthors.indexOf(id as never)
      if (index === -1) {
        checkedAuthors.push(id as never)
      } else {
        checkedAuthors.splice(index, 1)
      }
      addAuthors(checkedAuthors)
    },
    [addAuthors, authors],
  )

  const onSubmit = React.useCallback(
    (values: FormValues) => {
      setSearchQuery(values.name)
      if (searchResults) {
        const searchResult = searchResults?.find(
          (topic) => topic.name === values.name,
        )

        if (searchResult) {
          if (
            !selectedAuthors.some((author) => author.name === searchResult.name)
          ) {
            const resultValue = {
              id: searchResult.id,
              name: searchResult.name!,
            }

            assignAuthor(searchResult.id)
            addSelectedAuthors((prev) => [...prev, resultValue])
          }
          setSearchQuery("")
        }
      }
    },
    [addSelectedAuthors, assignAuthor, searchResults, selectedAuthors],
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setSearchQuery(e.target.value)
  }

  const handleSelectandAssign = (value: { id: string; name: string }) => {
    if (!selectedAuthors.some((author) => author.name === value.name)) {
      setSearchQuery("")
      assignAuthor(value.id)
      addSelectedAuthors((prev) => [...prev, value])
    } else {
      toast({
        variant: "danger",
        description: value.name + " already used!",
      })
      setSearchQuery("")
    }
  }

  const handleKeyDown = (event: {
    key: string
    preventDefault: () => void
  }) => {
    if (event.key === "Enter") {
      setValue("name", searchQuery)
      event.preventDefault()
      handleSubmit(onSubmit)()
      setSearchQuery("")
    }
  }

  const handleRemoveValue = (value: { id: string }) => {
    const filteredResult = selectedAuthors.filter(
      (item) => item.id !== value.id,
    )

    const filteredData = authors.filter((item) => item !== value.id)
    addSelectedAuthors(filteredResult)
    addAuthors(filteredData)
  }

  return (
    <div ref={ref}>
      <FormLabel>Authors</FormLabel>
      <div className="rounded-md border border-muted/30 bg-muted/100">
        <div className="parent-focus flex max-w-[300px] flex-row flex-wrap items-center justify-start gap-2 p-2">
          {selectedAuthors.length > 0 &&
            selectedAuthors.map((author) => {
              return (
                <div
                  className="flex items-center gap-2 bg-muted/20 px-2 py-1 text-[14px] text-foreground"
                  key={author.id}
                >
                  <span>{author.name}</span>
                  <IconButton
                    disabled={selectedAuthors.length === 1}
                    aria-label="Delete Author"
                    onClick={() => handleRemoveValue(author)}
                    className="h-auto min-w-0 rounded-full bg-transparent p-0.5 text-foreground hover:bg-danger hover:text-white"
                  >
                    <Icon.Close />
                  </IconButton>
                </div>
              )
            })}
          <Input
            type="text"
            {...register("name", {
              required: selectedAuthors.length === 0 && "Author is Required",
            })}
            className="h-auto w-full min-w-[50px] max-w-full shrink grow basis-0 border-none !bg-transparent p-0 focus:border-none focus:ring-0"
            name="name"
            id="searchAuthor"
            value={searchQuery}
            onKeyDown={handleKeyDown}
            placeholder="Find authors"
            onChange={handleSearchChange}
          />

          {errors?.name && (
            <FormErrorMessage>{errors.name.message}</FormErrorMessage>
          )}
        </div>
        {searchResults && searchResults.length > 0 && (
          <ul className="border-t border-muted/30">
            {searchResults.map((searchAuthor) => {
              const authorsData = {
                id: searchAuthor.id,
                name: searchAuthor.name!,
              }
              return (
                <li key={searchAuthor.id} className="p-2 hover:bg-muted/50">
                  <Button
                    variant="ghost"
                    onClick={() => handleSelectandAssign(authorsData)}
                  >
                    {searchAuthor.name}
                  </Button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
})
