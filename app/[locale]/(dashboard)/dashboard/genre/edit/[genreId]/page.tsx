import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import { notFound } from "next/navigation"

import env from "@/env"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

const EditGenreForm = dynamicFn(async () => {
  const EditGenreForm = await import("./form")
  return EditGenreForm
})

export async function generateMetadata(props: {
  params: Promise<{ genreId: string; locale: LanguageType }>
}): Promise<Metadata> {
  const params = await props.params
  const { genreId, locale } = params

  const genre = await api.genre.byId(genreId)

  return {
    title: "Edit Genre Dashboard",
    description: "Edit Genre Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/genre/edit/${genre?.id}`,
    },
    openGraph: {
      title: "Edit Genre Dashboard",
      description: "Edit Genre Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/genre/edit/${genre?.id}`,
      locale: locale,
    },
  }
}

interface EditGenreDashboardProps {
  params: Promise<{ genreId: string }>
}

export default async function EditGenreDashboard(
  props: EditGenreDashboardProps,
) {
  const { params } = props

  const { genreId } = await params

  const genre = await api.genre.byId(genreId)

  if (!genre) {
    notFound()
  }

  return (
    <div className="mb-[100px] mt-4 flex items-end justify-end">
      <div className="flex-1 space-y-4">
        <EditGenreForm genre={genre} />
      </div>
    </div>
  )
}
