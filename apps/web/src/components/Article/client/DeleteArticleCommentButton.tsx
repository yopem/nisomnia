"use client"

import * as React from "react"
import dynamic from "next/dynamic"

import { Button, Icon } from "@nisomnia/ui/next"

const AlertDelete = dynamic(() =>
  import("@/components/Layout/client").then((mod) => mod.AlertDelete),
)

interface DeleteArticleCommentButtonProps {
  description: React.ReactNode
  action: () => void
}

export const DeleteArticleCommentButton: React.FunctionComponent<
  DeleteArticleCommentButtonProps
> = (props) => {
  const { description, action } = props

  const [openModal, setOpenModal] = React.useState<boolean>(false)
  return (
    <div>
      <Button
        aria-label="Delete Article Comment"
        variant="ghost"
        className="h-auto justify-start"
        onClick={() => setOpenModal(true)}
      >
        <Icon.Delete className="mr-1" />
        Delete
      </Button>
      <AlertDelete
        desc={<>{description}</>}
        isOpen={openModal}
        className="max-w-[366px]"
        onDelete={action}
        onClose={() => setOpenModal(false)}
      />
    </div>
  )
}
