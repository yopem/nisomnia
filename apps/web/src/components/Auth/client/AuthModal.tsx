"use client"

import * as React from "react"

import { signIn } from "@nisomnia/auth/client"
import { Button, Icon, IconButton } from "@nisomnia/ui/next"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@nisomnia/ui/next-client"

export const AuthModal: React.FunctionComponent = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <IconButton variant="ghost">
          <Icon.SignIn className="h-4 w-4" />
        </IconButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex flex-col items-center justify-center space-y-3">
            <h2>Sign In</h2>
          </DialogTitle>
          <DialogDescription className="p-5 text-center">
            Use your Google account to sign in.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center">
          <Button variant="outline" onClick={() => signIn("google")}>
            <Icon.GoogleColored className="mr-2" />
            Sign In with Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
