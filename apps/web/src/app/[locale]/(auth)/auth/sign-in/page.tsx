import * as React from "react"
import type { Metadata } from "next"
import dynamic from "next/dynamic"
import NextLink from "next/link"
import { redirect } from "next/navigation"

import { getCurrentUser } from "@nisomnia/auth"
import type { LanguageType } from "@nisomnia/db"
import { buttonVariants, cn, Icon } from "@nisomnia/ui/next"

import env from "@/env"

const SignInContent = dynamic(async () => {
  const { SignInContent } = await import("./content")
  return { default: SignInContent }
})

export function generateMetadata({
  params,
}: {
  params: { locale: LanguageType }
}): Metadata {
  const { locale } = params

  return {
    title: "Sign In",
    description: "Sign to your Nisomnia Account",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/auth/sign-in`,
    },
    openGraph: {
      title: "Sign In",
      description: "Sign to your Nisomnia Account",
      url: `${env.NEXT_PUBLIC_SITE_URL}/authsign-in`,
      locale: locale,
    },
  }
}

export default async function SignInPage() {
  const user = await getCurrentUser()

  if (user) {
    return redirect("/")
  }

  return (
    <div className="container mx-auto flex h-screen w-screen flex-col items-center justify-center">
      <NextLink
        aria-label="Home"
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
