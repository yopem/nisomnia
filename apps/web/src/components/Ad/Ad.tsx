import * as React from "react"

import type { Ad as AdDataProps } from "@nisomnia/db"

import { Adsense } from "./client"
import { PlainAd } from "./PlainAd"

export interface AdProps extends React.HTMLAttributes<HTMLDivElement> {
  ad: Partial<AdDataProps>
}

export const Ad: React.FunctionComponent<AdProps> = (props) => {
  const { ad, ...rest } = props

  return (
    <div {...rest}>
      {ad.type === "plain_ad" ? (
        <PlainAd content={ad.content!} />
      ) : (
        <Adsense content={ad.content!} />
      )}
    </div>
  )
}
