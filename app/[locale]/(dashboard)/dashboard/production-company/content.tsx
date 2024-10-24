"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"

import { useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import DashboardProductionCompanyHeader from "./header"
import ProductionCompanyTable from "./table"

export default function DashboardProductionCompanyContent() {
  const searchParams = useSearchParams()

  const page = searchParams.get("page")

  const ts = useScopedI18n("production_company")

  const perPage = 10

  const {
    data: productionCompaniesCount,
    refetch: updateProductionCompaniesCount,
  } = api.productionCompany.count.useQuery()

  const lastPage =
    productionCompaniesCount && Math.ceil(productionCompaniesCount / perPage)

  const {
    data: productionCompanies,
    isLoading,
    refetch: updateProductionCompanies,
  } = api.productionCompany.dashboard.useQuery({
    page: page ? parseInt(page) : 1,
    perPage: perPage,
  })

  React.useEffect(() => {
    if (lastPage && page && parseInt(page) !== 1 && parseInt(page) > lastPage) {
      window.history.pushState(null, "", `?page=${lastPage.toString()}`)
    }
  }, [lastPage, page])

  return (
    <>
      <DashboardProductionCompanyHeader />
      {!isLoading &&
      productionCompanies !== undefined &&
      productionCompanies.length > 0 ? (
        <ProductionCompanyTable
          productionCompanies={productionCompanies ?? 1}
          paramsName="page"
          page={page ? parseInt(page) : 1}
          lastPage={lastPage ?? 3}
          updateProductionCompanies={updateProductionCompanies}
          updateProductionCompaniesCount={updateProductionCompaniesCount}
        />
      ) : (
        <div className="my-64 flex items-center justify-center">
          <h3 className="text-center text-4xl font-bold">{ts("not_found")}</h3>
        </div>
      )}
    </>
  )
}
