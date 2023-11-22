import * as React from "react"
import NextLink from "next/link"

import type { Session } from "@nisomnia/auth"
import { Icon } from "@nisomnia/ui/next"

import { Sidebar, SidebarItem, SidebarToggleItem } from "@/components/Layout"
import { SidebarToggle } from "@/components/Layout/client"
import { Logo } from "@/components/Logo"
import { ThemeSwitcher } from "@/components/Theme/client"

export interface DashboardSidebarProps {
  session: Session | null
}

export const DashboardSidebar: React.FunctionComponent<
  DashboardSidebarProps
> = (props) => {
  const { session, ...rest } = props

  return (
    <Sidebar {...rest}>
      <div className="flex items-center gap-2">
        <NextLink
          href="/"
          className="my-0 flex items-center justify-center p-5"
        >
          <Logo />
        </NextLink>
        <div>
          <ThemeSwitcher />
        </div>
      </div>
      <SidebarItem icon={<Icon.Dashboard />} href="/dashboard">
        Dashboard
      </SidebarItem>
      <SidebarToggle icon={<Icon.Article />} title="Articles">
        <SidebarToggleItem href="/dashboard/article">
          All Articles
        </SidebarToggleItem>
        <SidebarToggleItem href="/dashboard/article/comment">
          Comments
        </SidebarToggleItem>
        <SidebarToggleItem href="/dashboard/article/new">
          Add new article
        </SidebarToggleItem>
      </SidebarToggle>
      <SidebarToggle icon={<Icon.Topic />} title="Topics">
        <SidebarToggleItem href="/dashboard/topic">
          All Topics
        </SidebarToggleItem>
        <SidebarToggleItem href="/dashboard/topic/new">
          Add new topic
        </SidebarToggleItem>
      </SidebarToggle>
      {session?.user?.role === "admin" && (
        <SidebarToggle icon={<Icon.Ads />} title="Ads">
          <SidebarToggleItem href="/dashboard/ad">All Ads</SidebarToggleItem>
          <SidebarToggleItem href="/dashboard/ad/new">
            Add new ad
          </SidebarToggleItem>
        </SidebarToggle>
      )}
      <SidebarToggle icon={<Icon.Media />} title="Media">
        <SidebarToggleItem href="/dashboard/media">Library</SidebarToggleItem>
        <SidebarToggleItem href="/dashboard/media/new">
          Add new
        </SidebarToggleItem>
      </SidebarToggle>
      {/* <SidebarItem icon={<Icon.Comment />} href="/dashboard/comment">
            Comments
          </SidebarItem> */}
      {session?.user?.role === "admin" && (
        <>
          <SidebarToggle icon={<Icon.Users />} title="Users">
            <SidebarToggleItem href="/dashboard/user">
              All users
            </SidebarToggleItem>
          </SidebarToggle>
        </>
      )}
      <div className="py-5">
        <SidebarItem icon={<Icon.Person />} href="/setting/user/profile">
          Profile
        </SidebarItem>
      </div>
    </Sidebar>
  )
}
