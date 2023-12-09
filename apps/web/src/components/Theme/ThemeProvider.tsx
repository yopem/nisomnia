"use client"

import * as React from "react"
import { ThemeProvider as NextThemeProvider } from "next-themes"
import { Provider as BalancerProvider } from "react-wrap-balancer"

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FunctionComponent<ThemeProviderProps> = (
  props,
) => {
  const { children } = props

  return (
    <NextThemeProvider attribute="class">
      <BalancerProvider>{children}</BalancerProvider>
    </NextThemeProvider>
  )
}
