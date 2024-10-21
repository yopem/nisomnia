"use client"

import * as React from "react"

import Image from "@/components/image"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import type { MediaType } from "@/lib/validation/media"
import MediaList from "./media-list"
import UploadMedia from "./upload-media"

interface SelectMediaDialogProps {
  handleSelectUpdateMedia: (_media: { url: string }) => void
  open: boolean
  setOpen: (_open: boolean) => void
  children?: React.ReactNode
  mediaType?: MediaType
}

const SelectMediaDialog: React.FunctionComponent<SelectMediaDialogProps> = (
  props,
) => {
  const { handleSelectUpdateMedia, children, open, setOpen, mediaType } = props

  const [toggleUpload, setToggleUpload] = React.useState<boolean>(false)
  const [searched, setSearched] = React.useState<boolean>(false)
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [selectedMediaType, setSelectedMediaType] = React.useState<
    MediaType | undefined
  >(mediaType)

  const ts = useScopedI18n("media")

  const { data: resultMedias } = api.media.search.useQuery(searchQuery)
  const { data: resultMediasByType } = api.media.searchByType.useQuery({
    type: selectedMediaType!,
    searchQuery: searchQuery,
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setSearched(true)

    if (e.target.value.length > 1) {
      setSearchQuery(e.target.value)
    } else if (e.target.value.length < 1) {
      setSearched(false)
    }
  }

  const handleMediaTypeChange = (value: MediaType) => {
    setSelectedMediaType(value === "all" ? undefined : value)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogPortal>
        <DialogContent className="min-h-full min-w-full">
          <ScrollArea className="max-h-[90vh]">
            <div className="mx-3">
              <DialogTitle>Select Featured Image</DialogTitle>
              <div className="my-8 space-y-2">
                <Button
                  aria-label="Add New Media"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    setToggleUpload(!toggleUpload)
                  }}
                >
                  Add New
                </Button>
                <UploadMedia
                  mediaType={selectedMediaType}
                  toggleUpload={toggleUpload}
                  setToggleUpload={setToggleUpload}
                />
              </div>
              <div className="flex flex-col justify-start space-y-2 lg:flex-row lg:space-x-2 lg:space-y-0">
                <div className="w-full lg:w-2/12">
                  <Select
                    value={selectedMediaType ?? "all"}
                    onValueChange={handleMediaTypeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose Media Type" />
                    </SelectTrigger>
                    <SelectContent className="w-10/12">
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="topic">Topic</SelectItem>
                      <SelectItem value="genre">Genre</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="tutorial">Tutorial</SelectItem>
                      <SelectItem value="movie">Movie</SelectItem>
                      <SelectItem value="tv">TV</SelectItem>
                      <SelectItem value="game">Game</SelectItem>
                      <SelectItem value="production_company">
                        Production Company
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full lg:w-11/12">
                  <form onSubmit={(e) => e.preventDefault()}>
                    <Input
                      onChange={handleSearchChange}
                      type="text"
                      placeholder={ts("search")}
                    />
                  </form>
                </div>
              </div>
            </div>
            <div className="m-3">
              {!searched && (
                <MediaList
                  toggleUpload={toggleUpload}
                  selectMedia={handleSelectUpdateMedia}
                  mediaType={selectedMediaType}
                />
              )}

              {searched &&
              selectedMediaType &&
              selectedMediaType !== "all" &&
              resultMediasByType !== undefined &&
              resultMediasByType?.length > 0 ? (
                <div className="mb-4 grid grid-cols-3 gap-3 lg:grid-cols-5">
                  {resultMediasByType?.map((media) => (
                    <Image
                      key={media.id}
                      src={media.url}
                      alt={media.name}
                      fill
                      sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 33vw"
                      className="!relative aspect-[1/1] h-[500px] max-w-[unset] cursor-pointer rounded-lg border-2 border-muted/30 bg-muted/30 object-cover"
                      onClick={(e: { preventDefault: () => void }) => {
                        e.preventDefault()
                        handleSelectUpdateMedia(media)
                        setSearched(false)
                      }}
                      quality={60}
                    />
                  ))}
                </div>
              ) : searched &&
                resultMedias !== undefined &&
                resultMedias?.length > 0 ? (
                <div className="mb-4 grid grid-cols-3 gap-3 lg:grid-cols-5">
                  {resultMedias?.map((media) => (
                    <Image
                      key={media.id}
                      src={media.url}
                      alt={media.name}
                      fill
                      sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 33vw"
                      className="!relative aspect-[1/1] h-[500px] max-w-[unset] cursor-pointer rounded-lg border-2 border-muted/30 bg-muted/30 object-cover"
                      onClick={(e: { preventDefault: () => void }) => {
                        e.preventDefault()
                        handleSelectUpdateMedia(media)
                        setSearched(false)
                      }}
                      quality={60}
                    />
                  ))}
                </div>
              ) : (
                searched && (
                  <div className="my-64 flex items-center justify-center">
                    <p>{ts("not_found")}</p>
                  </div>
                )
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}

export default SelectMediaDialog
