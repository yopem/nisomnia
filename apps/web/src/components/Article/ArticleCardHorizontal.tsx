import * as React from "react"
import NextLink from "next/link"

import type { Article as ArticleProps, Media as MediaProps } from "@nisomnia/db"

import { Image } from "@/components/Image"

export interface ArticleCardHorizontalProps {
  article: Pick<ArticleProps, "title" | "slug" | "excerpt"> & {
    featured_image: Pick<MediaProps, "url">
  }
}

export const ArticleCardHorizontal: React.FunctionComponent<
  ArticleCardHorizontalProps
> = (props) => {
  const { article } = props
  const { featured_image, slug, excerpt, title } = article

  return (
    <div className="mb-[30px] flex grow border-separate flex-row rounded-lg lg:flex-col">
      <div className="relative flex w-full flex-row justify-between lg:justify-start">
        <NextLink
          href={`/article/${slug}`}
          className="order-2 md:order-1 md:mr-[30px]"
        >
          <div className="relative h-[90px] min-h-[90px] w-[125px] min-w-[125px] md:h-[193px] md:min-h-full md:w-[270px] md:min-w-[270px]">
            <Image
              className="rounded-lg object-cover"
              fill
              sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 33vw"
              src={featured_image.url}
              alt={title}
            />
          </div>
        </NextLink>
        <div className="order-1 mr-3 flex flex-col md:order-2 md:mr-[unset]">
          <NextLink href={`/article/${slug}/`}>
            <h3 className="line-clamp-3 text-lg font-semibold hover:text-primary/90 md:text-2xl md:font-bold">
              {title}
            </h3>
            <div className="hidden text-sm text-foreground/70 md:my-2.5 md:line-clamp-4">
              {excerpt}
            </div>
          </NextLink>
        </div>
      </div>
    </div>
  )
}
