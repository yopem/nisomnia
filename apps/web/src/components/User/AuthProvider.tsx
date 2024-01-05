"use client"

import * as React from "react"

import { SessionProvider } from "@nisomnia/auth/client"

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider refetchOnWindowFocus={false}>{children}</SessionProvider>
  )
}
