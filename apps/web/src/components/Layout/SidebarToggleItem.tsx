import * as React from "react"
import NextLink, { type LinkProps } from "next/link"

export interface SidebarToggleItemProps extends LinkProps {
  children?: React.ReactNode
}

export const SidebarToggleItem: React.FunctionComponent<
  SidebarToggleItemProps
> = (props) => {
  const { children, href } = props

  return (
    <NextLink
      aria-label="Sidebar Toggle Item"
      href={href}
      className="group flex w-full items-center rounded-lg bg-background p-2 pl-11 text-base font-normal text-foreground transition duration-75 hover:bg-primary/10"
    >
      {children}
    </NextLink>
  )
}
