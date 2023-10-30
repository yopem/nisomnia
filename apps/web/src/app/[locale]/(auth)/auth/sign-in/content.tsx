"use client"

import * as React from "react"

import { signIn } from "@nisomnia/auth/client"
import { Button, Icon } from "@nisomnia/ui/next"

export const SignInContent: React.FunctionComponent = () => {
  return (
    <>
      <p className="p-5 text-center">Use your Google account to sign in.</p>
      <div className="flex items-center justify-center">
        <Button variant="outline" onClick={() => signIn("google")}>
          <Icon.GoogleColored className="mr-2" />
          Sign In with Google
        </Button>
      </div>
    </>
  )
}
