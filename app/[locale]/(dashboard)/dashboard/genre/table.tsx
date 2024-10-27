import * as React from "react"

import DashboardPagination from "@/components/dashboard/dashboard-pagination"
import DashboardShowOptions from "@/components/dashboard/dashboard-show-options"
import Image from "@/components/image"
import { Icon } from "@/components/ui/icon"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/toast/use-toast"
import type { SelectGenre } from "@/lib/db/schema"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"

interface GenreTableProps {
  genres: SelectGenre[]
  paramsName: string
  page: number
  lastPage: number
  updateGenres: () => void
  updateGenresCount: () => void
}

export default function GenreTable(props: GenreTableProps) {
  const {
    genres,
    paramsName,
    page,
    lastPage,
    updateGenres,
    updateGenresCount,
  } = props

  const t = useI18n()
  const ts = useScopedI18n("genre")

  const { mutate: deleteGenre } = api.genre.delete.useMutation({
    onSuccess: () => {
      updateGenres()
      updateGenresCount()
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
      } else if (error?.message) {
        toast({
          variant: "danger",
          description: error.message,
        })
      } else {
        toast({
          variant: "danger",
          description: ts("delete_failed"),
        })
      }
    },
  })

  return (
    <div className="relative w-full overflow-auto">
      <Table className="table-fixed border-collapse border-spacing-0">
        <TableHeader>
          <TableRow>
            <TableHead>{t("title")}</TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {t("slug")}
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {t("featured_image")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {genres.map((genre) => {
            return (
              <TableRow key={genre.id}>
                <TableCell className="max-w-[120px] align-middle">
                  <div className="flex flex-col">
                    <span className="line-clamp-3 font-medium">
                      {genre.title}
                    </span>
                    <span className="table-cell text-[10px] text-muted-foreground lg:hidden">
                      <span>{genre.slug}</span>
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="flex">
                    <span className="overflow-hidden text-ellipsis font-medium">
                      {genre.slug}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="relative size-[100px] overflow-hidden rounded">
                    {genre.featuredImage ? (
                      <Image
                        className="object-cover"
                        src={genre.featuredImage}
                        alt={genre.title}
                      />
                    ) : (
                      <Icon.BrokenImage
                        aria-label="Broken Image"
                        className="size-full"
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell className="p-4 align-middle">
                  <DashboardShowOptions
                    onDelete={() => {
                      void deleteGenre(genre.id)
                    }}
                    editUrl={`/dashboard/genre/edit/${genre.id}`}
                    viewUrl={`/genre/${genre.slug}`}
                    description={genre.title}
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      {lastPage ? (
        <DashboardPagination
          currentPage={page}
          lastPage={lastPage ?? 1}
          paramsName={paramsName}
        />
      ) : null}
    </div>
  )
}
