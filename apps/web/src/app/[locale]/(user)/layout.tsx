import * as React from "react"
import dynamic from "next/dynamic"

import { getCurrentUser } from "@nisomnia/auth"
import type { LanguageType } from "@nisomnia/db"

import { Container, Footer } from "@/components/Layout"

const TopNav = dynamic(async () => {
  const { TopNav } = await import("@/components/Layout/client")
  return { default: TopNav }
})

interface UserLayoutProps {
  children: React.ReactNode
  params: {
    locale: LanguageType
  }
}

export default async function UserLayout({
  children,
  params,
}: UserLayoutProps) {
  const { locale } = params

  const user = await getCurrentUser()

  return (
    <>
      <TopNav locale={locale} user={user!} />
      <Container className="mt-20 min-h-screen px-2 lg:px-80">
        {children}
      </Container>
      <Footer />
    </>
  )
}
