import * as React from "react"
import env from "env"

import { DashboardAdContent } from "./content"

export const metadata = {
  title: "Ad Dashboard",
  description: "Ad Dashboard",
  alternates: {
    canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/ad/`,
  },
}

export default function AdDashboardPage() {
  return <DashboardAdContent />
}
