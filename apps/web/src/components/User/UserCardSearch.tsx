import * as React from "react"
import NextLink from "next/link"

import type { User as UserProps } from "@nisomnia/db"
import { Icon } from "@nisomnia/ui/next"

import { Image } from "@/components/Image"

type UserDataProps = Pick<UserProps, "name" | "username" | "image">

interface UserCardSearchProps {
  user: UserDataProps
}

export const UserCardSearch: React.FunctionComponent<UserCardSearchProps> = (
  props,
) => {
  const { user } = props

  const { name, username, image } = user

  return (
    <NextLink
      aria-label={username}
      href={`/user/${username}`}
      className="mb-2 w-full"
    >
      <div className="flex flex-row hover:bg-accent">
        <div className="relative aspect-[1/1] h-[50px] w-auto max-w-[unset] overflow-hidden rounded-md">
          {image ? (
            <Image src={image} className="object-cover" alt={name!} />
          ) : (
            <Icon.User />
          )}
        </div>
        <div className="ml-2 w-3/4">
          <h3 className="mb-2 text-lg font-medium">{name}</h3>
        </div>
      </div>
    </NextLink>
  )
}
