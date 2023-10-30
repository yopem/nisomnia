import { PrismaAdapter } from "@next-auth/prisma-adapter"
import type { NextAuthOptions } from "next-auth"
import { getServerSession } from "next-auth/next"
import GoogleProvider from "next-auth/providers/google"

import { db, type UserRole } from "@nisomnia/db"
import {
  getDomainWithoutSubdomain,
  slugify,
  uniqueCharacter,
} from "@nisomnia/utils"

import env from "./env"

export * from "next-auth"

const useSecureCookies = env.NEXTAUTH_URL?.startsWith("https://")
const cookiePrefix = useSecureCookies ? "__Secure-" : ""
const hostName = getDomainWithoutSubdomain(env.NEXTAUTH_URL!)

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        domain: hostName == "localhost" ? hostName : "." + hostName,
      },
    },
  },
  callbacks: {
    signIn({ user, profile }) {
      user.username = `${slugify(profile?.name!)}_${uniqueCharacter()}`
      return true
    },
    //@ts-ignore
    async session({ session }) {
      const res = await db.user.findUnique({
        where: { email: session?.user?.email! },
      })
      return Promise.resolve({ user: { ...session.user, ...res } })
    },
  },
  pages: { signIn: "/auth/sign-in" },
}

export async function getCurrentSession() {
  const session = await getServerSession(authOptions)

  return session
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)

  return session?.user
}

export async function getCurrentUserByRole(userRole: UserRole) {
  const session = await getServerSession(authOptions)

  if (session?.user?.role && session.user.role === userRole) {
    return session?.user
  }

  return
}

export const getServerAuthSession = () => getServerSession(authOptions)
