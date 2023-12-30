"use client"

import * as React from "react"
import NextLink from "next/link"

import { type Media as MediaProps } from "@nisomnia/db"
import { toast } from "@nisomnia/ui/next-client"

import { Image } from "@/components/Image"
import { LoadingProgress } from "@/components/LoadingProgress"
import { api } from "@/lib/trpc/react"
import { useScopedI18n } from "@/locales/client"

const CopyMediaLinkButton = React.lazy(async () => {
  const { CopyMediaLinkButton } = await import("./CopyMediaLinkButton")
  return { default: CopyMediaLinkButton }
})

const DeleteMediaButton = React.lazy(async () => {
  const { DeleteMediaButton } = await import("./DeleteMediaButton")
  return { default: DeleteMediaButton }
})

interface InfiniteScrollMediaProps
  extends React.HTMLAttributes<HTMLDivElement> {
  index: number
  selectMedia?: (_media: { name: string; id: string; url: string }) => void
  isLibrary?: boolean
  deleteMedia?: () => void
  toggleUpload?: boolean
}

export const InfiniteScrollMedia: React.FunctionComponent<
  InfiniteScrollMediaProps
> = (props) => {
  const { isLibrary, selectMedia, index, toggleUpload } = props

  const ts = useScopedI18n("media")

  const loadMoreRef = React.useRef<HTMLDivElement>(null)
  const {
    data: medias,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = api.media.dashboardInfinite.useInfiniteQuery(
    { limit: 10 },
    {
      initialCursor: null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
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

  React.useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggleUpload])

  const handleObserver = React.useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries
      if (target?.isIntersecting && hasNextPage) {
        setTimeout(() => fetchNextPage(), 2)
      }
    },
    [fetchNextPage, hasNextPage],
  )

  React.useEffect(() => {
    const lmRef: HTMLDivElement | null = loadMoreRef.current
    const observer = new IntersectionObserver(handleObserver)

    if (loadMoreRef.current) observer.observe(loadMoreRef.current)
    return () => {
      if (lmRef) {
        observer.unobserve(lmRef)
      }
    }
  }, [handleObserver, index, isLibrary, medias])

  const { mutate: deleteMedia } = api.media.deleteByName.useMutation({
    onSuccess: () => {
      refetch()
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

  const handleDelete = (media: MediaProps) => {
    deleteMedia(media.name)
  }

  return (
    <div>
      <div className="mb-4 grid grid-cols-3 gap-3 lg:grid-cols-5">
        {isLibrary
          ? medias?.pages.map((list) =>
              list.medias.map((media) => {
                return (
                  <div
                    key={media.name}
                    className="relative overflow-hidden rounded-[18px]"
                  >
                    <DeleteMediaButton
                      description={media.name}
                      action={() => handleDelete(media)}
                    />
                    <CopyMediaLinkButton url={media.url} />
                    <NextLink
                      aria-label={media.name}
                      href={`/dashboard/media/edit/${media.id}`}
                    >
                      <Image
                        key={media.id}
                        src={media.url}
                        alt={media.name}
                        fill
                        sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 33vw"
                        className="!relative aspect-[1/1] h-[500px] max-w-[unset] rounded-lg border-2 border-muted/30 bg-muted/30 object-cover"
                        quality={60}
                      />
                    </NextLink>
                  </div>
                )
              }),
            )
          : medias?.pages.map((list) =>
              list.medias.map((media) => {
                return (
                  <Image
                    key={media.id}
                    src={media.url}
                    alt={media.name}
                    fill
                    sizes="(max-width: 768px) 30vw,
                    (max-width: 1200px) 20vw,
                    33vw"
                    className="!relative aspect-[1/1] h-[500px] max-w-[unset] cursor-pointer rounded-lg border-2 border-muted/30 bg-muted/30 object-cover"
                    onClick={(
                      e: React.MouseEvent<HTMLImageElement, MouseEvent>,
                    ) => {
                      e.preventDefault()
                      if (selectMedia) selectMedia(media)
                    }}
                  />
                )
              }),
            )}
      </div>
      {hasNextPage && (
        <div ref={loadMoreRef}>
          <div className="text-center">
            <LoadingProgress />
          </div>
        </div>
      )}
    </div>
  )
}
