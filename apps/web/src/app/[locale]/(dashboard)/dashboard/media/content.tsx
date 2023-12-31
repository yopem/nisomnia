"use client"

import * as React from "react"
import NextImage from "next/image"
import NextLink from "next/link"
import axios from "axios"

import { Button, Icon } from "@nisomnia/ui/next"
import {
  Input,
  InputGroup,
  InputRightElement,
  toast,
} from "@nisomnia/ui/next-client"

import { api } from "@/lib/trpc/react"
import { useI18n, useScopedI18n } from "@/locales/client"

const CopyMediaLinkButton = React.lazy(async () => {
  const { CopyMediaLinkButton } = await import(
    "@/components/Media/CopyMediaLinkButton"
  )
  return { default: CopyMediaLinkButton }
})

const DeleteMediaButton = React.lazy(async () => {
  const { DeleteMediaButton } = await import(
    "@/components/Media/DeleteMediaButton"
  )
  return { default: DeleteMediaButton }
})

const InfiniteScrollMedia = React.lazy(async () => {
  const { InfiniteScrollMedia } = await import(
    "@/components/Media/InfiniteScrollMedia"
  )
  return { default: InfiniteScrollMedia }
})

export const MediaLibraryContent: React.FunctionComponent = () => {
  const [searchQuery, setSearchQuery] = React.useState<string | null>(null)

  const t = useI18n()
  const ts = useScopedI18n("media")

  const handleSearchOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setSearchQuery(e.target.value)
  }

  const { data: resultsMedias, refetch: updateResultsMedias } =
    api.media.search.useQuery(searchQuery ?? "")

  const handleDelete = async (mediaName: string) => {
    const { data } = await axios.delete(`/api/media/name/${mediaName}`)
    if (data) {
      toast({
        variant: "success",
        description: ts("delete_success"),
      })
      updateResultsMedias()
    }
  }

  return (
    <div className="mx-4 flex w-full flex-col">
      <div className="mt-4 flex items-end justify-between">
        <div>
          <NextLink aria-label={t("add_new")} href="/dashboard/media/new">
            <Button aria-label={t("add_new")}>Add New </Button>
          </NextLink>
        </div>
        <form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}
        >
          <InputGroup>
            <Input type="text" onChange={handleSearchOnChange} />
            <InputRightElement>
              <Button variant={null}>
                <Icon.Search />
              </Button>
            </InputRightElement>
          </InputGroup>
        </form>
      </div>
      {searchQuery && resultsMedias && resultsMedias.length > 0 ? (
        <>
          <div className="my-3">
            <div className="mb-4 grid grid-cols-3 gap-3 md:grid-cols-5">
              {resultsMedias?.map((media) => (
                <div
                  className="relative overflow-hidden rounded-[18px]"
                  key={media.id}
                >
                  <DeleteMediaButton
                    description={media.name}
                    action={() => handleDelete(media.name)}
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
        </>
      ) : (
        searchQuery && (
          <div className="my-48 flex items-center justify-center">
            <h2>{ts("not_found")}</h2>
          </div>
        )
      )}
      {!searchQuery ? (
        <div className="my-3">
          <InfiniteScrollMedia index={2} isLibrary={true} />
        </div>
      ) : (
        !searchQuery && (
          <div className="my-48 flex items-center justify-center">
            <h2 className="text-center font-bold">{ts("not_found")}</h2>
          </div>
        )
      )}
    </div>
  )
}
