"use client"

import * as React from "react"
import NextLink from "next/link"

import { Button, Icon } from "@nisomnia/ui/next"

interface DashboardContainerProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
}

export const DashboardContainer: React.FunctionComponent<
  DashboardContainerProps
> = ({ children, sidebar }) => {
  const [open, setOpen] = React.useState<boolean>(false)

  return (
    <div className="relative flex h-auto">
      <div
        className={`${
          open ? "max-lg:translate-x-0" : ""
        } fixed z-[49] h-full w-3/12 max-w-[270px] transition-[transform] max-lg:w-[270px] max-lg:-translate-x-full`}
      >
        {sidebar}
      </div>
      <div className="w-full pl-[280px] pr-3 transition-all max-lg:mb-28 max-lg:w-full max-lg:px-3">
        {children}
      </div>
      <div className="fixed inset-x-0 bottom-0 z-[49] flex items-center justify-around border-t bg-background py-3 lg:hidden">
        <NextLink
          aria-label="Dashboard"
          href="/dashboard"
          className="flex h-12 basis-1/3 cursor-pointer flex-col items-center justify-around text-center text-foreground"
        >
          <Button
            variant="ghost"
            className="h-12 flex-col items-center justify-around rounded"
          >
            <Icon.Dashboard />
            Dashboard
          </Button>
        </NextLink>
        <NextLink
          aria-label="Dashboard Article"
          href="/dashboard/article"
          className="flex h-12 basis-1/3 cursor-pointer flex-col items-center justify-around text-center text-foreground"
        >
          <Button
            variant="ghost"
            className="h-12 flex-col items-center justify-around rounded"
          >
            <Icon.Article />
            Articles
          </Button>
        </NextLink>
        <Button
          variant="ghost"
          onClick={() => setOpen((prev) => !prev)}
          className="text-froeground flex h-12 basis-1/3 cursor-pointer flex-col items-center justify-around rounded text-center"
        >
          <Icon.MoreVertical />
          More
        </Button>
      </div>
    </div>
  )
}
