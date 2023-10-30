/* eslint-disable @typescript-eslint/prefer-namespace-keyword */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { DefaultUser } from "@nisomnia/auth"
import type { UserRole } from "@nisomnia/db"

interface IUser extends DefaultUser {
  username: string
  role?: UserRole
}

declare module "next-auth" {
  interface User extends IUser {}

  interface Session {
    user?: User
  }
}

declare module "next-auth/jwt" {
  interface JWT extends IUser {}
}

declare global {
  interface Window {
    adsbygoogle: any
    gtag: any
    dataLayer: any
  }

  declare module NodeJS {
    interface Process extends NodeJS.Process {
      browser?: string
    }
  }
}
