"use client"

import * as React from "react"
import NextLink from "next/link"

import type {
  Article as ArticleProps,
  ArticleTranslationPrimary as ArticleTranslationPrimaryProps,
} from "@nisomnia/db"
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

type ArticleDataProps = ArticleProps & {
  article_translation_primary: ArticleTranslationPrimaryProps & {
    articles: ArticleProps[]
  }
}

export const DashboardArticleContent: React.FunctionComponent = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [searchQueryEn, setSearchQueryEn] = React.useState<string>("")
  const [searchType, setSearchType] = React.useState("id")
  const [pageLangId, setPageLangId] = React.useState<number>(1)
  const [pageLangEn, setPageLangEn] = React.useState<number>(1)
  const [articlesDataLangId, setArticlesDataLangId] = React.useState<
    ArticleDataProps[]
  >([])
  const [articlesDataLangEn, setArticlesDataLangEn] = React.useState<
    ArticleDataProps[]
  >([])

  const t = useI18n()
  const ts = useScopedI18n("article")

  const { data: articlesCountLangId } =
    api.article.countByLanguage.useQuery("id")
  const { data: articlesCountLangEn } =
    api.article.countByLanguage.useQuery("en")
  const lastPageLangId =
    articlesCountLangId && Math.ceil(articlesCountLangId / 10)
  const lastPageLangEn =
    articlesCountLangEn && Math.ceil(articlesCountLangEn / 10)

  const {
    data: articlesLangId,
    isLoading: articlesLangIdIsLoading,
    refetch: refetchArticlesLangId,
  } = api.article.dashboard.useQuery({
    page: pageLangId,
    per_page: 10,
    language: "id",
  })

  const {
    data: articlesLangEn,
    isLoading: articlesLangEnIsLoading,
    refetch: refetchArticlesLangEn,
  } = api.article.dashboard.useQuery({
    page: pageLangEn,
    per_page: 10,
    language: "en",
  })

  const { data: resultArticlesLangId } = api.article.searchDashboard.useQuery({
    search_query: searchQuery,
    language: "id",
  })

  const { data: resultArticlesLangEn } = api.article.searchDashboard.useQuery({
    search_query: searchQueryEn,
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
      setArticlesDataLangId(
        resultArticlesLangId as unknown as ArticleDataProps[],
      )
    } else {
      setArticlesDataLangId(articlesLangId as unknown as ArticleDataProps[])
    }
    if (searchQueryEn) {
      setArticlesDataLangEn(
        resultArticlesLangEn as unknown as ArticleDataProps[],
      )
    } else {
      setArticlesDataLangEn(articlesLangEn as unknown as ArticleDataProps[])
    }
  }, [
    articlesLangId,
    articlesLangEn,
    resultArticlesLangEn,
    resultArticlesLangId,
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
          <NextLink aria-label={t("add_new")} href="/dashboard/article/new">
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
            <Button variant={null}>
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
              {!articlesLangIdIsLoading &&
              articlesDataLangId !== undefined &&
              articlesDataLangId.length > 0 ? (
                <ArticleTable
                  articles={articlesDataLangId}
                  searchQuery={searchQuery}
                  page={pageLangId}
                  lastPage={lastPageLangId ?? 2}
                  handleBack={() =>
                    setPageLangId((old) => Math.max(old - 1, 0))
                  }
                  handleNext={() => {
                    setPageLangId((old) => old + 1)
                  }}
                  refetch={refetchArticlesLangId}
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
              {!articlesLangEnIsLoading &&
              articlesDataLangEn !== undefined &&
              articlesDataLangEn.length > 0 ? (
                <ArticleTable
                  articles={articlesDataLangEn}
                  searchQuery={searchQueryEn}
                  page={pageLangEn}
                  lastPage={lastPageLangEn ?? 3}
                  handleBack={() =>
                    setPageLangEn((old) => Math.max(old - 1, 0))
                  }
                  handleNext={() => {
                    setPageLangEn((old) => old + 1)
                  }}
                  refetch={refetchArticlesLangEn}
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

interface ArticleTableProps {
  articles: ArticleDataProps[]
  searchQuery: string
  page: number
  lastPage: number
  handleBack: () => void
  handleNext: () => void
  refetch: () => void
}

const ArticleTable = (props: ArticleTableProps) => {
  const {
    articles,
    searchQuery,
    page,
    lastPage,
    handleBack,
    handleNext,
    refetch,
  } = props

  const t = useI18n()
  const ts = useScopedI18n("article")

  const { mutate: deleteArticle } = api.article.deleteByAdmin.useMutation({
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
      <Table className="table-fixed	border-collapse border-spacing-0">
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
            <TableHead className="hidden md:table-cell">
              {t("published_date")}
            </TableHead>
            <TableHead className="hidden md:table-cell">
              {t("last_modified")}
            </TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead>{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article) => {
            const articleIndo =
              article.article_translation_primary.articles.find(
                (lang) => lang.language === "id",
              )
            const articleEnglish =
              article.article_translation_primary.articles.find(
                (lang) => lang.language === "en",
              )

            return (
              <TableRow key={article.id}>
                <TableCell className="max-w-[120px]">
                  <div>
                    <span className="line-clamp-3 font-medium">
                      {article.title}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex justify-between gap-2">
                    <DashboardAddLanguage
                      language={articleIndo?.language}
                      triggerLink={`/dashboard/article/translate/id/${article.article_translation_primary_id}`}
                      content={
                        <>
                          {articleIndo ? (
                            <p>{articleIndo.title}</p>
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
                      language={articleEnglish?.language}
                      triggerLink={`/dashboard/article/translate/en/${article.article_translation_primary_id}`}
                      content={
                        <>
                          {articleEnglish ? (
                            <p>{articleEnglish.title}</p>
                          ) : (
                            <p>{t("translate")}</p>
                          )}
                        </>
                      }
                    />
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(article.createdAt, "LL")}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(article.updatedAt, "LL")}
                </TableCell>
                <TableCell className="hidden whitespace-nowrap md:table-cell">
                  <div className="flex">
                    <span className="font-medium">
                      <Badge variant="outline">{article.status}</Badge>
                    </span>
                  </div>
                </TableCell>
                <TableCell align="right">
                  <DashboardAction
                    viewLink={`/article/${article.slug}`}
                    onDelete={() => {
                      deleteArticle(article.id)
                    }}
                    editLink={`/dashboard/article/edit/${article.id}`}
                    content={article.title}
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
