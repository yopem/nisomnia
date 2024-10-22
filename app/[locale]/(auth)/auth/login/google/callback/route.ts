import { cookies } from "next/headers"
import { decodeIdToken, type OAuth2Tokens } from "arctic"

import { googleOAuth } from "@/lib/auth/oauth"
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/lib/auth/session"
import { db } from "@/lib/db"
import { accounts, users } from "@/lib/db/schema"
import { globalGETRateLimit } from "@/lib/rate-limit"
import { cuid } from "@/lib/utils"
import { ObjectParser } from "@/lib/utils/object-parser"
import { generateUniqueUsername } from "@/lib/utils/slug"

export async function GET(request: Request): Promise<Response> {
  if (!globalGETRateLimit()) {
    return new Response("Too many requests", {
      status: 429,
    })
  }

  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")

  const storedState = cookies().get("google_oauth_state")?.value ?? null
  const codeVerifier = cookies().get("google_code_verifier")?.value ?? null

  if (
    code === null ||
    state === null ||
    storedState === null ||
    codeVerifier === null
  ) {
    return new Response("Please restart the process.", {
      status: 400,
    })
  }

  if (state !== storedState) {
    return new Response("Please restart the process.", {
      status: 400,
    })
  }

  let tokens: OAuth2Tokens

  try {
    tokens = await googleOAuth.validateAuthorizationCode(code, codeVerifier)
  } catch {
    return new Response("Please restart the process.", {
      status: 400,
    })
  }

  const claims = decodeIdToken(tokens.idToken())
  const claimsParser = new ObjectParser(claims)

  const googleId = claimsParser.getString("sub")
  const name = claimsParser.getString("name")
  const picture = claimsParser.getString("picture")
  const email = claimsParser.getString("email")

  const existingUser = await db.query.accounts.findFirst({
    where: (accounts, { and, eq }) =>
      and(
        eq(accounts.provider, "google"),
        eq(accounts.providerAccountId, googleId),
      ),
  })

  if (existingUser) {
    const sessionToken = generateSessionToken()
    const session = createSession(sessionToken, existingUser.userId)

    //@ts-expect-error FIX later
    setSessionTokenCookie(sessionToken, session.expiresAt)
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    })
  }

  const userId = cuid()

  const user = await db
    .insert(users)
    .values({
      id: userId,
      email: email,
      name: name,
      username: await generateUniqueUsername(name),
      image: picture,
    })
    .returning()

  await db.insert(accounts).values({
    provider: "google",
    providerAccountId: googleId,
    userId: userId,
  })

  const sessionToken = generateSessionToken()
  const session = createSession(sessionToken, user[0].id)

  //@ts-expect-error FIX later
  setSessionTokenCookie(sessionToken, session.expiresAt)

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
    },
  })
}
