import * as React from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import type { LanguageType } from "@nisomnia/db"

import env from "@/env"
import { api } from "@/lib/trpc/server"
import { EditMediaForm } from "./form"

export async function generateMetadata({
  params,
}: {
  params: { media_id: string; locale: LanguageType }
}): Promise<Metadata> {
  const { media_id, locale } = params

  const media = await api.media.byId.query(media_id)

  return {
    title: "Edit Media Dashboard",
    description: "Edit Media Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/media/edit/${media?.id}`,
    },
    openGraph: {
      title: "Edit Media Dashboard",
      description: "Edit Media Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/media/edit/${media?.id}`,
      locale: locale,
    },
  }
}

export default async function MediasDashboard({
  params,
}: {
  params: { media_id: string }
}) {
  const { media_id } = params

  const media = await api.media.byId.query(media_id)

  if (!media) {
    notFound()
  }

  return <EditMediaForm media={media} />
}
