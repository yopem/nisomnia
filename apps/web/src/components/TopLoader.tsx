"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import NextTopLoader from "nextjs-toploader"
import NProgress from "nprogress"

export const TopLoader: React.FunctionComponent = () => {
  const router = useRouter()
  const pathname = usePathname()

  React.useEffect(() => {
    NProgress.done()
  }, [pathname, router])

  return (
    <NextTopLoader
      color="#000"
      initialPosition={0.08}
      crawlSpeed={200}
      height={3}
      crawl={true}
      showSpinner={false}
      easing="ease"
      speed={200}
      shadow="0 0 10px #000,0 0 5px #000"
    />
  )
}
