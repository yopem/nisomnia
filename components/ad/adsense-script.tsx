"use client"

import * as React from "react"
import { usePathname, useSearchParams } from "next/navigation"
import Script from "next/script"

import env from "@/env"

const AdsenseScript = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [hasScrolled, setHasScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleAdLoad = () => {
      try {
        const insElements = Array.from(
          document.querySelectorAll("ins.manual-adsense"),
        )
        const insWithoutIframe = insElements.filter(
          (ins) => !ins.querySelector("iframe"),
        )
        if (!hasScrolled && insWithoutIframe.length > 0 && window.adsbygoogle) {
          setHasScrolled(true)
          insWithoutIframe.forEach(() =>
            (window.adsbygoogle = window.adsbygoogle || []).push({}),
          )
          window.removeEventListener("scroll", handleAdScroll)
        }
      } catch (err) {
        console.error("Error loading ads:", err)
      }
    }

    const handleAdScroll = () => handleAdLoad()

    const timeoutId = setTimeout(handleAdLoad, 9000)
    window.addEventListener("scroll", handleAdScroll)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener("scroll", handleAdScroll)
    }
  }, [hasScrolled, pathname, searchParams])

  return (
    <>
      <Script
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
        strategy="afterInteractive"
        onLoad={() => {
          const insElements = Array.from(
            document.querySelectorAll("ins.manual-adsense"),
          )
          insElements.forEach(() =>
            (window.adsbygoogle = window.adsbygoogle || []).push({}),
          )
        }}
        crossOrigin="anonymous"
      />
    </>
  )
}

export default AdsenseScript
