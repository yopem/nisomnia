//TODO: Handle jsonld

import * as React from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SiteLinksSearchBoxJsonLd } from "next-seo"

import Image from "@/components/image"
import env from "@/env"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

export async function generateMetadata(props: {
  params: Promise<{ slug: string; locale: LanguageType }>
}): Promise<Metadata> {
  const params = await props.params
  const { locale, slug } = params

  const productionCompany = await api.productionCompany.bySlug(slug)

  return {
    title: productionCompany?.metaTitle ?? productionCompany?.name,
    description:
      productionCompany?.metaDescription ?? productionCompany?.description,
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/production-company/${productionCompany?.slug}`,
    },
    openGraph: {
      title: productionCompany?.name,
      description:
        productionCompany?.metaDescription! ?? productionCompany?.description!,
      url: `${env.NEXT_PUBLIC_SITE_URL}/production-company/${productionCompany?.slug}`,
      locale: locale,
    },
  }
}

interface SingleProductionCompanyPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function SingleProductionCompanyPage(
  props: SingleProductionCompanyPageProps,
) {
  const { params } = props
  const { slug } = await params

  const productionCompany = await api.productionCompany.bySlug(slug)

  if (!productionCompany) {
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
        <h1>{productionCompany.name}</h1>
        {productionCompany.logo && (
          <Image
            src={productionCompany.logo}
            alt={productionCompany.name}
            className="!relative h-auto !w-[200px] rounded-xl"
          />
        )}
      </div>
    </>
  )
}
