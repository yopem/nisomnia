"use server"

import { redirect } from "next/navigation"

import { globalPOSTRateLimit } from "@/lib/rate-limit"
import {
  deleteSessionTokenCookie,
  getCurrentSession,
  invalidateSession,
} from "./session"

export async function logout(): Promise<ActionResult> {
  if (!globalPOSTRateLimit()) {
    return {
      message: "Too many requests",
    }
  }

  const { session } = await getCurrentSession()

  if (session === null) {
    return {
      message: "Not authenticated",
    }
  }

  await invalidateSession(session.id)
  deleteSessionTokenCookie()

  return redirect("/auth/login")
}

interface ActionResult {
  message: string
}
