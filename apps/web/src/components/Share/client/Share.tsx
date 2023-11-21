"use client"

import * as React from "react"

import {
  Icon,
  IconButton,
  ShareButtonFacebook,
  ShareButtonWhatsApp,
  ShareButtonX,
} from "@nisomnia/ui/next"
import { toast } from "@nisomnia/ui/next-client"
import { copyToClipboard } from "@nisomnia/utils"

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
          <IconButton
            aria-label="Copy Link"
            variant="ghost"
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              e.preventDefault()
              copyToClipboard(url)
              toast({
                variant: "success",
                description: "Article Link Copied",
              })
            }}
          >
            <Icon.Copy />
          </IconButton>
        </div>
      </div>
    </div>
  )
}
