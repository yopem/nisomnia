import * as React from "react"
import NextLink from "next/link"

import Image from "@/components/image"
import { Icon } from "@/components/ui/icon"
import type { SelectMovie } from "@/lib/db/schema"
import { cn } from "@/lib/utils"

interface MovieCardVerticalProps extends React.HTMLAttributes<HTMLDivElement> {
  movie: Pick<SelectMovie, "title" | "poster" | "slug">
}

const MovieCardVertical: React.FC<MovieCardVerticalProps> = (props) => {
  const { movie, className } = props

  const { poster, slug, title } = movie

  return (
    <div className="max-w-sm">
      <NextLink aria-label={title} href={`/movie/${slug}`}>
        {poster ? (
          <Image
            className="!relative !h-[200px] !w-[150px] overflow-hidden rounded-lg object-cover"
            sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 33vw"
            src={poster}
            alt={title}
          />
        ) : (
          <Icon.BrokenImage className="!h-[200px] !w-[150px] object-cover text-center" />
        )}
      </NextLink>
      <div className="px-2 py-3">
        <NextLink aria-label={title} href={`/movie/${slug}/`}>
          <h3
            className={cn(
              "mb-2 line-clamp-3 text-base font-semibold hover:text-primary/80 md:line-clamp-4 md:font-bold",
              className,
            )}
          >
            {title}
          </h3>
        </NextLink>
      </div>
    </div>
  )
}

export default MovieCardVertical
