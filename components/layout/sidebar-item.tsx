import * as React from "react"
import NextLink from "next/link"

import { cn } from "@/lib/utils"

interface SidebarItemProps extends React.HTMLAttributes<HTMLLIElement> {
  icon?: React.ReactNode | undefined
  children?: React.ReactNode
  badge?: string
  href?: string
  onClick?: () => void
}

const SidebarItem: React.FC<SidebarItemProps> = (props) => {
  const { icon, badge, children, href, className, onClick } = props

  if (href) {
    return (
      <li>
        <NextLink
          aria-label="Sidebar Item"
          href={href}
          className={cn(
            "flex items-center rounded-lg p-2 text-base font-normal text-foreground hover:bg-primary/5",

            className,
          )}
        >
          {icon}
          <span className="ml-5 flex-1 whitespace-nowrap">{children}</span>
          {badge && (
            <span className="ml-3 inline-flex items-center justify-center rounded-full px-2 text-sm font-medium text-foreground hover:bg-primary/5">
              {badge}
            </span>
          )}
        </NextLink>
      </li>
    )
  }

  if (onClick) {
    return (
      <li>
        <div
          className={cn(
            "flex items-center rounded-lg bg-background p-2 text-base font-normal text-foreground hover:bg-primary/5",
            className,
          )}
          onClick={onClick}
        >
          {icon}
          <span className="ml-5 flex-1 whitespace-nowrap">{children}</span>
          {badge && (
            <span className="ml-3 inline-flex items-center justify-center rounded-full px-2 text-sm font-medium text-foreground hover:bg-primary/5">
              {badge}
            </span>
          )}
        </div>
      </li>
    )
  }

  return (
    <li>
      <div
        className={cn(
          "flex items-center rounded-lg bg-background p-2 text-base font-normal text-foreground hover:bg-primary/5",
          className,
        )}
      >
        {icon}
        <span className="ml-5 flex-1 whitespace-nowrap">{children}</span>
        {badge && (
          <span className="ml-3 inline-flex items-center justify-center rounded-full px-2 text-sm font-medium text-foreground hover:bg-primary/5">
            {badge}
          </span>
        )}
      </div>
    </li>
  )
}

export default SidebarItem
