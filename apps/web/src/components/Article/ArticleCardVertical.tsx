import * as React from "react"
import NextLink from "next/link"

import type { Article as ArticleProps, Media as MediaProps } from "@nisomnia/db"

import { Image } from "@/components/Image"

interface ArticleCardVerticalProps {
  article: Pick<ArticleProps, "slug" | "title"> & {
    featured_image?: Pick<MediaProps, "url">
  }
}

export const ArticleCardVertical: React.FunctionComponent<
  ArticleCardVerticalProps
> = (props) => {
  const { article } = props

  const { featured_image, slug, title } = article

  return (
    <article className="max-w-sm">
      <NextLink href={`/article/${slug}`}>
        <Image
          className="!relative h-[200px] w-full overflow-hidden rounded-lg object-cover"
          sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 33vw"
          src={featured_image?.url!}
          alt={title}
        />
      </NextLink>
      <div className="px-2 py-3">
        <NextLink href={`/article/${slug}/`}>
          <h3 className="mb-2 line-clamp-3 text-xl font-semibold hover:text-primary/80 md:line-clamp-4 md:font-bold">
            {title}
          </h3>
        </NextLink>
      </div>
    </article>
  )
}
