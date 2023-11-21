"use client"

import * as React from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@nisomnia/ui/next-client"

interface AlertDeleteProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: React.ReactNode
  isOpen: boolean
  onClose: () => void
  onDelete: () => void
}

export const AlertDelete: React.FunctionComponent<AlertDeleteProps> = (
  props,
) => {
  const { description, isOpen, onClose, className, onDelete } = props

  function handleDeleteAndClose() {
    onDelete()
    onClose()
  }

  return (
    <div className={className}>
      <AlertDialog open={isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {description}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure to delete {description}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction variant="danger" onClick={handleDeleteAndClose}>
              Yes
            </AlertDialogAction>
            <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
