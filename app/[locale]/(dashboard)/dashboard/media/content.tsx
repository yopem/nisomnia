"use client"

import * as React from "react"
import NextImage from "next/image"
import NextLink from "next/link"

import CopyMediaLinkButton from "@/components/media/copy-media-link-button"
import DeleteMediaButton from "@/components/media/delete-media-button"
import MediaList from "@/components/media/media-list"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast/use-toast"
import { useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import type { MediaType } from "@/lib/validation/media"
import DashboardMediaHeader from "./header"

export default function DashboardMediaContent() {
  const [searched, setSearched] = React.useState<boolean>(false)
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [selectedMediaType, setSelectedMediaType] = React.useState<
    MediaType | undefined
  >(undefined)

  const ts = useScopedI18n("media")

  const { data: resultMedias, refetch: updateMedias } =
    api.media.search.useQuery(searchQuery)
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

  const { mutate: deleteMedia } = api.media.deleteByName.useMutation({
    onSuccess: () => {
      updateMedias()
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
    <>
      <DashboardMediaHeader />
      <div className="mt-4 flex flex-col justify-start space-y-2 lg:flex-row lg:space-x-2 lg:space-y-0">
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
      {!searched && (
        <div className="my-3">
          <MediaList isLibrary={true} mediaType={selectedMediaType} />
        </div>
      )}
      {searched &&
      selectedMediaType &&
      selectedMediaType !== "all" &&
      resultMediasByType !== undefined &&
      resultMediasByType?.length > 0 ? (
        <div className="my-3">
          <div className="mb-4 grid grid-cols-3 gap-3 md:grid-cols-8">
            {resultMediasByType?.map((media) => (
              <div
                className="relative overflow-hidden rounded-[18px]"
                key={media.id}
              >
                <DeleteMediaButton
                  description={media.name}
                  onDelete={() =>
                    deleteMedia({ name: media.name, type: media.type })
                  }
                />
                <CopyMediaLinkButton url={media.url} />
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
      ) : searched && resultMedias !== undefined && resultMedias?.length > 0 ? (
        <div className="my-3">
          <div className="mb-4 grid grid-cols-3 gap-3 lg:grid-cols-5">
            {resultMedias?.map((media) => (
              <div
                className="relative overflow-hidden rounded-[18px]"
                key={media.id}
              >
                <DeleteMediaButton
                  description={media.name}
                  onDelete={() =>
                    deleteMedia({ name: media.name, type: media.type })
                  }
                />
                <CopyMediaLinkButton url={media.url} />
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
      ) : (
        searched && (
          <div className="my-64 flex items-center justify-center">
            <p>{ts("not_found")}</p>
          </div>
        )
      )}
    </>
  )
}
