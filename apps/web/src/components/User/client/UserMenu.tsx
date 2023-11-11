"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import NextLink from "next/link"

import type { Session } from "@nisomnia/auth"
import { Icon, IconButton } from "@nisomnia/ui/next"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nisomnia/ui/next-client"

import { Image } from "@/components/Image"

const AuthModal = dynamic(() =>
  import("@/components/Auth/client").then((mod) => mod.AuthModal),
)
const SignOutButton = dynamic(() =>
  import("@/components/Auth/client").then((mod) => mod.SignOutButton),
)

export const UserMenu = ({ session }: { session: Session | null }) => {
  const { name, username, image } = session?.user ?? {}

  const itemClass =
    "relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:text-foreground/90"

  return (
    <>
      {session ? (
        <Popover>
          <PopoverTrigger asChild>
            <IconButton aria-label="User Menu" variant="ghost">
              <Image
                src={image!}
                alt={name!}
                className="!relative m-0 h-4 w-4 rounded-full"
              />
            </IconButton>
          </PopoverTrigger>
          <PopoverContent className="w-56 bg-background">
            <NextLink href={`/user/${username}`} className={itemClass}>
              <Icon.User className="mr-2 h-5 w-5" /> Profile
            </NextLink>
            <NextLink href="/setting/user/profile" className={itemClass}>
              <Icon.Setting className="mr-2 h-5 w-5" /> Setting
            </NextLink>
            {session?.user?.role?.includes("admin" || "author") && (
              <NextLink href="/dashboard" className={itemClass}>
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
        <AuthModal />
      )}
    </>
  )
}
