"use client"

import * as React from "react"
import type { User as UserProps } from "@prisma/client"

import {
  Badge,
  Button,
  Icon,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@nisomnia/ui/next"
import {
  Input,
  InputGroup,
  InputRightElement,
  toast,
} from "@nisomnia/ui/next-client"
import { formatDate } from "@nisomnia/utils"

import { api } from "@/lib/trpc/react"
import { useI18n, useScopedI18n } from "@/locales/client"

const DashboardAction = React.lazy(async () => {
  const { DashboardAction } = await import(
    "@/components/Dashboard/DashboardAction"
  )
  return { default: DashboardAction }
})

export const DashboardUserContent: React.FunctionComponent = () => {
  const [page, setPage] = React.useState<number>(1)
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [usersData, setUsersData] = React.useState<UserProps[]>([])

  const t = useI18n()
  const ts = useScopedI18n("user")

  const { data: usersCount } = api.user.count.useQuery()

  const {
    data: users,
    isLoading,
    refetch,
  } = api.user.all.useQuery(
    { page: page, per_page: 10 },
    { keepPreviousData: true },
  )

  const lastPage = usersCount && Math.ceil(usersCount / 10)

  const { data: searchResults } = api.user.search.useQuery(searchQuery)

  const { mutate: deleteUser } = api.user.deleteByAdmin.useMutation({
    onSuccess: () => {
      toast({ variant: "success", description: ts("update_success") })
      refetch()
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
      } else {
        toast({
          variant: "danger",
          description: ts("update_failed"),
        })
      }
    },
  })

  const handleSearchOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setSearchQuery(e.target.value)
  }

  React.useEffect(() => {
    if (searchQuery) {
      setUsersData(searchResults as unknown as UserProps[])
    } else {
      setUsersData(users as unknown as UserProps[])
    }
  }, [searchQuery, searchResults, users])

  React.useEffect(() => {
    if (page !== 1 && page > lastPage!) {
      setPage((old) => Math.max(old - 1, 0))
    }
  }, [lastPage, page])

  return (
    <>
      <div className="mt-4 flex items-end justify-end">
        <InputGroup className="max-w-[200px]">
          <Input
            value={searchQuery}
            onChange={handleSearchOnChange}
            type="text"
          />
          <InputRightElement>
            <Button variant={null}>
              <Icon.Search />
            </Button>
          </InputRightElement>
        </InputGroup>
      </div>
      <div className="mb-[80px] mt-6 rounded">
        {!isLoading &&
          (usersData !== undefined && usersData.length > 0 ? (
            <>
              <Table className="table-fixed border-collapse border-spacing-0">
                <TableHeader>
                  <TableRow>
                    <TableHead>{ts("username")}</TableHead>
                    <TableHead>{ts("name")}</TableHead>
                    <TableHead className="hidden md:table-cell">
                      {ts("email")}
                    </TableHead>
                    <TableHead>{ts("role")}</TableHead>
                    <TableHead className="hidden md:table-cell">
                      {ts("date_joined")}
                    </TableHead>
                    <TableHead align="center">{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersData.map((user: UserProps) => (
                    <TableRow key={user.id}>
                      <TableCell className="line-clamp-3 max-w-[120px]">
                        <div className="flex">
                          <span className="font-medium">{user.username}</span>
                        </div>
                      </TableCell>
                      <TableCell className="white-space-nowrap">
                        <div className="flex">
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden whitespace-nowrap md:table-cell">
                        <div className="flex">
                          <span className="font-medium">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex">
                          <span className="font-medium">
                            <Badge>{user.role}</Badge>
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(user.createdAt, "LL")}
                      </TableCell>
                      <TableCell align="right">
                        <DashboardAction
                          viewLink={`/user/${user.username}`}
                          onDelete={() => {
                            void deleteUser(user.id)
                          }}
                          editLink={`/dashboard/user/edit/${user.id}`}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {page && !searchQuery && (
                <div className="align-center mt-2 flex items-center justify-center space-x-2">
                  {page !== 1 && (
                    <IconButton
                      variant="ghost"
                      onClick={() => setPage((old) => Math.max(old - 1, 0))}
                      disabled={page === 1}
                      className="rounded-full"
                    >
                      <Icon.ChevronLeft />
                    </IconButton>
                  )}
                  {page !== lastPage && (
                    <IconButton
                      variant="ghost"
                      onClick={() => {
                        setPage((old) => old + 1)
                      }}
                      className="rounded-full"
                    >
                      <Icon.ChevronRight />
                    </IconButton>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="my-48 flex items-center justify-center">
              <h3 className="text-center text-4xl font-bold">
                {ts("not_found")}
              </h3>
            </div>
          ))}
      </div>
    </>
  )
}
