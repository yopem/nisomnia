import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"

import env from "@/env"
import type { LanguageType } from "@/lib/validation/language"

const CreateMovieForm = dynamicFn(async () => {
  const CreateMovieForm = await import("./form")
  return CreateMovieForm
})

export async function generateMetadata(props: {
  params: Promise<{ locale: LanguageType }>
}): Promise<Metadata> {
  const params = await props.params
  const { locale } = params

  return {
    title: "Create Movie Dashboard",
    description: "Create Movie Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/movie/new`,
    },
    openGraph: {
      title: "Create Movie Dashboard",
      description: "Create Movie Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/movie/new`,
      locale: locale,
    },
  }
}

export default function CreateMovieDashboard() {
  return (
    <div className="mb-[100px] mt-4 flex items-end justify-end">
      <div className="flex-1 space-y-4">
        <CreateMovieForm />
      </div>
    </div>
  )
}
