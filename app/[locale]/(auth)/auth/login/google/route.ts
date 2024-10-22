import { cookies } from "next/headers"
import { generateCodeVerifier, generateState } from "arctic"

import { googleOAuth } from "@/lib/auth/oauth"
import { globalGETRateLimit } from "@/lib/rate-limit"

// eslint-disable-next-line @typescript-eslint/require-await
export async function GET(): Promise<Response> {
  if (!globalGETRateLimit()) {
    return new Response("Too many requests", {
      status: 429,
    })
  }

  const state = generateState()
  const codeVerifier = generateCodeVerifier()
  const url = googleOAuth.createAuthorizationURL(state, codeVerifier, [
    "openid",
    "profile",
    "email",
  ])

  cookies().set("google_oauth_state", state, {
    path: "/",
    secure: process.env.APP_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  })

  cookies().set("google_code_verifier", codeVerifier, {
    path: "/",
    secure: process.env.APP_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  })

  return Response.redirect(url)
}
