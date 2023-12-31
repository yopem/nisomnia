"use client"

import * as React from "react"

import { Icon } from "@nisomnia/ui/next"
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
  toast,
} from "@nisomnia/ui/next-client"

import { Image } from "@/components/Image"
import { api } from "@/lib/trpc/react"
import { useScopedI18n } from "@/locales/client"

const InfiniteScrollMedia = React.lazy(async () => {
  const { InfiniteScrollMedia } = await import("./InfiniteScrollMedia")
  return { default: InfiniteScrollMedia }
})

const UploadMedia = React.lazy(async () => {
  const { UploadMedia } = await import("./UploadMedia")
  return { default: UploadMedia }
})

interface SelectMediaModalProps {
  handleSelectUpdateMedia: (_media: {
    name: string
    id: string
    url: string
  }) => void
  open: boolean
  setOpen: (_open: boolean) => void
  triggerContent: React.ReactNode
}

export const SelectMediaModal: React.FunctionComponent<
  SelectMediaModalProps
> = (props) => {
  const { handleSelectUpdateMedia, triggerContent, open, setOpen } = props

  const ts = useScopedI18n("media")

  const [searched, setSearched] = React.useState<boolean>(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [toggleUpload, setToggleUpload] = React.useState(false)

  const { data: resultMedias } = api.media.search.useQuery(searchQuery, {
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerContent}</DialogTrigger>
      <DialogPortal>
        <DialogContent className="min-h-full min-w-full">
          <ScrollArea className="max-h-[90vh]">
            <div className="mx-3">
              <DialogTitle>Select Featured Image</DialogTitle>
              <UploadMedia setToggleUpload={setToggleUpload} />
              <div>
                <form onSubmit={(e) => e.preventDefault()}>
                  <InputGroup>
                    <Input
                      onChange={handleSearchChange}
                      type="text"
                      placeholder={ts("search")}
                    />
                    <InputRightElement className="w-2">
                      <div className="inset-y-0 mr-3 flex items-center rounded-lg p-1 focus:outline-none">
                        <Icon.Search aria-label="Search" />
                      </div>
                    </InputRightElement>
                  </InputGroup>
                </form>
              </div>
            </div>
            <div className="m-3">
              {!searched && (
                <InfiniteScrollMedia
                  index={2}
                  toggleUpload={toggleUpload}
                  selectMedia={handleSelectUpdateMedia}
                />
              )}
              {searched && resultMedias && resultMedias?.length > 0 ? (
                <div className="mb-4 grid grid-cols-3 gap-3 lg:grid-cols-5">
                  {resultMedias?.map((media) => {
                    return (
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
                    )
                  })}
                </div>
              ) : (
                searched && <p>{ts("not_found")}</p>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
