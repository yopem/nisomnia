"use client"

import * as React from "react"
import { usePathname, useSearchParams } from "next/navigation"
import Script from "next/script"

import env from "@/env"

const AdsenseScript = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [hasScrolled, setHasScrolled] = React.useState<boolean>(false)

  const handleAdLoad = () => {
    try {
      const insElements = Array.from(
        document.querySelectorAll("ins.manual-adsense"),
      )
      const insWithoutIframe = insElements.filter(
        (ins) => !ins.querySelector("iframe"),
      )
      if (!hasScrolled && insWithoutIframe.length > 0) {
        if (window.adsbygoogle) {
          setHasScrolled(true)
          insWithoutIframe.forEach((el) => {
            if (!el.querySelector("iframe")) {
              ;(window.adsbygoogle = window.adsbygoogle || []).push({})
            }
          })
        }
      }
    } catch (err) {
      console.log("Err", err)
    }
  }

  const handleAdScroll = () => {
    const insElements = Array.from(
      document.querySelectorAll("ins.manual-adsense"),
    )
    const insWithoutIframe = insElements.filter(
      (ins) => !ins.querySelector("iframe"),
    )
    if (!hasScrolled && insWithoutIframe.length > 0) {
      if (window.adsbygoogle) {
        setHasScrolled(true)
        insWithoutIframe.forEach((el) => {
          if (!el.querySelector("iframe")) {
            ;(window.adsbygoogle = window.adsbygoogle || []).push({})
          }
        })
      }
    }
  }

  React.useEffect(() => {
    const timeoutId = setTimeout(handleAdLoad, 9000)
    window.addEventListener("scroll", handleAdScroll)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener("scroll", handleAdScroll)
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasScrolled, pathname, searchParams])

  React.useEffect(() => {
    setHasScrolled(false)
  }, [pathname, searchParams])

  return (
    <Script
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
      onLoad={handleAdLoad}
    />
  )
}

export default AdsenseScript
