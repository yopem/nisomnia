"use client"

import * as React from "react"
import { EditorContent, useEditor } from "@tiptap/react"
import { useController } from "react-hook-form"

import { EditorKitExtension, EditorMenu } from "@nisomnia/editor"

import { useI18n } from "@/locales/client"

interface EditorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any
  isClear?: boolean
  fieldName: string
}

export const Editor = (props: EditorProps) => {
  const { control, isClear, fieldName } = props

  const t = useI18n()

  const {
    field: { value, onChange },
  } = useController({ control, name: fieldName })

  const prevLocaleRef = React.useRef(isClear)

  const editor = useEditor({
    extensions: [EditorKitExtension as never],
    editable: true,
    autofocus: true,
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  React.useEffect(() => {
    const handleLocaleChange = () => {
      editor?.commands.setContent("")
    }

    if (prevLocaleRef.current !== isClear) {
      handleLocaleChange()
    }

    prevLocaleRef.current = isClear
  }, [editor?.commands, isClear])

  return (
    <>
      <EditorMenu editor={editor} />
      <EditorContent editor={editor} />
      <p className="absolute bottom-0 right-0">
        {editor?.storage.characterCount.words()} {t("words")}
      </p>
    </>
  )
}
