"use client"

import React from "react"

import env from "@/env"

export const LoadAdsense = () => {
  const [loaded, setLoaded] = React.useState<boolean>(false)

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop

      if ((scrollTop !== 0 && !loaded) || (scrollTop !== 0 && !loaded)) {
        loadScript()
        setLoaded(true)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [loaded])

  const loadScript = () => {
    const script = document.createElement("script")
    script.type = "text/javascript"
    script.async = true
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.jsclient=${env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`

    const firstScript = document.getElementsByTagName("script")[0]
    firstScript?.parentNode?.insertBefore(script, firstScript)
  }

  return <></>
}
