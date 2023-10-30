import * as React from "react"
import NextLink from "next/link"

import { cn } from "../utils/cn"

export interface ShareButtonProps {
  url: string
  variant?: "solid" | "outline" | "ghost"
  onClick?: () => void
  className?: string
  text?: string
  icon?: string | React.ReactElement
  subject?: string | null
  message?: string | null
  sharetext?: string | null
  mediaSrc?: string | null
  baseUrl?: string | null
  caption?: string | null
  title?: string
}

export const ShareButton: React.FunctionComponent<ShareButtonProps> = (
  props,
) => {
  const { onClick, text, icon, className, url } = props
  return (
    <NextLink
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      title={text}
      href={url}
      className={cn(
        "flex items-center rounded-lg px-3 py-2 text-base font-normal text-foreground hover:bg-accent",
        className,
      )}
    >
      {icon}
      <div className="ml-1 flex-1 whitespace-nowrap">{text}</div>
    </NextLink>
  )
}
