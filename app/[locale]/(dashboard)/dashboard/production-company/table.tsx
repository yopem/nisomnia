import * as React from "react"

import DashboardPagination from "@/components/dashboard/dashboard-pagination"
import DashboardShowOptions from "@/components/dashboard/dashboard-show-options"
import Image from "@/components/image"
import { Badge } from "@/components/ui/badge"
import { Icon } from "@/components/ui/icon"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/toast/use-toast"
import type { SelectProductionCompany } from "@/lib/db/schema"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"

interface ProductionCompanyTableProps {
  productionCompanies: SelectProductionCompany[]
  paramsName: string
  page: number
  lastPage: number
  updateProductionCompanies: () => void
  updateProductionCompaniesCount: () => void
}

export default function ProductionCompanyTable(
  props: ProductionCompanyTableProps,
) {
  const {
    productionCompanies,
    paramsName,
    page,
    lastPage,
    updateProductionCompanies,
    updateProductionCompaniesCount,
  } = props

  const t = useI18n()
  const ts = useScopedI18n("production_company")

  const { mutate: deleteProductionCompany } =
    api.productionCompany.delete.useMutation({
      onSuccess: () => {
        updateProductionCompanies()
        updateProductionCompaniesCount()
        toast({ variant: "success", description: ts("delete_success") })
      },
      onError: (error) => {
        const errorData = error?.data?.zodError?.fieldErrors

        if (errorData) {
          for (const field in errorData) {
            if (errorData.hasOwnProperty(field)) {
              errorData[field]?.forEach((errorMessage) => {
                toast({
                  variant: "danger",
                  description: errorMessage,
                })
              })
            }
          }
        } else if (error?.message) {
          toast({
            variant: "danger",
            description: error.message,
          })
        } else {
          toast({
            variant: "danger",
            description: ts("delete_failed"),
          })
        }
      },
    })

  return (
    <div className="relative w-full overflow-auto">
      <Table className="table-fixed border-collapse border-spacing-0">
        <TableHeader>
          <TableRow>
            <TableHead>{t("name")}</TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              {t("origin_country")}
            </TableHead>
            <TableHead className="hidden whitespace-nowrap lg:table-cell">
              Logo
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productionCompanies.map((productionCompany) => {
            return (
              <TableRow key={productionCompany.id}>
                <TableCell className="max-w-[120px] align-middle">
                  <div className="flex flex-col">
                    <span className="line-clamp-3 font-medium">
                      {productionCompany.name}
                    </span>
                    <span className="table-cell text-[10px] text-muted-foreground lg:hidden">
                      <span className="uppercase">
                        {productionCompany.originCountry ?? "N/A"}
                      </span>
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="flex">
                    <Badge
                      variant={
                        productionCompany.originCountry ? "outline" : "warning"
                      }
                      className="uppercase"
                    >
                      {productionCompany.originCountry ?? "N/A"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap align-middle lg:table-cell">
                  <div className="relative size-[100px] overflow-hidden rounded">
                    {productionCompany.logo ? (
                      <Image
                        className="object-cover"
                        src={productionCompany.logo}
                        alt={productionCompany.name}
                      />
                    ) : (
                      <Icon.BrokenImage
                        aria-label="Broken Image"
                        className="size-full"
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell className="p-4 align-middle">
                  <DashboardShowOptions
                    onDelete={() => {
                      void deleteProductionCompany(productionCompany.id)
                    }}
                    editUrl={`/dashboard/production-company/edit/${productionCompany.id}`}
                    viewUrl={`/production-company/${productionCompany.slug}`}
                    description={productionCompany.name}
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      {lastPage ? (
        <DashboardPagination
          currentPage={page}
          lastPage={lastPage ?? 1}
          paramsName={paramsName}
        />
      ) : null}
    </div>
  )
}
