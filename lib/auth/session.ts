import { cache } from "react"
import { cookies } from "next/headers"
import { sha256 } from "@oslojs/crypto/sha2"
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import {
  sessions,
  users,
  type SelectSession,
  type SelectUser,
} from "@/lib/db/schema"

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20)
  crypto.getRandomValues(bytes)
  const token = encodeBase32LowerCaseNoPadding(bytes)
  return token
}

export async function createSession(token: string, userId: string) {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))

  const session: SelectSession = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  }

  await db.insert(sessions).values(session)

  return session
}

export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
  const result = await db
    .select({ user: users, session: sessions })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, sessionId))

  if (result.length < 1) {
    return { session: null, user: null }
  }

  const { user, session } = result[0]

  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(sessions).where(eq(sessions.id, session.id))
    return { session: null, user: null }
  }

  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    await db
      .update(sessions)
      .set({
        expiresAt: session.expiresAt,
      })
      .where(eq(sessions.id, session.id))
  }

  return { session, user }
}

export async function invalidateSession(sessionId: string) {
  await db.delete(sessions).where(eq(sessions.id, sessionId))
}

export async function invalidateUserSession(userId: string) {
  await db.delete(sessions).where(eq(sessions.userId, userId))
}

export function setSessionTokenCookie(token: string, expiresAt: Date) {
  cookies().set("session", token, {
    httpOnly: true,
    path: "/",
    secure: process.env.APP_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
  })
}

export function deleteSessionTokenCookie() {
  cookies().set("session", "", {
    httpOnly: true,
    path: "/",
    secure: process.env.APP_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  })
}

export interface AuthSession {
  id: string
  expiresAt: Date
  userId: number
}

export type SessionValidationResult =
  | { session: SelectSession; user: SelectUser }
  | { session: null; user: null }

export const getSession = cache(async (): Promise<SessionValidationResult> => {
  const token = cookies().get("session")?.value ?? null

  if (token === null) {
    return { session: null, user: null }
  }

  const result = await validateSessionToken(token)

  return result
})

export const unCachedGetSession =
  async (): Promise<SessionValidationResult> => {
    const token = cookies().get("session")?.value ?? null

    if (token === null) {
      return { session: null, user: null }
    }

    const result = await validateSessionToken(token)

    return result
  }
