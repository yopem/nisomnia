import * as React from "react"

import type { LanguageType } from "@nisomnia/db"

import { Container, Footer } from "@/components/Layout"
import { TopNav } from "@/components/Layout/client"

interface UserLayoutProps {
  children: React.ReactNode
  params: {
    locale: LanguageType
  }
}

export default function UserLayout({ children, params }: UserLayoutProps) {
  const { locale } = params

  return (
    <>
      <TopNav locale={locale} />
      <Container className="mt-20 min-h-screen px-2 lg:px-80">
        {children}
      </Container>
      <Footer />
    </>
  )
}
