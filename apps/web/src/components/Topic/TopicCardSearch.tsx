import * as React from "react"
import NextLink from "next/link"

import type { Media as MediaProps, Topic as TopicProps } from "@nisomnia/db"
import { Icon } from "@nisomnia/ui/next"

import { Image } from "@/components/Image"

type TopicDataProps = Pick<TopicProps, "title" | "slug"> & {
  featured_image?: Pick<MediaProps, "url"> | null
}

interface TopicCardSearchProps {
  topic: TopicDataProps
}

export const TopicCardSearch: React.FunctionComponent<TopicCardSearchProps> = (
  props,
) => {
  const { topic } = props

  const { title, slug, featured_image } = topic

  return (
    <NextLink
      aria-label={title}
      href={`/topic/${slug}`}
      className="mb-2 w-full"
    >
      <div className="flex flex-row hover:bg-accent">
        <div className="relative aspect-[1/1] h-[20px] w-auto max-w-[unset] overflow-hidden rounded-md">
          {featured_image ? (
            <Image
              src={featured_image?.url}
              className="object-cover"
              alt={title}
            />
          ) : (
            <Icon.Topic className="h-5 w-5" />
          )}
        </div>
        <div className="ml-2 w-3/4">
          <h3 className="mb-2 text-lg font-medium">{title}</h3>
        </div>
      </div>
    </NextLink>
  )
}
