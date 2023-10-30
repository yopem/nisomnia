"use client"

import * as React from "react"

import { SessionProvider } from "@nisomnia/auth/client"

export const AuthProvider: React.FunctionComponent<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <SessionProvider refetchOnWindowFocus={false}>{children}</SessionProvider>
  )
}
