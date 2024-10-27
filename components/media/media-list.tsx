"use client"

import * as React from "react"
import NextImage from "next/image"
import NextLink from "next/link"

import LoadingProgress from "@/components/loading-progress"
import { toast } from "@/components/ui/toast/use-toast"
import { useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import type { MediaCategory } from "@/lib/validation/media"
import CopyMediaLinkButton from "./copy-media-link-button"
import DeleteMediaButton from "./delete-media-button"

interface MediaListProps extends React.HTMLAttributes<HTMLDivElement> {
  selectMedia?: (_media: { name: string; id: string; url: string }) => void
  isLibrary?: boolean
  deleteMedia?: () => void
  toggleUpload?: boolean
  onSelect?: () => void
  category: MediaCategory
}

const MediaList: React.FC<MediaListProps> = (props) => {
  const { isLibrary, selectMedia, onSelect, toggleUpload, category } = props
  const prevToggleRef = React.useRef(toggleUpload)
  const loadMoreRef = React.useRef<HTMLDivElement>(null)

  const {
    data: medias,
    hasNextPage,
    fetchNextPage,
    refetch: updateMedias,
  } = api.media.dashboardInfinite.useInfiniteQuery(
    { limit: 24 },
    {
      staleTime: 0,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      enabled: !category,
    },
  )

  const {
    data: mediasByCategory,
    hasNextPage: hasNextPageByCategory,
    fetchNextPage: fetchNextPageByCategory,
    refetch: updateMediasByCategory,
  } = api.media.dashboardInfiniteByCategory.useInfiniteQuery(
    { limit: 24, category: category! },
    {
      staleTime: 0,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      enabled: !!category,
    },
  )

  React.useEffect(() => {
    if (prevToggleRef.current !== toggleUpload) {
      if (category) {
        updateMediasByCategory()
      } else {
        updateMedias()
      }
    }

    prevToggleRef.current = toggleUpload
  }, [toggleUpload, updateMedias, updateMediasByCategory, category])

  const handleObserver = React.useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries
      if (target?.isIntersecting) {
        if (category && hasNextPageByCategory) {
          setTimeout(() => fetchNextPageByCategory(), 2)
        } else if (!category && hasNextPage) {
          setTimeout(() => fetchNextPage(), 2)
        }
      }
    },
    [
      fetchNextPage,
      hasNextPage,
      fetchNextPageByCategory,
      hasNextPageByCategory,
      category,
    ],
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
  }, [handleObserver])

  const ts = useScopedI18n("media")

  const { mutate: deleteMedia } = api.media.deleteByName.useMutation({
    onSuccess: () => {
      if (category) {
        updateMediasByCategory()
      } else {
        updateMedias()
      }
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

  const mediaData = category ? mediasByCategory : medias

  return (
    <div>
      <div className="mb-4 grid grid-cols-3 gap-3 lg:grid-cols-8">
        {isLibrary
          ? mediaData?.pages.map((media) =>
              media?.medias.map((media) => (
                <div
                  key={media.name}
                  className="relative overflow-hidden rounded-[18px]"
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
              )),
            )
          : mediaData?.pages.map((media, i) =>
              media?.medias.map((media) => (
                <div key={i}>
                  <NextImage
                    key={media.id}
                    src={media.url}
                    alt={media.name}
                    fill
                    sizes="(max-width: 768px) 30vw,
                    (max-width: 1200px) 20vw,
                    33vw"
                    className="!relative aspect-[1/1] h-[500px] max-w-[unset] cursor-pointer rounded-sm border-2 border-muted/30 bg-muted/30 object-cover"
                    onClick={(
                      e: React.MouseEvent<HTMLImageElement, MouseEvent>,
                    ) => {
                      e.preventDefault()
                      if (selectMedia) selectMedia(media)
                      if (onSelect) onSelect()
                    }}
                  />
                </div>
              )),
            )}
      </div>
      {(hasNextPage || hasNextPageByCategory) && (
        <div ref={loadMoreRef}>
          <div className="text-center">
            <LoadingProgress />
          </div>
        </div>
      )}
    </div>
  )
}

export default MediaList
