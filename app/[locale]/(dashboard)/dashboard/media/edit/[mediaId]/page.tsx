import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import { notFound } from "next/navigation"

import env from "@/env.mjs"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

const EditMediaForm = dynamicFn(async () => {
  const EditMediaForm = await import("./form")
  return EditMediaForm
})

export async function generateMetadata(props: {
  params: Promise<{ mediaId: string; locale: LanguageType }>
}): Promise<Metadata> {
  const params = await props.params
  const { mediaId, locale } = params

  const media = await api.media.byId(mediaId)

  return {
    title: "Edit Media Dashboard",
    description: "Edit Media Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/media/edit/${media?.id}/`,
    },
    openGraph: {
      title: "Edit Media Dashboard",
      description: "Edit Media Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/media/edit/${media?.id}`,
      locale: locale,
    },
  }
}

export default async function MediasDashboard(props: {
  params: Promise<{ mediaId: string }>
}) {
  const params = await props.params
  const { mediaId } = params

  const media = await api.media.byId(mediaId)

  if (!media) {
    notFound()
  }

  return (
    <div className="mb-[100px] mt-4 flex items-end justify-end">
      <div className="flex-1 space-y-4">
        <EditMediaForm media={media} />
      </div>
    </div>
  )
}
