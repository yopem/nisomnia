//TODO: use popover from dafunda-ui

"use client"

import * as React from "react"

import { Icon, IconButton } from "@nisomnia/ui/next"

type Placement =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-start"
  | "top-end"
  | "bottom-start"
  | "bottom-end"
  | "left-start"
  | "left-end"
  | "right-start"
  | "right-end"

interface CommentMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  button?: React.ReactNode
  placement?: Placement
}

interface ContentProps {
  children: React.ReactNode
}

export const CommentMenu = (props: CommentMenuProps) => {
  const { children, button, placement = "top" } = props
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const toggleCommentMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleItemClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }

  const handleOutsideClick = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false)
    }
  }

  React.useEffect(() => {
    document.addEventListener("click", handleOutsideClick, false)

    return () => {
      document.removeEventListener("click", handleOutsideClick, false)
    }
  }, [])

  const buttonElement = React.Children.toArray(children).find((child) => {
    const childElement = child as React.ReactElement
    return childElement.type === Button
  })

  const contentElement = React.Children.toArray(children).find((child) => {
    const childElement = child as React.ReactElement
    return childElement.type === Content
  })

  const getPlacementClass = (placement: Placement): string => {
    switch (placement) {
      case "top":
        return "origin-bottom top-0 translate-y-[-110%]"
      case "bottom":
        return "origin-top bottom-0 translate-y-full"
      case "left":
        return "origin-right left-0"
      case "right":
        return "origin-left right-0"
      case "top-start":
        return "origin-bottom left-0 top-0 translate-y-[-110%]"
      case "top-end":
        return "origin-bottom right-0 top-0 translate-y-[-110%]"
      case "bottom-start":
        return "origin-top left-0 bottom-0 translate-y-full"
      case "bottom-end":
        return "origin-top right-0 bottom-0 translate-y-full"
      case "left-start":
        return "origin-right top-0 translate-y-[-110%] left-0"
      case "left-end":
        return "origin-right bottom-0 left-0 translate-y-full"
      case "right-start":
        return "origin-left top-0 translate-y-[-110%] right-0"
      case "right-end":
        return "origin-left bottom-0 right-0 translate-y-full"
      default:
        return "origin-bottom top-0 translate-y-[-110%]"
    }
  }

  const defaultButton = (
    <IconButton>
      <Icon.Edit />
    </IconButton>
  )

  const buttonToRender = buttonElement ? buttonElement : button ?? defaultButton

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={toggleCommentMenu}>{buttonToRender}</div>

      <div
        className={`${
          isOpen ? "block" : "hidden"
        } absolute z-10 transform rounded-md bg-background shadow-lg transition duration-200 ease-out ${getPlacementClass(
          placement,
        )}`}
      >
        <div onClick={handleItemClick}>{contentElement}</div>
      </div>
    </div>
  )
}

const Button = ({ children }: { children: React.ReactNode }) => <>{children}</>
const Content = ({ children }: ContentProps) => <>{children}</>

CommentMenu.Button = Button
CommentMenu.Content = Content
