import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import { redirect } from "next/navigation"

import env from "@/env"
import type {
  SelectGenre,
  SelectMovie,
  SelectProductionCompany,
} from "@/lib/db/schema"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

const TranslateMovieForm = dynamicFn(async () => {
  const TranslateMovieForm = await import("./form")
  return TranslateMovieForm
})

interface TranslateMovieMetaDataProps {
  params: Promise<{
    movieTranslationId: string
    language: LanguageType
    locale: LanguageType
  }>
}

export async function generateMetadata(
  props: TranslateMovieMetaDataProps,
): Promise<Metadata> {
  const params = await props.params
  const { movieTranslationId, language, locale } = params

  const movieTranslation =
    await api.movie.movieTranslationById(movieTranslationId)

  return {
    title: "Translate Movie Dashboard",
    description: "Translate Movie Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/movie/translate/${language}/${movieTranslation?.id}/`,
    },
    openGraph: {
      title: "Translate Movie Dashboard",
      description: "Translate Movie Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/movie/translate/${language}/${movieTranslation?.id}`,
      locale: locale,
    },
  }
}

interface TranslateMovieDashboardProps {
  params: Promise<{
    movieTranslationId: string
    language: LanguageType
    initialMovieData?: Partial<
      SelectMovie & {
        genres: Pick<SelectGenre, "id" | "title">[]
        productionCompanies?: Pick<SelectProductionCompany, "id" | "name">[]
      }
    >
  }>
}

export default async function TranslateMovieDashboardPage(
  props: TranslateMovieDashboardProps,
) {
  const params = await props.params
  const { movieTranslationId, language } = params

  const movieTranslation =
    await api.movie.movieTranslationById(movieTranslationId)

  const selectedMovie = movieTranslation?.movies?.find(
    (movie) => movie.language !== language,
  )

  const otherLanguageMovie = movieTranslation?.movies?.find(
    (movie) => movie.language === language,
  )

  if (otherLanguageMovie) {
    redirect(`/dashboard/movie/edit/${otherLanguageMovie.id}`)
  }

  return (
    <TranslateMovieForm
      movieTranslationId={movieTranslationId}
      language={language}
      // @ts-expect-error FIX: drizzle join return string | null
      initialMovieData={selectedMovie}
    />
  )
}
