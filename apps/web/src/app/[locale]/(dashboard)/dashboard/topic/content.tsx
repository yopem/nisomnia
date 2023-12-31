"use client"

import * as React from "react"
import NextLink from "next/link"

import type { Topic as TopicProps } from "@nisomnia/db"
import {
  Badge,
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
import { useI18n, useScopedI18n } from "@/locales/client"

const DashboardAction = React.lazy(async () => {
  const { DashboardAction } = await import(
    "@/components/Dashboard/DashboardAction"
  )
  return { default: DashboardAction }
})

const DashboardAddLanguage = React.lazy(async () => {
  const { DashboardAddLanguage } = await import(
    "@/components/Dashboard/DashboardAddLanguage"
  )
  return { default: DashboardAddLanguage }
})

type TopicDataProps = Pick<
  TopicProps,
  | "topic_translation_primary_id"
  | "id"
  | "language"
  | "title"
  | "slug"
  | "status"
  | "type"
  | "createdAt"
  | "updatedAt"
> & {
  topic_translation_primary: {
    id: string
    topics: Pick<TopicProps, "language" | "title">[]
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

  const t = useI18n()
  const ts = useScopedI18n("topic")

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
    if (searchQuery && resultTopicsLangId) {
      setTopicsDataLangId(resultTopicsLangId)
    } else {
      if (topicsLangId) setTopicsDataLangId(topicsLangId)
    }
    if (searchQueryEn) {
      if (resultTopicsLangEn) setTopicsDataLangEn(resultTopicsLangEn)
    } else {
      if (topicsLangEn) setTopicsDataLangEn(topicsLangEn)
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
          <NextLink aria-label={t("add_new")} href="/dashboard/topic/new">
            <Button variant="ghost">
              <Icon.Add />
              {t("add_new")}
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
                    {ts("not_found")}
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
                    {ts("not_found")}
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

  const t = useI18n()
  const ts = useScopedI18n("topic")

  const { mutate: deleteTopic } = api.topic.delete.useMutation({
    onSuccess: () => {
      refetch()
      toast({ variant: "success", description: ts("delete_success") })
    },
    onError: (error) => {
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
      } else {
        toast({
          variant: "danger",
          description: ts("delete_failed"),
        })
      }
    },
  })

  return (
    <>
      <Table className="table-fixed border-collapse border-spacing-0">
        <TableHeader>
          <TableRow>
            <TableHead>{t("title")}</TableHead>
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
            <TableHead>{t("type")}</TableHead>
            <TableHead>{t("slug")}</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">
              {t("published_date")}
            </TableHead>
            <TableHead className="hidden md:table-cell">
              {t("last_modified")}
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
                    <DashboardAddLanguage
                      language={topicIndo?.language}
                      triggerLink={`/dashboard/topic/translate/id/${topic.topic_translation_primary_id}`}
                      content={
                        <>
                          {topicIndo ? (
                            <p>{topicIndo.title}</p>
                          ) : (
                            <p>{t("translate")}</p>
                          )}
                        </>
                      }
                    />
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex justify-between gap-2">
                    <DashboardAddLanguage
                      language={topicEnglish?.language}
                      triggerLink={`/dashboard/topic/translate/en/${topic.topic_translation_primary_id}`}
                      content={
                        <>
                          {topicEnglish ? (
                            <p>{topicEnglish.title}</p>
                          ) : (
                            <p>{t("translate")}</p>
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
                      <Badge variant="outline">{topic.status}</Badge>
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
                <TableCell className="hidden whitespace-nowrap md:table-cell">
                  <div className="flex">
                    <span className="font-medium">
                      {formatDate(topic.updatedAt, "LL")}
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
