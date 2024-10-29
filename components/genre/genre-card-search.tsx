import * as React from "react"
import NextLink from "next/link"

import Image from "@/components/image"
import { Icon } from "@/components/ui/icon"
import type { SelectGenre } from "@/lib/db/schema"

type GenreDataProps = Pick<
  SelectGenre,
  "id" | "title" | "slug" | "featuredImage"
>

interface GenreCardSearchProps {
  genre: GenreDataProps
  isDashboard?: boolean
  onClick?: () => void
}

const GenreCardSearch: React.FC<GenreCardSearchProps> = (props) => {
  const { genre, isDashboard, onClick } = props

  const { id, title, slug, featuredImage } = genre

  return (
    <NextLink
      aria-label={title}
      href={isDashboard ? `/dashboard/genre/edit/${id}` : `/genre/${slug}`}
      className="mb-2 w-full"
      onClick={onClick}
    >
      <div className="flex flex-row rounded-xl p-1 hover:bg-accent">
        <div className="relative aspect-[1/1] h-[50px] w-auto max-w-[unset] overflow-hidden p-3">
          {featuredImage ? (
            <Image
              src={featuredImage}
              className="rounded-xl object-cover"
              alt={title}
            />
          ) : (
            <Icon.Genre className="size-4" />
          )}
        </div>
        <div className="ml-1 w-3/4">
          <h3 className="mt-2 text-sm font-medium lg:text-lg">{title}</h3>
        </div>
      </div>
    </NextLink>
  )
}

export default GenreCardSearch
