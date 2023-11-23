import * as React from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import env from "@/env"
import { api } from "@/lib/trpc/server"
import { EditAdForm } from "./form"

export async function generateMetadata({
  params,
}: {
  params: { ad_id: string }
}): Promise<Metadata> {
  const { ad_id } = params

  const ad = await api.ad.byId.query(ad_id)

  return {
    title: "Edit Ad Dashboard",
    description: "Edit Ad Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/ad/edit/${ad?.id}`,
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
