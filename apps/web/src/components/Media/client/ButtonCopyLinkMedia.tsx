"use client"

import * as React from "react"

import { Icon, IconButton } from "@nisomnia/ui/next"
import { toast } from "@nisomnia/ui/next-client"
import { copyToClipboard } from "@nisomnia/utils"

interface ButtonnCopyLinkMediaProps {
  url: string
}

export const ButtonCopyLinkMedia: React.FunctionComponent<
  ButtonnCopyLinkMediaProps
> = (props) => {
  const { url } = props

  return (
    <IconButton
      aria-label="Copy Media Link"
      variant="outline"
      size={null}
      className="absolute z-20 ml-8 h-[30px] w-[30px] rounded-full"
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
        copyToClipboard(url)
        toast({
          variant: "success",
          description: "Media Permalink Copied",
        })
      }}
    >
      <Icon.Copy aria-label="Delete Media" />
    </IconButton>
  )
}
