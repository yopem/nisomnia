import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import { notFound } from "next/navigation"

import env from "@/env"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

const EditMovieForm = dynamicFn(async () => {
  const EditMovieForm = await import("./form")
  return EditMovieForm
})

export async function generateMetadata(props: {
  params: Promise<{ movieId: string; locale: LanguageType }>
}): Promise<Metadata> {
  const params = await props.params
  const { movieId, locale } = params

  const movie = await api.movie.byId(movieId)

  return {
    title: "Edit Movie Dashboard",
    description: "Edit Movie Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/movie/edit/${movie?.id}/`,
    },
    openGraph: {
      title: "Edit Movie Dashboard",
      description: "Edit Movie Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/movie/edit/${movie?.id}`,
      locale: locale,
    },
  }
}

interface EditMovieDashboardProps {
  params: Promise<{ movieId: string }>
}

export default async function EditMovieDashboard(
  props: EditMovieDashboardProps,
) {
  const { params } = props

  const { movieId } = await params

  const movie = await api.movie.byId(movieId)

  if (!movie) {
    notFound()
  }

  return (
    <div className="mb-[100px] mt-4 flex items-end justify-end">
      <div className="flex-1 space-y-4">
        {/* @ts-expect-error FIX: drizzle join return string | null */}
        <EditMovieForm movie={movie} />
      </div>
    </div>
  )
}
