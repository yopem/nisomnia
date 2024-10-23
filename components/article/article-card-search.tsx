// TODO: add falback image

import * as React from "react"
import NextLink from "next/link"

import Image from "@/components/image"
import type { SelectArticle } from "@/lib/db/schema"

interface ArticleCardSearchProps {
  article: Pick<SelectArticle, "title" | "featuredImage" | "slug">
}

const ArticleCardSearch: React.FC<ArticleCardSearchProps> = (props) => {
  const { article } = props

  const { title, slug, featuredImage } = article

  return (
    <NextLink
      aria-label={title}
      href={`/article/${slug}`}
      className="mb-2 w-full"
    >
      <div className="flex flex-row rounded-xl p-3 hover:bg-accent">
        <div className="relative aspect-[1/1] h-[50px] w-auto max-w-[unset] overflow-hidden rounded-md">
          <Image src={featuredImage} className="object-cover" alt={title} />
        </div>
        <div className="ml-2 w-3/4">
          <h3 className="mb-2 text-sm font-medium lg:text-lg">{title}</h3>
        </div>
      </div>
    </NextLink>
  )
}

export default ArticleCardSearch
