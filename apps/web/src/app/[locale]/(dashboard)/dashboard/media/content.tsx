"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import NextImage from "next/image"
import NextLink from "next/link"
import axios from "axios"

import type { Media as MediaProps } from "@nisomnia/db"
import { Button, Icon, IconButton } from "@nisomnia/ui/next"
import {
  Input,
  InputGroup,
  InputRightElement,
  toast,
} from "@nisomnia/ui/next-client"

import { api } from "@/lib/trpc/react"

const ButtonDeleteMedia = dynamic(() =>
  import("@/components/Media/client").then((mod) => mod.ButtonDeleteMedia),
)

export const MediaLibraryDashboard: React.FunctionComponent = () => {
  const [page, setPage] = React.useState<number>(1)
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [mediasData, setMediasData] = React.useState<MediaProps[]>([])

  const { data: mediasCount } = api.media.count.useQuery()

  const {
    data: medias,
    isLoading,
    refetch,
  } = api.media.all.useQuery(
    { page: page, per_page: 10 },
    { keepPreviousData: true },
  )

  const lastPage = mediasCount && Math.ceil(mediasCount / 10)

  const { data: searchResults } = api.media.search.useQuery(searchQuery)

  const handleDelete = async (mediaName: string) => {
    const { data } = await axios.delete(`/api/media/name/${mediaName}`)
    if (data) {
      toast({
        variant: "success",
        description: "Media deleted successfully",
      })
      refetch()
    }
  }

  const handleSearchOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setSearchQuery(e.target.value)
  }

  React.useEffect(() => {
    if (searchQuery) {
      setMediasData(searchResults as unknown as MediaProps[])
    } else {
      setMediasData(medias as unknown as MediaProps[])
    }
  }, [searchQuery, searchResults, medias])

  React.useEffect(() => {
    if (page !== 1 && page > lastPage!) {
      setPage((old) => Math.max(old - 1, 0))
    }
  }, [lastPage, page])

  return (
    <>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <NextLink aria-label="Add New Media" href="/dashboard/media/new">
            <Button aria-label="Add New Media">Add New </Button>
          </NextLink>
        </div>
        <form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}
        >
          <InputGroup>
            <Input
              value={searchQuery}
              onChange={handleSearchOnChange}
              type="text"
            />
            <InputRightElement>
              <Button variant={null}>
                <Icon.Search />
              </Button>
            </InputRightElement>
          </InputGroup>
        </form>
      </div>
      {!isLoading && mediasData !== undefined && mediasData.length > 0 ? (
        <>
          <div className="my-3">
            <div className="mb-4 grid grid-cols-3 gap-3 md:grid-cols-5">
              {mediasData.map((media: MediaProps) => (
                <div
                  className="relative overflow-hidden rounded-[18px]"
                  key={media.id}
                >
                  <ButtonDeleteMedia
                    content={media.name}
                    deleteMedia={async () => {
                      await handleDelete(media.name)
                    }}
                  />
                  <NextLink
                    aria-label={media.name}
                    href={`/dashboard/media/edit/${media.id}`}
                  >
                    <NextImage
                      key={media.id}
                      src={media.url}
                      alt={media.name}
                      fill
                      sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 33vw"
                      className="!relative aspect-[1/1] h-[500px] max-w-[unset] rounded-sm border-2 border-muted/30 bg-muted/30 object-cover"
                      quality={60}
                    />
                  </NextLink>
                </div>
              ))}
            </div>
          </div>
          {page && !searchQuery && (
            <div className="align-center mt-2 flex items-center justify-center space-x-2">
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
            </div>
          )}
        </>
      ) : (
        <div className="my-48 flex items-center justify-center">
          <h2>Medias Not found</h2>
        </div>
      )}
    </>
  )
}
