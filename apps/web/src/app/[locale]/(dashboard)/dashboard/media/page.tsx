import * as React from "react"
import env from "env"

import { MediaLibraryDashboard } from "./content"

export const metadata = {
  title: "Media Dashboard",
  description: "Media Dashboard",
  alternates: {
    canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/media/`,
  },
}

export default function MediasDashboard() {
  return <MediaLibraryDashboard />
}
