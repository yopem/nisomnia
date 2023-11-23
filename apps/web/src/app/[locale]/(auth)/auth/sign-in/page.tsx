import * as React from "react"
import NextLink from "next/link"
import { redirect } from "next/navigation"

import { getCurrentUser } from "@nisomnia/auth"
import { buttonVariants, cn, Icon } from "@nisomnia/ui/next"

import env from "@/env"
import { SignInContent } from "./content"

export const metadata = {
  title: "Sign In",
  description: "Sign in to your account. ",
  alternates: {
    canonical: `${env.NEXT_PUBLIC_SITE_URL}/auth/sign-in/`,
  },
}

export default async function SignInPage() {
  const user = await getCurrentUser()

  if (user) {
    return redirect("/")
  }

  return (
    <div className="container mx-auto flex h-screen w-screen flex-col items-center justify-center">
      <NextLink
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8",
        )}
      >
        <>
          <Icon.ChevronLeft className="mr-2 h-4 w-4" />
          Back to Home
        </>
      </NextLink>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome back</h1>
        </div>
        <SignInContent />
      </div>
    </div>
  )
}
