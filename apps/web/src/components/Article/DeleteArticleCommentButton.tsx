"use client"

import * as React from "react"

import { Button, Icon } from "@nisomnia/ui/next"

import { useI18n } from "@/locales/client"

const AlertDelete = React.lazy(async () => {
  const { AlertDelete } = await import("@/components/AlertDelete")
  return { default: AlertDelete }
})

interface DeleteArticleCommentButtonProps {
  description: React.ReactNode
  action: () => void
}

export const DeleteArticleCommentButton: React.FunctionComponent<
  DeleteArticleCommentButtonProps
> = (props) => {
  const { description, action } = props

  const t = useI18n()

  const [openModal, setOpenModal] = React.useState<boolean>(false)
  return (
    <div>
      <Button
        aria-label={t("delete")}
        variant="ghost"
        className="h-auto justify-start"
        onClick={() => setOpenModal(true)}
      >
        <Icon.Delete className="mr-1" />
        {t("delete")}
      </Button>
      <AlertDelete
        description={<>{description}</>}
        isOpen={openModal}
        className="max-w-[366px]"
        onDelete={action}
        onClose={() => setOpenModal(false)}
      />
    </div>
  )
}
