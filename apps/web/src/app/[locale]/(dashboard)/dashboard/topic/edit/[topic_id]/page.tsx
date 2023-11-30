import * as React from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import type { LanguageType } from "@nisomnia/db"

import env from "@/env"
import { api } from "@/lib/trpc/server"

const EditTopicForm = React.lazy(async () => {
  const { EditTopicForm } = await import("./form")
  return { default: EditTopicForm }
})

export async function generateMetadata({
  params,
}: {
  params: { topic_id: string; locale: LanguageType }
}): Promise<Metadata> {
  const { topic_id, locale } = params

  const topic = await api.topic.byId.query(topic_id)

  return {
    title: "Edit Topic Dashboard",
    description: "Edit Topic Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/topic/edit/${topic?.id}`,
    },
    openGraph: {
      title: "Edit Topic Dashboard",
      description: "Edit Topic Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/topic/edit/${topic?.id}`,
      locale: locale,
    },
  }
}

interface EditTopicDashboardProps {
  params: { topic_id: string }
}

export default async function EditTopicDashboard(
  props: EditTopicDashboardProps,
) {
  const { params } = props
  const { topic_id } = params

  const topic = await api.topic.byId.query(topic_id)

  if (!topic) {
    notFound()
  }

  return (
    <div className="mb-[100px] mt-4 flex items-end justify-end">
      <div className="flex-1 space-y-4">
        <EditTopicForm topic={topic} />
      </div>
    </div>
  )
}
