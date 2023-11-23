import * as React from "react"

import env from "@/env"
import { UploadMediaForm } from "./form"

export const metadata = {
  title: "Upload Media Dashboard",
  description: "Upload Media Dashboard",
  alternates: {
    canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/media/new/`,
  },
}

export default function UploadMediasDashboardPage() {
  return <UploadMediaForm />
}
