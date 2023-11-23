import * as React from "react"

import env from "@/env"
import { DashboardUserContent } from "./content"

export const metadata = {
  title: "User Dashboard",
  description: "User Dashboard",
  alternates: {
    canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/user/`,
  },
}

export default function UserDashboardPage() {
  return <DashboardUserContent />
}
