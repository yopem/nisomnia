import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"

import env from "@/env"
import type { LanguageType } from "@/lib/validation/language"

const DashboardGenreContent = dynamicFn(async () => {
  const DashboardGenreContent = await import("./content")
  return DashboardGenreContent
})

export async function generateMetadata(props: {
  params: Promise<{ locale: LanguageType }>
}): Promise<Metadata> {
  const params = await props.params
  const { locale } = params

  return {
    title: "Genre Dashboard",
    description: "Genre Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/genre/`,
    },
    openGraph: {
      title: "Genre Dashboard",
      description: "Genre Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/genre/`,
      locale: locale,
    },
  }
}

export default function DashboardGenrePage() {
  return <DashboardGenreContent />
}
