// TODO: add falback image

import * as React from "react"
import NextLink from "next/link"

import Image from "@/components/image"
import type { SelectArticle } from "@/lib/db/schema"

interface ArticleCardSearchProps {
  article: Pick<SelectArticle, "id" | "title" | "featuredImage" | "slug">
  isDashboard?: boolean
}

const ArticleCardSearch: React.FC<ArticleCardSearchProps> = (props) => {
  const { article, isDashboard } = props

  const { id, title, slug, featuredImage } = article

  return (
    <NextLink
      aria-label={title}
      href={isDashboard ? `/dashboard/article/edit/${id}` : `/article/${slug}`}
      className="mb-2 w-full"
    >
      <div className="flex flex-row rounded-xl p-3 hover:bg-accent">
        <div className="relative aspect-[1/1] h-[50px] w-auto max-w-[unset] overflow-hidden">
          <Image
            src={featuredImage}
            className="rounded-xl object-cover"
            alt={title}
          />
        </div>
        <div className="ml-2 w-3/4">
          <h3 className="mb-2 text-sm font-medium lg:text-lg">{title}</h3>
        </div>
      </div>
    </NextLink>
  )
}

export default ArticleCardSearch
