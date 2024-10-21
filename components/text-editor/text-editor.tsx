// TODO: translate with useScopeI18n
// TODO: styling link and youtube prompt

"use client"

import * as React from "react"
import {
  EditorContent as TextEditorContent,
  useEditor as useTextEditor,
} from "@tiptap/react"
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form"

import { TextEditorExtension } from "./text-editor-extension"
import { TextEditorMenu } from "./text-editor-menu"

export interface TextEditorProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  control: Control<TFieldValues>
  name: Path<TFieldValues>
  isClear?: boolean
}

const TextEditor = <TFieldValues extends FieldValues = FieldValues>(
  props: TextEditorProps<TFieldValues>,
) => {
  const { control, isClear, name } = props

  const {
    field: { value, onChange },
  } = useController({ control, name: name })

  const prevLocaleRef = React.useRef(isClear)

  const editor = useTextEditor({
    editable: true,
    autofocus: true,
    content: value,
    extensions: [TextEditorExtension],
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
  }, [isClear, editor?.commands])

  if (!editor) {
    return null
  }

  return (
    <>
      {editor && <TextEditorMenu editor={editor} />}
      {editor && (
        <TextEditorContent
          className="text-editor flex min-h-[80px] w-full"
          editor={editor}
        />
      )}
    </>
  )
}

export default TextEditor
