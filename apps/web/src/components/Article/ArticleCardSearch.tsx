import * as React from "react"
import NextLink from "next/link"

import type { Article as ArticleProps, Media as MediaProps } from "@nisomnia/db"

import { Image } from "@/components/Image"

type ArticleDataProps = Pick<ArticleProps, "title" | "slug"> & {
  featured_image: Pick<MediaProps, "url">
}

interface ArticleCardSearchProps {
  article: ArticleDataProps
}

export const ArticleCardSearch: React.FunctionComponent<
  ArticleCardSearchProps
> = (props) => {
  const { article } = props

  const { title, slug, featured_image } = article

  return (
    <NextLink
      aria-label={title}
      href={`/article/${slug}`}
      className="mb-2 w-full"
    >
      <div className="flex flex-row hover:bg-accent">
        <div className="relative aspect-[1/1] h-[50px] w-auto max-w-[unset] overflow-hidden rounded-md">
          <Image
            src={featured_image.url}
            className="object-cover"
            alt={title}
          />
        </div>
        <div className="ml-2 w-3/4">
          <h3 className="mb-2 text-lg font-medium">{title}</h3>
        </div>
      </div>
    </NextLink>
  )
}
