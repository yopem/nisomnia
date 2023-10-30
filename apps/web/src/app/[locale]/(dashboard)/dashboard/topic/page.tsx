import * as React from "react"
import env from "env"

import { DashboardTopicContent } from "./content"

export const metadata = {
  title: "Topic Dashboard",
  description: "Topic Dashboard",
  alternates: {
    canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/topic/`,
  },
}

export default function TopicDashboardPage() {
  return <DashboardTopicContent />
}
