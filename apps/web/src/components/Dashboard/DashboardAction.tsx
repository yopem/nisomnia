"use client"

import type { UrlObject } from "url"
import * as React from "react"
import NextLink from "next/link"

import { cn, Icon } from "@nisomnia/ui/next"

import { useI18n } from "@/locales/client"

const AlertDelete = React.lazy(async () => {
  const { AlertDelete } = await import("@/components/AlertDelete")
  return { default: AlertDelete }
})

export interface DashboardActionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onDelete?: () => void
  onEdit?: () => void
  onView?: () => void
  deleteLink?: string | UrlObject
  editLink?: string | UrlObject
  viewLink?: string | UrlObject
  className?: string
  content?: string
}

export const DashboardAction: React.FunctionComponent<DashboardActionProps> = (
  props,
) => {
  const {
    onDelete,
    onEdit,
    onView,
    deleteLink,
    editLink,
    viewLink,
    className,
    content,
  } = props

  const t = useI18n()

  const [openModal, setOpenModal] = React.useState<boolean>(false)

  return (
    <div
      className={cn("flex content-start items-start justify-start", className)}
    >
      {viewLink && (
        <NextLink aria-label={t("view")} href={viewLink} target="_blank">
          <Icon.Visibility className="mr-2 w-4 transform  cursor-pointer hover:scale-110 hover:text-primary/90" />
        </NextLink>
      )}

      {onView && (
        <Icon.Visibility
          className="mr-2 w-4 transform  cursor-pointer hover:scale-110 hover:text-primary/90"
          onClick={onView}
        />
      )}

      {editLink && (
        <NextLink aria-label={t("edit")} href={editLink}>
          <Icon.Edit className="mr-2 w-4 transform cursor-pointer hover:scale-110 hover:text-primary/90" />
        </NextLink>
      )}

      {onEdit && (
        <Icon.Edit
          className="mr-2 w-4 transform  cursor-pointer hover:scale-110 hover:text-primary/90"
          onClick={onEdit}
        />
      )}

      {deleteLink && (
        <NextLink aria-label={t("delete")} href={deleteLink}>
          <Icon.Delete className="mr-2 w-4 transform cursor-pointer hover:scale-110 hover:text-primary/90" />
        </NextLink>
      )}

      {onDelete && (
        <>
          <Icon.Delete
            className="mr-2 w-4 transform cursor-pointer hover:scale-110 hover:text-primary/90"
            onClick={() => setOpenModal(true)}
          />
          <AlertDelete
            description={<>{content}</>}
            isOpen={openModal}
            className="max-w-[366px]"
            onDelete={onDelete}
            onClose={() => setOpenModal(false)}
          />
        </>
      )}
    </div>
  )
}
