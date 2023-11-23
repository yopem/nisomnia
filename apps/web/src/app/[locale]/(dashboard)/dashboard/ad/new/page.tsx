import * as React from "react"

import env from "@/env"
import { CreateAdForm } from "./form"

export const metadata = {
  title: "Create Ad Dashboard",
  description: "Create Ad Dashboard",
  alternates: {
    canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/ad/new/`,
  },
}

export default function CreateAdDashboard() {
  return (
    <div className="mb-[100px] mt-4 flex items-end justify-end">
      <div className="flex-1 space-y-4">
        <CreateAdForm />
      </div>
    </div>
  )
}
