"use client"

import * as React from "react"
import { usePathname, useSearchParams } from "next/navigation"

import { Skeleton } from "@nisomnia/ui"

interface AdsenseProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const Adsense: React.FunctionComponent<AdsenseProps> = (props) => {
  const { children } = props

  const [loading, setLoading] = React.useState<boolean>(true)

  const pathname = usePathname()
  const searchParams = useSearchParams()

  React.useEffect(() => {
    setLoading(true)

    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      setLoading(false)
    } catch (e) {
      console.log(e)
    }
  }, [pathname, searchParams])

  return (
    <>
      {loading ? (
        <Skeleton className="mb-4 h-72 rounded-xl" />
      ) : (
        <>{children}</>
      )}
    </>
  )
}
