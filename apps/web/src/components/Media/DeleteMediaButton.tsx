"use client"

import * as React from "react"

import { Icon, IconButton } from "@nisomnia/ui/next"

const AlertDelete = React.lazy(async () => {
  const { AlertDelete } = await import("@/components/AlertDelete")
  return { default: AlertDelete }
})

interface DeleteMediaButtonProps {
  description: React.ReactNode
  action: () => void
}

export const DeleteMediaButton: React.FunctionComponent<
  DeleteMediaButtonProps
> = (props) => {
  const { description, action } = props

  const [openModal, setOpenModal] = React.useState<boolean>(false)
  return (
    <div>
      <IconButton
        aria-label="Delete Media"
        size={null}
        className="absolute z-20 h-[30px] w-[30px] rounded-full"
        variant="danger"
        onClick={() => setOpenModal(true)}
      >
        <Icon.Delete aria-label="Delete Media" />
      </IconButton>
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
