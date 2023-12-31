"use client"

import * as React from "react"
import NextLink from "next/link"

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
import { toast } from "@nisomnia/ui/next-client"
import { formatDate } from "@nisomnia/utils"

import env from "@/env"
import { api } from "@/lib/trpc/react"
import { useI18n, useScopedI18n } from "@/locales/client"

const DashboardAction = React.lazy(async () => {
  const { DashboardAction } = await import(
    "@/components/Dashboard/DashboardAction"
  )
  return { default: DashboardAction }
})

export const DashboardArticleCommentContent: React.FunctionComponent = () => {
  const [page, setPage] = React.useState<number>(1)

  const t = useI18n()
  const ts = useScopedI18n("comment")

  const { data: articleCommentsCount } = api.articleComment.count.useQuery()

  const {
    data: articleComments,
    isLoading,
    refetch,
  } = api.articleComment.dashboard.useQuery(
    { page: page, per_page: 10 },
    {
      keepPreviousData: true,
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
            description: ts("fetch_failed"),
          })
        }
      },
    },
  )

  const lastPage = articleCommentsCount && Math.ceil(articleCommentsCount / 10)

  const { mutate: deleteArticleComment } =
    api.articleComment.delete.useMutation({
      onSuccess: () => {
        refetch()
        toast({
          variant: "success",
          description: ts("delete_success"),
        })
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
            description: ts("delete_success"),
          })
        }
      },
    })

  React.useEffect(() => {
    if (lastPage && page !== 1 && page > lastPage) {
      setPage((old) => Math.max(old - 1, 0))
    }
  }, [lastPage, page])

  return (
    <>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <NextLink aria-label="Add New Article" href="/dashboard/ad/new">
            <Button variant="ghost">
              <Icon.Add />
              {t("add_new")}
            </Button>
          </NextLink>
        </div>
      </div>
      <div className="mb-[80px] mt-6 rounded">
        {!isLoading &&
          (articleComments !== undefined && articleComments.length > 0 ? (
            <>
              <Table className="table-fixed border-collapse border-spacing-0">
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("content")}</TableHead>
                    <TableHead>{t("author")}</TableHead>
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
                  {articleComments.map((articleComment) => (
                    <TableRow key={articleComment.id}>
                      <TableCell className="line-clamp-3 max-w-[120px]">
                        <div className="flex">
                          <span className="font-medium">
                            {articleComment.content}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="white-space-nowrap">
                        <div className="flex">
                          <span className="line-clamp-3 break-words font-medium">
                            {articleComment.author.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden whitespace-nowrap md:table-cell">
                        <div className="flex">
                          <span className="font-medium">
                            {formatDate(articleComment.createdAt, "LL")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden whitespace-nowrap md:table-cell">
                        <div className="flex">
                          <span className="font-medium">
                            {formatDate(articleComment.updatedAt, "LL")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell align="right">
                        <DashboardAction
                          onDelete={() => {
                            void deleteArticleComment(articleComment.id)
                          }}
                          viewLink={`${env.NEXT_PUBLIC_SITE_URL}/article/${articleComment.article.slug}#comment`}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {page && (
                <div className="align-center mt-2 flex items-center justify-center space-x-2">
                  <>
                    {page !== 1 && (
                      <IconButton
                        variant="ghost"
                        onClick={() => setPage((old) => Math.max(old - 1, 0))}
                        disabled={page === 1}
                        className="rounded-full"
                      >
                        <Icon.ChevronLeft />
                      </IconButton>
                    )}
                    {page !== lastPage && (
                      <IconButton
                        variant="ghost"
                        onClick={() => {
                          setPage((old) => old + 1)
                        }}
                        className="rounded-full"
                      >
                        <Icon.ChevronRight />
                      </IconButton>
                    )}
                  </>
                </div>
              )}
            </>
          ) : (
            <div className="my-48 flex items-center justify-center">
              <h3 className="text-center text-4xl font-bold">
                {ts("not_found")}
              </h3>
            </div>
          ))}
      </div>
    </>
  )
}
