import { Google } from "arctic"

import env from "@/env.mjs"

export const googleOAuth = new Google(
  env.GOOGLE_CLIENT_ID ?? "",
  env.GOOGLE_CLIENT_SECRET ?? "",
  env.GOOGLE_REDIRECT_URL ?? "http://localhost:3000/login/google/callback",
)
