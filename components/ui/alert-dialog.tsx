"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import type { VariantProps } from "class-variance-authority"

import { buttonVariants, type ButtonVariantProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DialogVariants } from "./dialog"

export const AlertDialog = AlertDialogPrimitive.Root

export const AlertDialogTrigger = AlertDialogPrimitive.Trigger

export const AlertDialogPortal = AlertDialogPrimitive.Portal

export const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>((props, ref) => {
  const { className, ...rest } = props

  return (
    <AlertDialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className,
      )}
      {...rest}
      ref={ref}
    />
  )
})

interface AlertDialogContentProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>,
    VariantProps<typeof DialogVariants> {}

export const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  AlertDialogContentProps
>((props, ref) => {
  const { side = "bottom", className, ...rest } = props

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        ref={ref}
        className={cn(DialogVariants({ side }), className)}
        {...rest}
      />
    </AlertDialogPortal>
  )
})

export const AlertDialogHeader = (
  props: React.HTMLAttributes<HTMLDivElement>,
) => {
  const { className, ...rest } = props

  return (
    <div
      className={cn(
        "flex flex-col space-y-2 text-center sm:text-left",
        className,
      )}
      {...rest}
    />
  )
}

export const AlertDialogFooter = (
  props: React.HTMLAttributes<HTMLDivElement>,
) => {
  const { className, ...rest } = props

  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
        className,
      )}
      {...rest}
    />
  )
}

export const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>((props, ref) => {
  const { className, ...rest } = props

  return (
    <AlertDialogPrimitive.Title
      ref={ref}
      className={cn("text-lg font-semibold text-foreground", className)}
      {...rest}
    />
  )
})

export const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>((props, ref) => {
  const { className, ...rest } = props

  return (
    <AlertDialogPrimitive.Description
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...rest}
    />
  )
})

interface AlertDialogActionProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>,
    ButtonVariantProps {}

export const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  AlertDialogActionProps
>((props, ref) => {
  const { className, variant = "danger", ...rest } = props

  return (
    <AlertDialogPrimitive.Action
      ref={ref}
      className={cn(buttonVariants({ variant, className }))}
      {...rest}
    />
  )
})

export const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>((props, ref) => {
  const { className, ...rest } = props

  return (
    <AlertDialogPrimitive.Cancel
      ref={ref}
      className={cn(
        buttonVariants({ variant: "outline" }),
        "mt-2 sm:mt-0",
        className,
      )}
      {...rest}
    />
  )
})
