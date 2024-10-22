import { cookies } from "next/headers"
import { generateCodeVerifier, generateState } from "arctic"

import { googleOAuth } from "@/lib/auth/oauth"
import { globalGETRateLimit } from "@/lib/rate-limit"

export async function GET(): Promise<Response> {
  if (!globalGETRateLimit()) {
    return new Response("Too many requests", {
      status: 429,
    })
  }

  const cookiesData = await cookies()

  const state = generateState()
  const codeVerifier = generateCodeVerifier()

  const url = googleOAuth.createAuthorizationURL(state, codeVerifier, [
    "openid",
    "profile",
    "email",
  ])

  cookiesData.set("google_oauth_state", state, {
    path: "/",
    secure: process.env.APP_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  })

  cookiesData.set("google_code_verifier", codeVerifier, {
    path: "/",
    secure: process.env.APP_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  })

  return Response.redirect(url)
}
