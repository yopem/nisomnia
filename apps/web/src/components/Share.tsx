import * as React from "react"

import {
  ShareButtonFacebook,
  ShareButtonWhatsApp,
  ShareButtonX,
} from "@nisomnia/ui/next"

import { CopyLinkButon } from "@/components/CopyLinkButton"

interface ShareProps extends React.HTMLAttributes<HTMLDivElement> {
  url: string
  text: string
}

export const Share: React.FunctionComponent<ShareProps> = (props) => {
  const { text, url } = props

  return (
    <div className="my-4">
      <div className="flex justify-between">
        <div className="flex items-center">
          <span className="text-lg font-semibold">Share</span>
        </div>
        <div className="flex flex-row">
          <ShareButtonFacebook url={url} />
          <ShareButtonX url={url} text={text} />
          <ShareButtonWhatsApp url={url} text={text} />
          <CopyLinkButon url={url} />
        </div>
      </div>
    </div>
  )
}
