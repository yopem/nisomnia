import * as React from "react"
import { notFound } from "next/navigation"

import { getCurrentSession } from "@nisomnia/auth"

import { DashboardSidebar } from "@/components/Dashboard"
import { DashboardContainer } from "@/components/Dashboard/client"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await getCurrentSession()

  if (!session?.user?.role?.includes("admin" || "author")) {
    return notFound()
  }

  return (
    <DashboardContainer sidebar={<DashboardSidebar session={session} />}>
      {children}
    </DashboardContainer>
  )
}
