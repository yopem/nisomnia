import * as React from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import env from "@/env"
import { api } from "@/lib/trpc/server"
import { EditTopicForm } from "./form"

export async function generateMetadata({
  params,
}: {
  params: { topic_id: string }
}): Promise<Metadata> {
  const { topic_id } = params

  const topic = await api.topic.byId.query(topic_id)

  return {
    title: "Edit Topic Dashboard",
    description: "Edit Topic Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/topic/edit/${topic?.id}`,
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
