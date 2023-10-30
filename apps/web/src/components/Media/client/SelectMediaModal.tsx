"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import NextImage from "next/image"

import type { Media as MediaProps } from "@nisomnia/db"
import { Icon, IconButton } from "@nisomnia/ui/next"
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  Input,
  InputGroup,
  InputRightElement,
  ScrollArea,
} from "@nisomnia/ui/next-client"

import { api } from "@/lib/trpc/react"

const UploadMedia = dynamic(() =>
  import("./UploadMedia").then((mod) => mod.UploadMedia),
)

interface SelectMediaModalProps {
  handleSelectUpdateMedia: (_media: MediaProps) => void
  open: boolean
  setOpen: (_open: boolean) => void
  triggerContent: React.ReactNode
}

export const SelectMediaModal: React.FunctionComponent<
  SelectMediaModalProps
> = (props) => {
  const { handleSelectUpdateMedia, triggerContent, open, setOpen } = props

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerContent}</DialogTrigger>
      <DialogPortal>
        <DialogContent className="min-h-full min-w-full">
          <ScrollArea className="max-h-[90vh]">
            <DialogTitle>Select Featured Image</DialogTitle>
            <UploadMedia addLoadMedias={refetch} />
            <div>
              <form onSubmit={(e) => e.preventDefault()}>
                <InputGroup>
                  <Input
                    value={searchQuery}
                    onChange={handleSearchOnChange}
                    type="text"
                    placeholder="Search image"
                  />
                  <InputRightElement className="w-2">
                    <div className="inset-y-0 mr-3 flex items-center rounded-lg p-1 focus:outline-none">
                      <Icon.Search aria-label="Search" />
                    </div>
                  </InputRightElement>
                </InputGroup>
              </form>
            </div>
            <div className="my-3">
              {!isLoading &&
              mediasData !== undefined &&
              mediasData.length > 0 ? (
                <div className="mb-4 grid grid-cols-3 gap-3 lg:grid-cols-8">
                  {mediasData.map((media) => {
                    return (
                      <NextImage
                        key={media.id}
                        src={media.url}
                        alt={media.name}
                        fill
                        sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 33vw"
                        className="!relative aspect-[1/1] h-[500px] max-w-[unset] cursor-pointer rounded-sm border-2 border-muted/30 bg-muted/30 object-cover"
                        onClick={(e: { preventDefault: () => void }) => {
                          e.preventDefault()
                          handleSelectUpdateMedia(media)
                        }}
                        quality={60}
                      />
                    )
                  })}
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
                </div>
              ) : (
                <div className="my-48 flex items-center justify-center">
                  <h2>Medias Not found</h2>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
