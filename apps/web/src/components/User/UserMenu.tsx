"use client"

import * as React from "react"
import NextLink from "next/link"

import type { User as UserProps } from "@nisomnia/auth"
import { Icon, IconButton } from "@nisomnia/ui/next"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nisomnia/ui/next-client"

import { Image } from "@/components/Image"

const SignOutButton = React.lazy(async () => {
  const { SignOutButton } = await import("./SignOutButton")
  return { default: SignOutButton }
})

export interface UserMenuProps {
  user: UserProps
}

export const UserMenu: React.FunctionComponent<UserMenuProps> = (props) => {
  const { user } = props

  const itemClass =
    "relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:text-foreground/90"

  return (
    <>
      {user ? (
        <Popover>
          <PopoverTrigger asChild>
            <IconButton aria-label="User Menu" variant="ghost">
              <Image
                src={user.image!}
                alt={user.name!}
                className="!relative m-0 h-4 w-4 rounded-full"
              />
            </IconButton>
          </PopoverTrigger>
          <PopoverContent className="w-56 bg-background">
            <NextLink
              aria-label="Profile"
              href={`/user/${user.username}`}
              className={itemClass}
            >
              <Icon.User className="mr-2 h-5 w-5" /> Profile
            </NextLink>
            <NextLink
              aria-label="Setting"
              href="/setting/user/profile"
              className={itemClass}
            >
              <Icon.Setting className="mr-2 h-5 w-5" /> Setting
            </NextLink>
            {user?.role?.includes("admin" || "author") && (
              <NextLink
                aria-label="Dashboard"
                href="/dashboard"
                className={itemClass}
              >
                <Icon.Dashboard className="mr-2 h-5 w-5" />
                Dashboard
              </NextLink>
            )}
            <div className="my-2">
              <SignOutButton />
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <NextLink
          aria-label="Sign In"
          href="/auth/sign-in"
          className={itemClass}
        >
          <Icon.SignIn />
        </NextLink>
      )}
    </>
  )
}
