import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BreadcrumbJsonLd, SiteLinksSearchBoxJsonLd } from "next-seo"

import Image from "@/components/image"
import MovieJsonLd from "@/components/json-ld/movie"
import env from "@/env"
import { api } from "@/lib/trpc/server"
import { getRandomNumber } from "@/lib/utils/random"

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { params } = props
  const { slug } = await params

  const movie = await api.movie.bySlug(slug)

  return {
    title: movie?.metaTitle ?? movie?.title,
    description:
      movie?.metaDescription ?? movie?.overview ?? `Overview ${movie?.title}`,
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/movie/${movie?.slug}`,
    },
    openGraph: {
      title: movie?.metaTitle ?? movie?.title,
      description:
        movie?.metaDescription ?? movie?.overview ?? `Overview ${movie?.title}`,
      images: [
        {
          url: movie?.poster!,
          width: 1280,
          height: 720,
        },
        {
          url: movie?.backdrop!,
          width: 600,
          height: 900,
        },
      ],
      url: `${env.NEXT_PUBLIC_SITE_URL}/movie/${movie?.slug}`,
    },
    twitter: {
      title: env.NEXT_PUBLIC_X_USERNAME,
      card: "summary_large_image",
      images: [
        {
          url: movie?.backdrop!,
          width: 1280,
          height: 720,
        },
      ],
    },
    // icons: {
    //   other: [
    //     {
    //       rel: "amphtml",
    //       url: `${env.NEXT_PUBLIC_SITE_URL}/movie/${movie.slug}/amp`,
    //     },
    //   ],
    // },
  }
}

interface MovieSlugPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function MovieSlugPage(props: MovieSlugPageProps) {
  const { params } = props
  const { slug } = await params

  const randomContentRating = getRandomNumber(5, 10)
  const randomReviewCount = getRandomNumber(63, 1000)
  const randomRatingValue = getRandomNumber(43, 100)
  const randomRatingCount = getRandomNumber(52, 1000)

  const movie = await api.movie.bySlug(slug)

  if (!movie) {
    return notFound()
  }

  return (
    <>
      <BreadcrumbJsonLd
        useAppDir={true}
        itemListElements={[
          {
            position: 1,
            name: env.NEXT_PUBLIC_DOMAIN,
            item: env.NEXT_PUBLIC_SITE_URL,
          },
          {
            position: 2,
            name: "Movie",
            item: `${env.NEXT_PUBLIC_SITE_URL}/movie`,
          },
          {
            position: 3,
            name: movie?.genres[0]?.title,
            item: `${env.NEXT_PUBLIC_SITE_URL}/movie/genre/${movie?.genres[0]?.slug}`,
          },
          {
            position: 4,
            name: movie?.metaTitle ?? movie?.title,
            item: `${env.NEXT_PUBLIC_SITE_URL}/movie/${movie?.slug}`,
          },
        ]}
      />
      <SiteLinksSearchBoxJsonLd
        useAppDir={true}
        url={env.NEXT_PUBLIC_SITE_URL}
        potentialActions={[
          {
            target: `${env.NEXT_PUBLIC_SITE_URL}/search?q`,
            queryInput: "search_term_string",
          },
        ]}
      />
      <MovieJsonLd
        useAppDir
        name={movie.title}
        contentRating={randomContentRating}
        duration={movie.runtime?.toString() ?? ""}
        dateCreated={movie?.updatedAt?.toString()!}
        description={movie?.overview! ?? `Overview ${movie.title}`}
        image={movie.poster ?? movie.backdrop ?? ""}
        // authorName="Nisomnia"
        // directorName={movie.credits.crew.find((crew) => crew.job === "Director")?.name!}
        // actors={[]}
        genreName={movie.genres.map((genre) => genre.title!)}
        // offers={[]}
        countryOfOrigin={movie.originCountry ?? ""}
        aggregateRating={{
          ratingValue: randomRatingValue.toString(),
          reviewCount: randomReviewCount.toString(),
          ratingCount: randomRatingCount.toString(),
          bestRating: "100",
          worstRating: "1",
        }}
      />
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1>{movie.title}</h1>
        {movie.poster && (
          <Image
            src={movie.poster}
            alt={movie.title}
            className="!relative h-auto !w-[200px] rounded-xl"
          />
        )}
        {movie.overview && <p>{movie.overview}</p>}
      </div>
    </>
  )
}
