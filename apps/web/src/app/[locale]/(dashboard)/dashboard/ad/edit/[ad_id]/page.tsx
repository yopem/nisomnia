import * as React from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import type { LanguageType } from "@nisomnia/db"

import env from "@/env"
import { api } from "@/lib/trpc/server"

const EditAdForm = React.lazy(async () => {
  const { EditAdForm } = await import("./form")
  return { default: EditAdForm }
})

export async function generateMetadata({
  params,
}: {
  params: { ad_id: string; locale: LanguageType }
}): Promise<Metadata> {
  const { ad_id, locale } = params

  const ad = await api.ad.byId.query(ad_id)

  return {
    title: "Edit Ad Dashboard",
    description: "Edit Ad Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/ad/edit/${ad?.id}`,
    },
    openGraph: {
      title: "Edit Ad Dashboard",
      description: "Edit Ad Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/ad/edit/${ad?.id}`,
      locale: locale,
    },
  }
}

interface EditAdDashboardProps {
  params: { ad_id: string }
}

export default async function EditAdDashboard(props: EditAdDashboardProps) {
  const { params } = props
  const { ad_id } = params

  const ad = await api.ad.byId.query(ad_id)

  if (!ad) {
    notFound()
  }

  return (
    <div className="mb-[100px] mt-4 flex items-end justify-end">
      <div className="flex-1 space-y-4">
        <EditAdForm ad={ad} />
      </div>
    </div>
  )
}
