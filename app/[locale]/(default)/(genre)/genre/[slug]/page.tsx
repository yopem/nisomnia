//TODO: Handle jsonld

import * as React from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SiteLinksSearchBoxJsonLd } from "next-seo"

import env from "@/env"
import { api } from "@/lib/trpc/server"

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const params = await props.params
  const { slug } = params

  const genre = await api.genre.bySlug(slug)

  return {
    title: genre?.metaTitle ?? genre?.title,
    description: genre?.metaDescription ?? genre?.description,
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/genre/${genre?.slug}/`,
    },
    openGraph: {
      title: genre?.title,
      description: genre?.metaDescription! ?? genre?.description!,
      url: `${env.NEXT_PUBLIC_SITE_URL}/genre/${genre?.slug}`,
      locale: genre?.language,
    },
  }
}

interface SingleGenrePageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function SingleGenrePage(props: SingleGenrePageProps) {
  const { params } = props
  const { slug } = await params

  const genre = await api.genre.bySlug(slug)

  if (!genre) {
    notFound()
  }

  return (
    <>
      <SiteLinksSearchBoxJsonLd
        useAppDir={true}
        url={env.NEXT_PUBLIC_SITE_URL}
        potentialActions={[
          {
            target: `${env.NEXT_PUBLIC_SITE_URL}/search?q`,
            queryInput: "search_term_string",
          },
        ]}
      />
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1>{genre.title}</h1>
      </div>
    </>
  )
}
