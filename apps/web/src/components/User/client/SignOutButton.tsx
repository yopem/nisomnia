"use client"

import * as React from "react"

import { signOut } from "@nisomnia/auth/client"
import { Button, Icon } from "@nisomnia/ui/next"

export const SignOutButton: React.FunctionComponent = () => {
  return (
    <Button variant="ghost" onClick={() => signOut()}>
      <Icon.SignOut className="mr-2" />
      Sign Out
    </Button>
  )
}
