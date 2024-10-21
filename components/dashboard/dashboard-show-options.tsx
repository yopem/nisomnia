"use client"

import type { UrlObject } from "url"
import * as React from "react"
import NextLink from "next/link"

import { AlertDelete } from "@/components/alert-delete"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icon } from "@/components/ui/icon"
import { useI18n } from "@/lib/locales/client"

interface DashboardShowOptionsProps {
  onDelete?: () => void
  editUrl?: string | UrlObject
  translateUrl?: string | UrlObject
  viewUrl?: string | UrlObject
  description?: string
}

const DashboardShowOptions: React.FC<DashboardShowOptionsProps> = (props) => {
  const { onDelete, editUrl, translateUrl, viewUrl, description } = props

  const [openDialog, setOpenDialog] = React.useState<boolean>(false)

  const t = useI18n()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="ml-auto flex h-8">
            <Icon.MoreHorizontal className="mr-2 size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px] p-2">
          {onDelete && (
            <DropdownMenuItem onClick={() => setOpenDialog(true)}>
              <Icon.Delete className="mr-2 size-4" />
              {t("delete")}
            </DropdownMenuItem>
          )}
          {editUrl && (
            <DropdownMenuItem asChild>
              <NextLink href={editUrl}>
                <Icon.Edit className="mr-2 size-4" />
                {t("edit")}
              </NextLink>
            </DropdownMenuItem>
          )}
          {translateUrl && (
            <DropdownMenuItem asChild>
              <NextLink href={translateUrl}>
                <Icon.Language className="mr-2 size-4" />
                {t("translate")}
              </NextLink>
            </DropdownMenuItem>
          )}
          {viewUrl && (
            <DropdownMenuItem asChild>
              <NextLink href={viewUrl} target="_blank">
                <Icon.View className="mr-2 size-4" />
                {t("view")}
              </NextLink>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {onDelete && (
        <AlertDelete
          description={description}
          isOpen={openDialog}
          className="max-w-[366px]"
          onDelete={onDelete}
          onClose={() => setOpenDialog(false)}
        />
      )}
    </>
  )
}

export default DashboardShowOptions
