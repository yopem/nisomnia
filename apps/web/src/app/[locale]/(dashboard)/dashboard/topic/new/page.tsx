import * as React from "react"
import env from "env"

import { CreateTopicForm } from "./form"

export const metadata = {
  title: "Create Topic Dashboard",
  description: "Create Topic Dashboard",
  alternates: {
    canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/topic/new/`,
  },
}

export default function CreateTopicDashboard() {
  return (
    <div className="mb-[100px] mt-4 flex items-end justify-end">
      <div className="flex-1 space-y-4">
        <CreateTopicForm />
      </div>
    </div>
  )
}
