"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import NextLink from "next/link"

import type {
  Topic as TopicProps,
  TopicTranslationPrimary as TopicTranslationPrimaryProps,
} from "@nisomnia/db"
import {
  Button,
  Icon,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@nisomnia/ui/next"
import {
  Input,
  InputGroup,
  InputRightElement,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  toast,
} from "@nisomnia/ui/next-client"
import { formatDate } from "@nisomnia/utils"

import { api } from "@/lib/trpc/react"

const DashboardAction = dynamic(() =>
  import("@/components/Dashboard/client").then((mod) => mod.DashboardAction),
)
const DashboardAddLanguageAction = dynamic(() =>
  import("@/components/Dashboard/client").then(
    (mod) => mod.DashboardAddLanguage,
  ),
)

type TopicDataProps = TopicProps & {
  topic_translation_primary: TopicTranslationPrimaryProps & {
    topics: TopicProps[]
  }
}

export const DashboardTopicContent: React.FunctionComponent = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [searchQueryEn, setSearchQueryEn] = React.useState<string>("")
  const [searchType, setSearchType] = React.useState("id")
  const [pageLangId, setPageLangId] = React.useState<number>(1)
  const [pageLangEn, setPageLangEn] = React.useState<number>(1)
  const [topicsDataLangId, setTopicsDataLangId] = React.useState<
    TopicDataProps[]
  >([])
  const [topicsDataLangEn, setTopicsDataLangEn] = React.useState<
    TopicDataProps[]
  >([])

  const { data: topicsCountLangId } = api.topic.countByLanguage.useQuery("id")
  const { data: topicsCountLangEn } = api.topic.countByLanguage.useQuery("en")

  const lastPageLangId = topicsCountLangId && Math.ceil(topicsCountLangId / 10)
  const lastPageLangEn = topicsCountLangEn && Math.ceil(topicsCountLangEn / 10)

  const { data: resultTopicsLangId } = api.topic.searchDashboard.useQuery({
    search_query: searchQuery,
    language: "id",
  })

  const { data: resultTopicsLangEn } = api.topic.searchDashboard.useQuery({
    search_query: searchQueryEn,
    language: "en",
  })

  const {
    data: topicsLangId,
    isLoading: topicsLangIdIsLoading,
    refetch: refetchTopicsLangId,
  } = api.topic.dashboard.useQuery({
    page: pageLangId,
    per_page: 10,
    language: "id",
  })

  const {
    data: topicsLangEn,
    isLoading: topicsLangEnIsLoading,
    refetch: refetchTopicsLangEn,
  } = api.topic.dashboard.useQuery({
    page: pageLangEn,
    per_page: 10,
    language: "en",
  })

  const handleSearchOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (searchType === "id") {
      setSearchQuery(e.target.value)
    } else {
      setSearchQueryEn(e.target.value)
    }
  }

  React.useEffect(() => {
    if (searchQuery) {
      setTopicsDataLangId(resultTopicsLangId as unknown as TopicDataProps[])
    } else {
      setTopicsDataLangId(topicsLangId as unknown as TopicDataProps[])
    }
    if (searchQueryEn) {
      setTopicsDataLangEn(resultTopicsLangEn as unknown as TopicDataProps[])
    } else {
      setTopicsDataLangEn(topicsLangEn as unknown as TopicDataProps[])
    }
  }, [
    topicsLangId,
    topicsLangEn,
    resultTopicsLangEn,
    resultTopicsLangId,
    searchQuery,
    searchQueryEn,
  ])

  React.useEffect(() => {
    setIsLoading(false)
  }, [])

  return (
    <>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <NextLink href="/dashboard/topic/new">
            <Button variant="ghost">
              <Icon.Add />
              Add New
            </Button>
          </NextLink>
        </div>
        <InputGroup className="max-w-[200px]">
          <Input
            value={searchType === "id" ? searchQuery : searchQueryEn}
            onChange={handleSearchOnChange}
            type="text"
          />
          <InputRightElement>
            <Button variant="ghost">
              <Icon.Search />
            </Button>
          </InputRightElement>
        </InputGroup>
      </div>
      <div className="mb-[80px] mt-6 rounded">
        {!isLoading && (
          <Tabs defaultValue="id">
            <TabsList>
              <TabsTrigger onClick={() => setSearchType("id")} value="id">
                Indonesia
              </TabsTrigger>
              <TabsTrigger onClick={() => setSearchType("en")} value="en">
                English
              </TabsTrigger>
            </TabsList>
            <TabsContent value="id">
              {!topicsLangIdIsLoading &&
              topicsDataLangId !== undefined &&
              topicsDataLangId.length > 0 ? (
                <TopicTable
                  topics={topicsDataLangId}
                  searchQuery={searchQuery}
                  page={pageLangId}
                  lastPage={lastPageLangId ?? 2}
                  handleBack={() =>
                    setPageLangId((old) => Math.max(old - 1, 0))
                  }
                  handleNext={() => {
                    setPageLangId((old) => old + 1)
                  }}
                  refetch={refetchTopicsLangId}
                />
              ) : (
                <div className="my-48 flex items-center justify-center">
                  <h3 className="text-center text-4xl font-bold">
                    Topics Not found
                  </h3>
                </div>
              )}
            </TabsContent>
            <TabsContent value="en">
              {!topicsLangEnIsLoading &&
              topicsDataLangEn !== undefined &&
              topicsDataLangEn.length > 0 ? (
                <TopicTable
                  topics={topicsDataLangEn}
                  searchQuery={searchQueryEn}
                  page={pageLangEn}
                  lastPage={lastPageLangEn ?? 3}
                  handleBack={() =>
                    setPageLangEn((old) => Math.max(old - 1, 0))
                  }
                  handleNext={() => {
                    setPageLangEn((old) => old + 1)
                  }}
                  refetch={refetchTopicsLangEn}
                />
              ) : (
                <div className="my-48 flex items-center justify-center">
                  <h3 className="text-center text-4xl font-bold">
                    Topics Not found
                  </h3>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  )
}

interface TopicTableProps {
  topics: TopicDataProps[]
  searchQuery: string
  page: number
  lastPage: number
  refetch: () => void
  handleBack: () => void
  handleNext: () => void
}

const TopicTable: React.FunctionComponent<TopicTableProps> = (props) => {
  const {
    topics,
    searchQuery,
    page,
    lastPage,
    handleBack,
    handleNext,
    refetch,
  } = props

  const { mutate: deleteTopic } = api.topic.delete.useMutation({
    onSuccess: () => {
      refetch()
      toast({ variant: "success", description: "Delete Topic Successfully" })
    },
    onError: (err) => {
      toast({ variant: "danger", description: err.message })
    },
  })

  return (
    <>
      <Table className="table-fixed border-collapse border-spacing-0">
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>
              <div className="relative h-3 w-4">
                <Icon.IndonesiaFlag />
              </div>
            </TableHead>
            <TableHead>
              <div className="relative h-3 w-4">
                <Icon.USAFlag />
              </div>
            </TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead className="hidden md:table-cell">
              Published Date
            </TableHead>
            <TableHead className="hidden md:table-cell">
              Last Modified
            </TableHead>
            <TableHead align="center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topics.map((topic) => {
            const topicIndo = topic.topic_translation_primary.topics.find(
              (lang) => lang.language === "id",
            )
            const topicEnglish = topic.topic_translation_primary.topics.find(
              (lang) => lang.language === "en",
            )
            return (
              <TableRow key={topic.id}>
                <TableCell className="max-w-[120px]">
                  <div className="flex">
                    <span className="line-clamp-3 font-medium">
                      {topic.title}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex justify-between gap-2">
                    <DashboardAddLanguageAction
                      language={topicIndo?.language}
                      triggerLink={`/dashboard/topic/translate/id/${topic.topic_translation_primary_id}`}
                      content={
                        <>
                          {topicIndo ? (
                            <p>{topicIndo.title}</p>
                          ) : (
                            <p>Add Translations</p>
                          )}
                        </>
                      }
                    />
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex justify-between gap-2">
                    <DashboardAddLanguageAction
                      language={topicEnglish?.language}
                      triggerLink={`/dashboard/topic/translate/en/${topic.topic_translation_primary_id}`}
                      content={
                        <>
                          {topicEnglish ? (
                            <p>{topicEnglish.title}</p>
                          ) : (
                            <p>Add Translations</p>
                          )}
                        </>
                      }
                    />
                  </div>
                </TableCell>
                <TableCell className="white-space-nowrap">
                  <div className="flex">
                    <span className="font-medium">{topic.type}</span>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex">
                    <span className="font-medium">{topic.slug}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap md:table-cell">
                  <div className="flex">
                    <span className="font-medium">
                      {formatDate(topic.createdAt, "LL")}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap md:table-cell">
                  <div className="flex">
                    <span className="font-medium">
                      {formatDate(topic.createdAt, "LL")}
                    </span>
                  </div>
                </TableCell>
                <TableCell align="right">
                  <DashboardAction
                    viewLink={`/topic/${topic.slug}`}
                    onDelete={() => {
                      deleteTopic(topic.id)
                    }}
                    editLink={`/dashboard/topic/edit/${topic.id}`}
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      {page && !searchQuery && (
        <div className="align-center mt-2 flex items-center justify-center space-x-2">
          <>
            {page !== 1 && (
              <IconButton
                variant="ghost"
                onClick={handleBack}
                disabled={page === 1}
                className="rounded-full"
              >
                <Icon.ChevronLeft />
              </IconButton>
            )}
            {page !== lastPage && (
              <IconButton
                variant="ghost"
                onClick={handleNext}
                className="rounded-full"
              >
                <Icon.ChevronRight />
              </IconButton>
            )}
          </>
        </div>
      )}
    </>
  )
}
