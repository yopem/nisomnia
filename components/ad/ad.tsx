import * as React from "react"

import type { SelectAd } from "@/lib/db/schema"
import Adsense from "./adsense"
import PlainAd from "./plain-ad"

export interface AdProps extends React.HTMLAttributes<HTMLDivElement> {
  ad: Partial<SelectAd>
}

const Ad: React.FC<AdProps> = (props) => {
  const { ad } = props

  return (
    <div className="w-full">
      {ad.type === "plain_ad" ? (
        <PlainAd content={ad.content!} />
      ) : (
        <Adsense content={ad.content!} />
      )}
    </div>
  )
}

export default Ad
