import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import { notFound } from "next/navigation"

import env from "@/env"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

const EditProductionCompanyForm = dynamicFn(async () => {
  const EditProductionCompanyForm = await import("./form")
  return EditProductionCompanyForm
})

export async function generateMetadata(props: {
  params: Promise<{ productionCompanyId: string; locale: LanguageType }>
}): Promise<Metadata> {
  const params = await props.params
  const { productionCompanyId, locale } = params

  const productionCompany =
    await api.productionCompany.byId(productionCompanyId)

  return {
    title: "Edit Production Company Dashboard",
    description: "Edit Production Company Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/production-company/edit/${productionCompany?.id}`,
    },
    openGraph: {
      title: "Edit Production Company Dashboard",
      description: "Edit Production Company Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/production-company/edit/${productionCompany?.id}`,
      locale: locale,
    },
  }
}

interface EditProductionCompanyDashboardProps {
  params: Promise<{ productionCompanyId: string }>
}

export default async function EditProductionCompanyDashboard(
  props: EditProductionCompanyDashboardProps,
) {
  const { params } = props

  const { productionCompanyId } = await params

  const productionCompany =
    await api.productionCompany.byId(productionCompanyId)

  if (!productionCompany) {
    notFound()
  }

  return (
    <div className="mb-[100px] mt-4 flex items-end justify-end">
      <div className="flex-1 space-y-4">
        <EditProductionCompanyForm productionCompany={productionCompany} />
      </div>
    </div>
  )
}
