// TODO: handle arrow down

"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { FormLabel, FormMessage } from "@/components/ui/form"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast/use-toast"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"

interface FormValues {
  name: string
}

interface DashboardAddProductionCompaniesProps
  extends React.HTMLAttributes<HTMLDivElement> {
  productionCompanies: string[]
  addProductionCompanies: React.Dispatch<React.SetStateAction<string[]>>
  selectedProductionCompanies: {
    id: string
    name: string
  }[]
  addSelectedProductionCompanies: React.Dispatch<
    React.SetStateAction<
      {
        id: string
        name: string
      }[]
    >
  >
}

interface FormValues {
  name: string
}

const DashboardAddProductionCompanies: React.FC<
  DashboardAddProductionCompaniesProps
> = (props) => {
  const {
    productionCompanies,
    addProductionCompanies,
    selectedProductionCompanies,
    addSelectedProductionCompanies,
  } = props

  const [searchQuery, setSearchQuery] = React.useState<string>("")

  const t = useI18n()
  const ts = useScopedI18n("production_company")

  const { data: searchResults } = api.productionCompany.search.useQuery(
    searchQuery,
    {
      enabled: !!searchQuery,
    },
  )

  const form = useForm<FormValues>({ mode: "all", reValidateMode: "onChange" })

  const assignProductionCompany = React.useCallback(
    (id: string) => {
      const checkedProductionCompanies = [...productionCompanies]
      const index = checkedProductionCompanies.indexOf(id)
      if (index === -1) {
        checkedProductionCompanies.push(id)
      } else {
        checkedProductionCompanies.splice(index, 1)
      }
      addProductionCompanies(checkedProductionCompanies)
    },
    [addProductionCompanies, productionCompanies],
  )

  const onSubmit = React.useCallback(
    (values: FormValues) => {
      setSearchQuery(values.name)
      if (searchResults) {
        const searchResult = searchResults?.find(
          (productionCompany) => productionCompany.name === values.name,
        )
        if (searchResult) {
          if (
            !selectedProductionCompanies.some(
              (productionCompany) =>
                productionCompany.name === searchResult.name,
            )
          ) {
            const resultValue = {
              id: searchResult.id,
              name: searchResult.name!,
            }
            assignProductionCompany(searchResult.id)
            addSelectedProductionCompanies((prev) => [...prev, resultValue])
          }
          setSearchQuery("")
        }
      }
    },
    [
      addSelectedProductionCompanies,
      assignProductionCompany,
      searchResults,
      selectedProductionCompanies,
    ],
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setSearchQuery(e.target.value)
  }

  const handleSelectandAssign = (value: { id: string; name: string }) => {
    if (
      !selectedProductionCompanies.some(
        (productionCompany) => productionCompany.name === value.name,
      )
    ) {
      setSearchQuery("")
      assignProductionCompany(value.id)
      addSelectedProductionCompanies((prev) => [...prev, value])
    } else {
      toast({
        variant: "danger",
        description: value.name + ` ${t("already_used")}`,
      })
      setSearchQuery("")
    }
  }

  const handleEnter = (event: { key: string; preventDefault: () => void }) => {
    if (event.key === "Enter") {
      form.setValue("name", searchQuery)
      event.preventDefault()
      form.handleSubmit(onSubmit)()
      setSearchQuery("")
    }
  }

  const handleRemoveValue = (value: { id: string }) => {
    const filteredResult = selectedProductionCompanies.filter(
      (item) => item.id !== value.id,
    )

    const filteredData = productionCompanies.filter((item) => item !== value.id)
    addSelectedProductionCompanies(filteredResult)
    addProductionCompanies(filteredData)
  }

  return (
    <div className="space-y-2">
      <FormLabel>{t("production_companies")}</FormLabel>
      <div className="rounded-md border bg-muted/100">
        <div className="flex w-full flex-row flex-wrap items-center justify-start gap-2 p-2">
          {selectedProductionCompanies &&
            selectedProductionCompanies.length > 0 &&
            selectedProductionCompanies.map((productionCompany) => {
              return (
                <div
                  className="flex items-center gap-2 rounded-full bg-background px-3 py-1 text-[14px] text-foreground"
                  key={productionCompany.id}
                >
                  <span>{productionCompany.name}</span>
                  <Button
                    // disabled={selectedProductionCompanies.length === 1}
                    aria-label="Delete Production Company"
                    onClick={() => handleRemoveValue(productionCompany)}
                    size="icon"
                    className="size-5 min-w-0 rounded-full bg-transparent text-foreground hover:bg-danger hover:text-white"
                  >
                    <Icon.Close aria-label="Delete Production Company" />
                  </Button>
                </div>
              )
            })}
          <Input
            type="text"
            {...form.register("name")}
            className="h-auto min-h-6 w-full min-w-[50px] shrink grow basis-0 border-none !bg-transparent px-2 py-0 focus:border-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            name="name"
            id="searchProductionCompany"
            value={searchQuery}
            onKeyDown={handleEnter}
            placeholder={ts("find")}
            onChange={handleSearchChange}
          />
          <FormMessage />
        </div>
        {searchResults && searchResults.length > 0 && (
          <ul className="border-t">
            {searchResults.map((searchProductionCompany) => {
              const productionCompaniesData = {
                id: searchProductionCompany.id,
                name: searchProductionCompany.name!,
              }
              return (
                <li
                  key={searchProductionCompany.id}
                  className="p-2 hover:bg-muted/50"
                >
                  <Button
                    aria-label={searchProductionCompany.name ?? ""}
                    variant="ghost"
                    type="button"
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
        )}
      </div>
    </div>
  )
}

export default DashboardAddProductionCompanies
