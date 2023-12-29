"use client"

import * as React from "react"

import { signIn } from "@nisomnia/auth/client"
import { Button, Icon } from "@nisomnia/ui/next"

import { useScopedI18n } from "@/locales/client"

export const SignInContent: React.FunctionComponent = () => {
  const ts = useScopedI18n("user")

  return (
    <>
      <p className="p-5 text-center">{ts("header")}</p>
      <div className="flex items-center justify-center">
        <Button variant="outline" onClick={() => signIn("google")}>
          <Icon.GoogleColored className="mr-2" />
          {ts("sign_in")}
        </Button>
      </div>
    </>
  )
}
