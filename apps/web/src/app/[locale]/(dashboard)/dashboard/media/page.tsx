import * as React from "react"
import type { Metadata } from "next"
import dynamic from "next/dynamic"

import type { LanguageType } from "@nisomnia/db"

import env from "@/env"

const MediaLibraryContent = dynamic(async () => {
  const { MediaLibraryContent } = await import("./content")
  return { default: MediaLibraryContent }
})

export function generateMetadata({
  params,
}: {
  params: { locale: LanguageType }
}): Metadata {
  const { locale } = params

  return {
    title: "Media Dashboard",
    description: "Media Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/media/`,
    },
    openGraph: {
      title: "Media Dashboard",
      description: "Media Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/media/`,
      locale: locale,
    },
  }
}

export default function MediasDashboard() {
  return <MediaLibraryContent />
}
