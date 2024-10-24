// TODO: handle arrow down

"use client"

import * as React from "react"
import { useController, type Control, type FieldValues } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { FormLabel, FormMessage } from "@/components/ui/form"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/toast/use-toast"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"

interface DashboardAddProductionCompaniesProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  productionCompanies: string[] | null
  addProductionCompanies: React.Dispatch<React.SetStateAction<string[] | null>>
  selectedProductionCompanies:
    | {
        id: string
        name: string
      }[]
    | null
  addSelectedProductionCompanies: React.Dispatch<
    React.SetStateAction<
      | {
          id: string
          name: string
        }[]
      | null
    >
  >
  control: Control<TFieldValues>
  fieldName: string
}

const DashboardAddProductionCompanies: React.FC<
  DashboardAddProductionCompaniesProps
> = (props) => {
  const {
    productionCompanies,
    addProductionCompanies,
    selectedProductionCompanies,
    addSelectedProductionCompanies,
    control,
    fieldName,
  } = props

  const [searchQuery, setSearchQuery] = React.useState<string>("")

  const t = useI18n()
  const ts = useScopedI18n("production_company")

  const {
    field: { onChange, value: controlledValue },
  } = useController({
    control,
    name: fieldName,
  })

  const assignProductionCompany = React.useCallback(
    (id: string | never) => {
      const checkedProductionCompanies = [...(productionCompanies ?? [])]
      const index = checkedProductionCompanies.indexOf(id as never)
      if (index === -1) {
        checkedProductionCompanies.push(id as never)
      } else {
        checkedProductionCompanies.splice(index, 1)
      }
      addProductionCompanies(checkedProductionCompanies)
      onChange(checkedProductionCompanies)
    },
    [addProductionCompanies, onChange, productionCompanies],
  )

  const { data: searchResults, isFetching: searchResultsIsLoading } =
    api.productionCompany.search.useQuery(searchQuery, {
      enabled: !!searchQuery,
      refetchOnWindowFocus: false,
    })

  const onSubmit = React.useCallback(() => {
    if (searchResults) {
      const searchResult = searchResults?.find(
        (productionCompany) => productionCompany.name === searchQuery,
      )

      if (searchResult) {
        if (
          selectedProductionCompanies !== null &&
          !selectedProductionCompanies.some(
            (productionCompany) => productionCompany.name === searchResult.name,
          )
        ) {
          const resultValue = {
            id: searchResult.id,
            name: searchResult.name,
          }

          assignProductionCompany(searchResult.id)
          addSelectedProductionCompanies((prev) => [
            ...(prev ?? []),
            resultValue,
          ])
        } else {
          toast({
            variant: "warning",
            description: searchQuery + ` ${t("already_selected")}`,
          })
          setSearchQuery("")
        }
        setSearchQuery("")
      } else {
        toast({
          variant: "danger",
          description: ts("not_found"),
        })
      }
    }
  }, [
    t,
    ts,
    addSelectedProductionCompanies,
    assignProductionCompany,
    searchQuery,
    searchResults,
    selectedProductionCompanies,
  ])

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
      setTimeout(onSubmit, 500)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setSearchQuery(e.target.value)
    onChange(e.target.value) // Ensure the controlled value is updated
  }

  const handleSelectandAssign = (value: { id: string; name: string }) => {
    if (
      selectedProductionCompanies !== null &&
      !selectedProductionCompanies.some(
        (productionCompany) => productionCompany.name === value.name,
      )
    ) {
      setSearchQuery("")
      assignProductionCompany(value.id)
      addSelectedProductionCompanies((prev) => [...(prev ?? []), value])
    } else {
      toast({
        variant: "warning",
        description: value.name + ` ${t("already_selected")}`,
      })
      setSearchQuery("")
    }
  }

  const handleRemoveValue = (value: { id: string }) => {
    if (selectedProductionCompanies !== null) {
      const filteredResult = selectedProductionCompanies.filter(
        (item) => item.id !== value.id,
      )

      const filteredData = productionCompanies?.filter(
        (item) => item !== value.id,
      )
      addSelectedProductionCompanies(filteredResult)
      addProductionCompanies(filteredData!)
      onChange(filteredData)
    }
  }

  return (
    <div className="space-y-2">
      <FormLabel>{t("production_companies")}</FormLabel>
      <div className="rounded-md border bg-muted/100">
        <div className="flex w-full flex-row flex-wrap items-center justify-start gap-2 p-2">
          {selectedProductionCompanies &&
            selectedProductionCompanies?.length > 0 &&
            selectedProductionCompanies.map((productionCompany) => {
              return (
                <div
                  className="flex items-center gap-2 rounded-full bg-background px-3 py-1 text-[14px] text-foreground"
                  key={productionCompany.id}
                >
                  <span>{productionCompany.name}</span>
                  <Button
                    aria-label={t("delete")}
                    onClick={() => handleRemoveValue(productionCompany)}
                    className="size-5 min-w-0 rounded-full bg-transparent text-foreground hover:bg-danger hover:text-white"
                    size="icon"
                  >
                    <Icon.Close aria-label={t("delete")} />
                  </Button>
                </div>
              )
            })}
          <Input
            type="text"
            className="h-auto min-h-6 w-full min-w-[50px] shrink grow basis-0 border-none !bg-transparent px-2 py-0 focus:border-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            name="productionCompanyName"
            onKeyDown={handleEnter}
            id="searchProductionCompany"
            value={searchQuery || controlledValue} // Ensures controlled value shows in the input
            placeholder={ts("enter")}
            onChange={handleSearchChange}
          />
        </div>
        {searchResultsIsLoading && (
          <div className="p-2">
            <Skeleton className="h-4 w-full rounded-md bg-foreground/60" />
            <p className="mt-2">{ts("finding")}</p>
          </div>
        )}
        {!searchResultsIsLoading &&
        searchResults !== undefined &&
        searchResults.length > 0 ? (
          <ul className="border-t">
            {searchResults.map((searchProductionCompany) => {
              const productionCompaniesData = {
                id: searchProductionCompany.id,
                name: searchProductionCompany.name,
              }
              return (
                <li
                  key={searchProductionCompany.id}
                  className="bg-background p-2 hover:bg-muted/50"
                >
                  <Button
                    variant="ghost"
                    type="button"
                    aria-label={searchProductionCompany.name}
                    onClick={() =>
                      handleSelectandAssign(productionCompaniesData)
                    }
                  >
                    {searchProductionCompany.name}
                  </Button>
                </li>
              )
            })}
          </ul>
        ) : (
          !searchResultsIsLoading &&
          searchResults !== undefined &&
          searchResults.length < 1 && (
            <div className="border-t border-muted/30 p-2">
              <p>{ts("not_found")}</p>
            </div>
          )
        )}
      </div>
      <FormMessage />
    </div>
  )
}

export default DashboardAddProductionCompanies
