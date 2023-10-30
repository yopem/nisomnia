"use client"

import * as React from "react"
import dynamic from "next/dynamic"

import { Button, Icon } from "@nisomnia/ui/next"

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
      <Button
        aria-label="Delete Media"
        size={null}
        className="absolute z-20 h-[30px] w-[30px] rounded-full bg-danger/80 p-0 hover:bg-danger/80"
        onClick={() => setOpenModal(true)}
      >
        <Icon.Delete aria-label="Delete Media" />
      </Button>
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
