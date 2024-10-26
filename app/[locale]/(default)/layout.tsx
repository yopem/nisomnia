import * as React from "react"

import AdsenseScript from "@/components/ad/adsense-script"
import GlobalContainer from "@/components/layout/global-container"
import AnalyticScripts from "@/components/script/analytic-scripts"
import { getCurrentSession } from "@/lib/auth/session"
import type { LanguageType } from "@/lib/validation/language"

interface DefaultLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: LanguageType }>
}

export default async function DefaultLayout(props: DefaultLayoutProps) {
  const { params, children } = props

  const { locale } = await params

  const { user } = await getCurrentSession()

  return (
    <>
      <AdsenseScript />
      <AnalyticScripts />
      <GlobalContainer user={user} locale={locale}>
        {children}
      </GlobalContainer>
    </>
  )
}
