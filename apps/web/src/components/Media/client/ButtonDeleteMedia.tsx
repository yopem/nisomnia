"use client"

import * as React from "react"
import dynamic from "next/dynamic"

import { Icon, IconButton } from "@nisomnia/ui/next"

const AlertDelete = dynamic(() =>
  import("@/components/Layout/client").then((mod) => mod.AlertDelete),
)

interface ButtonDeleteMediaProps {
  content: React.ReactNode
  deleteMedia: () => void
}

export const ButtonDeleteMedia: React.FunctionComponent<
  ButtonDeleteMediaProps
> = (props) => {
  const { content, deleteMedia } = props

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
        desc={<>{content}</>}
        isOpen={openModal}
        className="max-w-[366px]"
        onDelete={deleteMedia}
        onClose={() => setOpenModal(false)}
      />
    </div>
  )
}
