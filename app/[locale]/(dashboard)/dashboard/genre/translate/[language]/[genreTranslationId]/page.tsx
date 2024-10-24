import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import { redirect } from "next/navigation"

import env from "@/env"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

const TranslateGenreForm = dynamicFn(async () => {
  const TranslateGenreForm = await import("./form")
  return TranslateGenreForm
})

interface TranslateGenreMetaDataProps {
  params: Promise<{
    genreTranslationId: string
    language: LanguageType
    locale: LanguageType
  }>
}

export async function generateMetadata(
  props: TranslateGenreMetaDataProps,
): Promise<Metadata> {
  const params = await props.params
  const { genreTranslationId, language, locale } = params

  const genreTranslation =
    await api.genre.genreTranslationById(genreTranslationId)

  return {
    title: "Translate Genre Dashboard",
    description: "Translate Genre Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/genre/translate/${language}/${genreTranslation?.id}/`,
    },
    openGraph: {
      title: "Translate Genre Dashboard",
      description: "Translate Genre Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/genre/translate/${language}/${genreTranslation?.id}`,
      locale: locale,
    },
  }
}

interface TranslateGenreDashboardProps {
  params: Promise<{
    genreTranslationId: string
    language: LanguageType
    tmdbId: string
  }>
}

export default async function TranslateGenreDashboardPage(
  props: TranslateGenreDashboardProps,
) {
  const params = await props.params
  const { genreTranslationId, language } = params

  const genreTranslation =
    await api.genre.genreTranslationById(genreTranslationId)

  const otherLanguageGenre = genreTranslation?.genres.find(
    (genre) => genre.language === language,
  )

  if (otherLanguageGenre) {
    redirect(`/dashboard/genre/edit/${otherLanguageGenre.id}`)
  }

  const beforeTranslatedGenre = genreTranslation?.genres.find(
    (genre) => genre.language !== language,
  )

  return (
    <TranslateGenreForm
      genreTranslationId={genreTranslationId}
      language={language}
      tmdbId={beforeTranslatedGenre?.tmdbId!}
    />
  )
}
