import type { NextRequest } from "next/server"

export function GET(_request: NextRequest) {
  const response = new Response(
    `google.com, pub-4946821479056257, DIRECT, f08c47fec0942fa0`,
  )
  response.headers.set("Content-Type", "text/plain")

  return response
}
