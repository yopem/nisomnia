/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react"
import Head from "next/head"

import toJson from "@/lib/utils/to-json"

export interface JsonLdProps {
  type?: string
  scriptId?: string
  dataArray?: any[]
  useAppDir?: boolean
  [key: string]: any
}

function JsonLd({
  type = "Thing",
  keyOverride,
  scriptKey,
  scriptId = undefined,
  dataArray,
  useAppDir = false,
  ...rest
}: JsonLdProps & { scriptKey: string }) {
  const JsonLdScript = () => (
    <script
      type="application/ld+json"
      id={scriptId}
      data-testid={scriptId}
      dangerouslySetInnerHTML={toJson(
        type,
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        dataArray === undefined ? { ...rest } : dataArray,
      )}
      key={`jsonld-${scriptKey}${keyOverride ? `-${keyOverride}` : ""}`}
    />
  )

  if (useAppDir) {
    return <JsonLdScript />
  }
  return <Head>{JsonLdScript()}</Head>
}

export { JsonLd }
