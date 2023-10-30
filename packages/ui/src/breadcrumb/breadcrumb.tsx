/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react"

import { cn, getValidChildren } from "../utils"

export interface BreadcrumbSeparatorProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode
}

export const BreadcrumbSeparator = React.forwardRef<
  HTMLSpanElement,
  BreadcrumbSeparatorProps
>((props, ref) => {
  const { className, ...rest } = props
  return (
    <span
      ref={ref}
      role="presentation"
      className={cn("mx-2 text-foreground/60", className)}
      {...rest}
    />
  )
})

export interface BreadcrumbLinkProps {
  currentPage?: boolean
}

export const BreadcrumbLink = React.forwardRef<any, any>((props, ref) => {
  const { currentPage, as = "a", ...rest } = props
  const Comp = currentPage ? "span" : as

  return (
    <Comp
      ref={ref}
      className={
        currentPage
          ? "max-w-[100px] truncate whitespace-nowrap text-foreground/50 md:max-w-[200px] lg:max-w-[400px]"
          : "text-foreground/60"
      }
      aria-current={currentPage ? "page" : undefined}
      {...rest}
    />
  )
})

export interface BreadcrumbItemProps extends BreadcrumbProps {
  currentPage?: boolean
  lastChild?: boolean
  bold?: boolean
  semibold?: boolean
  medium?: boolean
}

export const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  BreadcrumbItemProps
>((props, ref) => {
  const {
    currentPage,
    separator,
    lastChild,
    addSeparator,
    children,
    bold = false,
    semibold = false,
    medium = false,
    className,
    ...rest
  } = props

  const validChildren = getValidChildren(children)
  const clones = validChildren.map((child) => {
    if (child.type === BreadcrumbLink) {
      return React.cloneElement(child, { currentPage })
    }

    if (child.type === BreadcrumbSeparator) {
      return React.cloneElement(child, {
        children: child.props.children || separator,
      })
    }

    return child
  })

  return (
    <li
      ref={ref}
      className={cn(
        "inline-flex items-center whitespace-nowrap text-xs md:text-sm",
        bold && "font-bold",
        semibold && "font-semibold",
        medium && "font-medium",
        className,
      )}
      {...rest}
    >
      {clones}
      {!lastChild && addSeparator && (
        <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
      )}
    </li>
  )
})

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  separator?: string | React.ReactElement
  addSeparator?: boolean
  children?: React.ReactNode
}

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  (props, ref) => {
    const {
      children,
      addSeparator = true,
      separator = "/",
      className,
      ...rest
    } = props
    const validChildren = getValidChildren(children)
    const clones = validChildren.map((child, index) => {
      return React.cloneElement(child, {
        addSeparator,
        separator,
        lastChild: validChildren.length === index + 1,
      })
    })

    return (
      <nav
        ref={ref}
        aria-label="breadcrumb"
        className={cn("relative mb-2", className)}
        {...rest}
      >
        <ol className="inline-flex">{clones}</ol>
      </nav>
    )
  },
)
