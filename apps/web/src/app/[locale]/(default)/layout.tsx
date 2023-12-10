import * as React from "react"

import { getCurrentUser } from "@nisomnia/auth"
import type { LanguageType } from "@nisomnia/db"

import { Container } from "@/components/Layout/Container"
import { Footer } from "@/components/Layout/Footer"

const TopNav = React.lazy(async () => {
  const { TopNav } = await import("@/components/Layout/TopNav")
  return { default: TopNav }
})

interface DefaultLayoutProps {
  params: {
    locale: LanguageType
  }
  children: React.ReactNode
}

export default async function DefaultLayout({
  params,
  children,
}: DefaultLayoutProps) {
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
