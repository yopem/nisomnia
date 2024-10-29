import * as React from "react"
import NextLink from "next/link"

import Image from "@/components/image"
import { Icon } from "@/components/ui/icon"
import type { SelectMovie } from "@/lib/db/schema"

interface MovieCardSearchProps {
  movie: Pick<SelectMovie, "id" | "title" | "poster" | "slug">
  isDashboard?: boolean
  onClick?: () => void
}

const MovieCardSearch: React.FC<MovieCardSearchProps> = (props) => {
  const { movie, isDashboard, onClick } = props

  const { id, title, slug, poster } = movie

  return (
    <NextLink
      aria-label={title}
      href={isDashboard ? `/dashboard/movie/edit/${id}` : `/movie/${slug}`}
      onClick={onClick}
      className="mb-2 w-full"
    >
      <div className="flex flex-row rounded-xl p-3 hover:bg-accent">
        <div className="relative aspect-[1/1] h-[50px] w-auto max-w-[unset] overflow-hidden">
          {poster ? (
            <Image
              src={poster}
              className="rounded-xl object-cover"
              alt={title}
            />
          ) : (
            <Icon.Movie className="size-4" />
          )}
        </div>
        <div className="ml-2 w-3/4">
          <h3 className="mb-2 text-sm font-medium lg:text-lg">{title}</h3>
        </div>
      </div>
    </NextLink>
  )
}

export default MovieCardSearch
