import * as React from "react"

import DashboardPagination from "@/components/dashboard/dashboard-pagination"
import DashboardShowOptions from "@/components/dashboard/dashboard-show-options"
import Image from "@/components/image"
import { Badge } from "@/components/ui/badge"
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
import type { SelectMovie } from "@/lib/db/schema"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import { formatDate } from "@/lib/utils"

interface MovieTableProps {
  movies: SelectMovie[]
  paramsName: string
  page: number
  lastPage: number
  updateMovies: () => void
  updateMoviesCount: () => void
}

export default function MovieTable(props: MovieTableProps) {
  const {
    movies,
    paramsName,
    page,
    lastPage,
    updateMovies,
    updateMoviesCount,
  } = props

  const t = useI18n()
  const ts = useScopedI18n("movie")

  const { mutate: deleteMovie } = api.movie.delete.useMutation({
    onSuccess: () => {
      updateMovies()
      updateMoviesCount()
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
            <TableHead>{ts("poster")}</TableHead>
            <TableHead>{t("title")}</TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {t("slug")}
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              Status
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {ts("release_date")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movies.map((movie) => {
            return (
              <TableRow key={movie.id}>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="relative size-[200px] overflow-hidden rounded">
                    {movie.poster ? (
                      <Image
                        className="object-cover"
                        src={movie.poster}
                        alt={movie.title}
                      />
                    ) : (
                      <Icon.BrokenImage
                        aria-label="Broken Image"
                        className="size-full"
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell className="max-w-[120px] align-middle">
                  <div className="flex flex-col">
                    <span className="line-clamp-3 font-medium">
                      {movie.title}
                    </span>
                    <span className="table-cell text-[10px] text-muted-foreground lg:hidden">
                      <span>{movie.status}</span>
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="flex">
                    <span className="overflow-hidden text-ellipsis font-medium">
                      {movie.slug}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="flex">
                    <Badge variant="outline" className="uppercase">
                      {movie.status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="flex">
                    {formatDate(movie.releaseDate, "LL")}
                  </div>
                </TableCell>
                <TableCell className="p-4 align-middle">
                  <DashboardShowOptions
                    onDelete={() => {
                      void deleteMovie(movie.id)
                    }}
                    editUrl={`/dashboard/movie/edit/${movie.id}`}
                    viewUrl={`/movie/${movie.slug}`}
                    description={movie.title}
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
