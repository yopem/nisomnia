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
