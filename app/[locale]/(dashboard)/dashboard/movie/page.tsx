import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"

import env from "@/env"
import type { LanguageType } from "@/lib/validation/language"

const DashboardMovieContent = dynamicFn(async () => {
  const DashboardMovieContent = await import("./content")
  return DashboardMovieContent
})

export async function generateMetadata(props: {
  params: Promise<{ locale: LanguageType }>
}): Promise<Metadata> {
  const params = await props.params
  const { locale } = params

  return {
    title: "Movie Dashboard",
    description: "Movie Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/movie/`,
    },
    openGraph: {
      title: "Movie Dashboard",
      description: "Movie Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/movie/`,
      locale: locale,
    },
  }
}

export default function DashboardMoviePage() {
  return <DashboardMovieContent />
}
