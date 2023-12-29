"use client"

import * as React from "react"

import { signOut } from "@nisomnia/auth/client"
import { Button, Icon } from "@nisomnia/ui/next"

import { useI18n } from "@/locales/client"

export const SignOutButton: React.FunctionComponent = () => {
  const t = useI18n()

  return (
    <Button variant="ghost" onClick={() => signOut()}>
      <Icon.SignOut className="mr-2" />
      {t("sign_out")}
    </Button>
  )
}
