"use client"

import * as React from "react"

import { cn, Icon } from "@nisomnia/ui/next"

export interface SidebarToggleProps
  extends React.HTMLAttributes<HTMLLIElement> {
  icon?: React.ReactNode
  children?: React.ReactNode
  title?: string
  badge?: string
  href?: string
}

export const SidebarToggle: React.FunctionComponent<SidebarToggleProps> = (
  props,
) => {
  const { icon, title, children } = props

  const [toggle, setToggle] = React.useState<boolean>(false)

  const dropdownClasses = cn(!toggle && "hidden", "space-y-2 py-2")

  return (
    <li>
      <button
        type="button"
        onClick={() => setToggle(!toggle)}
        className="group flex w-full items-center rounded-lg bg-background p-2 text-base font-normal text-foreground transition duration-75 hover:bg-primary/10"
        aria-controls="dropdown"
        data-collapse-toggle="dropdown"
      >
        {icon}
        <span className="ml-5 flex-1 whitespace-nowrap text-left">{title}</span>
        <Icon.ChevronDown sidebar-toggle-item="true" className="h-6 w-6" />
      </button>
      <ul id="dropdown" className={dropdownClasses}>
        {children}
      </ul>
    </li>
  )
}
