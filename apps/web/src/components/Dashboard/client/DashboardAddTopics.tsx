"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import type { LanguageType, Topic as TopicProps, TopicType } from "@nisomnia/db"
import { Button, Icon, IconButton } from "@nisomnia/ui/next"
import {
  FormErrorMessage,
  FormLabel,
  Input,
  toast,
} from "@nisomnia/ui/next-client"

import { api } from "@/lib/trpc/react"

interface FormValues {
  topicTitle: string
  content: string
  excerpt?: string
  meta_title?: string
  meta_description?: string
}

interface DashboardAddTopicsProps extends React.HTMLAttributes<HTMLDivElement> {
  topics: string[]
  topicType: TopicType
  locale: LanguageType
  addTopics: React.Dispatch<React.SetStateAction<string[]>>
  selectedTopics: {
    id: string
    title: string
  }[]
  addSelectedTopics: React.Dispatch<
    React.SetStateAction<
      {
        id: string
        title: string
      }[]
    >
  >
}

export const DashboardAddTopics: React.FunctionComponent<
  DashboardAddTopicsProps
> = (props) => {
  const {
    topics,
    topicType,
    addTopics,
    selectedTopics,
    addSelectedTopics,
    locale,
  } = props

  const [topicId, setTopicId] = React.useState<string>("")
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [inputValue, setInputValue] = React.useState<string>("")

  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>({ mode: "all", reValidateMode: "onChange" })

  const handleLocaleChange = React.useCallback(() => {
    setInputValue("")
    addTopics([])
    addSelectedTopics([])
  }, [addSelectedTopics, addTopics])

  React.useEffect(() => {
    handleLocaleChange()
  }, [handleLocaleChange, locale])

  const assignTopic = React.useCallback(
    (id: string | never) => {
      const checkedTopics = [...topics]
      const index = checkedTopics.indexOf(id as never)
      if (index === -1) {
        checkedTopics.push(id as never)
      } else {
        checkedTopics.splice(index, 1)
      }
      addTopics(checkedTopics)
    },
    [addTopics, topics],
  )

  const { data: searchResults } = api.topic.searchByType.useQuery({
    search_query: searchQuery,
    language: "id",
    type: topicType,
  })

  api.topic.topicTranslationPrimaryById.useQuery(topicId, {
    onSuccess: (data) => {
      const topicById = data?.topics.find(
        (topicData) => topicData.language === locale,
      ) as TopicProps
      addSelectedTopics((prev) => [
        ...prev,
        { ...topicById, title: searchQuery },
      ])
      addTopics((prev: string[]) => [...prev, topicById?.id])
    },
    onError: () => {
      toast({ variant: "danger", description: "Cannot find topic" })
    },
    enabled: !!topicId,
  })

  const { mutate: createTopic } = api.topic.create.useMutation({
    onSuccess: (data) => {
      toast({ variant: "success", description: "Topic Successfully created" })
      setTopicId(data?.id)
    },
  })

  const onSubmit = React.useCallback(
    (value: FormValues) => {
      setSearchQuery(value.topicTitle)

      if (searchResults) {
        const searchResult = searchResults?.find(
          (topic) => topic.title === value.topicTitle,
        )

        if (searchResult) {
          if (
            !selectedTopics.some((topic) => topic.title === searchResult.title)
          ) {
            const resultValue = {
              id: searchResult.id,
              title: searchResult.title,
            }

            assignTopic(searchResult.id)
            addSelectedTopics((prev) => [...prev, resultValue])
          }
          setInputValue("")
        } else {
          createTopic({
            title: value.topicTitle,
            type: topicType,
            language: locale,
          })
        }
      }
    },
    [
      addSelectedTopics,
      assignTopic,
      createTopic,
      locale,
      searchResults,
      selectedTopics,
      topicType,
    ],
  )

  const handleKeyDown = (event: {
    key: string
    preventDefault: () => void
  }) => {
    if (event.key === "Enter") {
      setValue("topicTitle", inputValue)
      event.preventDefault()
      handleSubmit(onSubmit)()
      setInputValue("")
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setInputValue(e.target.value)
    if (e.target.value.length > 1) {
      setSearchQuery(e.target.value)
    } else if (e.target.value.length < 1) {
      setSearchQuery("")
    }
  }

  const handleSelectandAssign = (value: { id: string; title: string }) => {
    if (!selectedTopics.some((topic) => topic.title === value.title)) {
      setInputValue("")
      setSearchQuery("")
      assignTopic(value.id)
      addSelectedTopics((prev) => [...prev, value])
    } else {
      toast({
        variant: "warning",
        description: value.title + " already used!",
      })
      setInputValue("")
      setSearchQuery("")
    }
  }

  const handleRemoveValue = (value: { id: string }) => {
    const filteredResult = selectedTopics.filter((item) => item.id !== value.id)
    const filteredData = topics.filter((item) => item !== value.id)
    addSelectedTopics(filteredResult)
    addTopics(filteredData)
  }

  return (
    <div>
      <FormLabel>Topics</FormLabel>
      <div className="rounded-md border border-muted/30 bg-muted/100">
        <div className="parent-focus flex max-w-[300px] flex-row flex-wrap items-center justify-start gap-2 p-2">
          {selectedTopics.length > 0 &&
            selectedTopics.map((topic) => {
              return (
                <div
                  className="flex items-center gap-2 bg-muted/20 px-2 py-1 text-[14px] text-foreground"
                  key={topic.id}
                >
                  <span>{topic.title}</span>
                  <IconButton
                    aria-label="Delete Topic"
                    onClick={() => handleRemoveValue(topic)}
                    className="h-auto min-w-0 rounded-full bg-transparent p-0.5 text-foreground hover:bg-danger hover:text-white"
                  >
                    <Icon.Close />
                  </IconButton>
                </div>
              )
            })}
          <Input
            type="text"
            {...register("topicTitle", {
              required: selectedTopics.length === 0 && "Topic is Required",
            })}
            className="h-auto w-full min-w-[50px] max-w-full shrink grow basis-0 border-none !bg-transparent p-0 focus:border-none focus:ring-0"
            name="topicTitle"
            onKeyDown={handleKeyDown}
            id="searchTopic"
            value={inputValue}
            placeholder="Enter topics"
            onChange={handleSearchChange}
          />

          {errors?.topicTitle && (
            <FormErrorMessage>{errors.topicTitle.message}</FormErrorMessage>
          )}
        </div>
        {searchResults !== undefined && searchResults?.length > 0 && (
          <ul className="border-t border-muted/30">
            {searchResults.map((searchTopic) => {
              const topicsData = {
                id: searchTopic.id,
                title: searchTopic.title,
              }
              return (
                <li key={searchTopic.id} className="p-2 hover:bg-muted/50 ">
                  <Button
                    variant="ghost"
                    onClick={() => handleSelectandAssign(topicsData)}
                  >
                    {searchTopic.title}
                  </Button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
