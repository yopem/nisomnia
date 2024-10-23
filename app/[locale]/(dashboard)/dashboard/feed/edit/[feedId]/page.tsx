import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import { notFound } from "next/navigation"

import env from "@/env"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

const EditFeedForm = dynamicFn(async () => {
  const EditFeedForm = await import("./form")
  return EditFeedForm
})

export async function generateMetadata(props: {
  params: Promise<{ feedId: string; locale: LanguageType }>
}): Promise<Metadata> {
  const params = await props.params
  const { feedId, locale } = params

  const feed = await api.feed.byId(feedId)

  return {
    title: "Edit Feed Dashboard",
    description: "Edit Feed Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/feed/edit/${feed?.id}/`,
    },
    openGraph: {
      title: "Edit Feed Dashboard",
      description: "Edit Feed Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/feed/edit/${feed?.id}`,
      locale: locale,
    },
  }
}

interface EditFeedDashboardProps {
  params: Promise<{ feedId: string }>
}

export default async function EditFeedDashboard(props: EditFeedDashboardProps) {
  const { params } = props

  const { feedId } = await params

  const feed = await api.feed.byId(feedId)

  if (!feed) {
    notFound()
  }

  return (
    <div className="mb-[100px] mt-4 flex items-end justify-end">
      <div className="flex-1 space-y-4">
        {/* @ts-expect-error FIX: drizzle join return string | nul */}
        <EditFeedForm feed={feed} />
      </div>
    </div>
  )
}
