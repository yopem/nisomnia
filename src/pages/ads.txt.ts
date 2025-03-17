import type { APIRoute } from "astro"

import { publicAdsenseClientId } from "@/utils/constant"

const getAdsTxt = (adsenseClientId: string) => `
google.com, ${adsenseClientId}, DIRECT, f08c47fec0942fa0
`

export const GET: APIRoute = () => {
  return new Response(
    getAdsTxt(publicAdsenseClientId || "pub-4946821479056257"),
    {
      headers: {
        "Content-Type": "text/plain",
      },
    },
  )
}
