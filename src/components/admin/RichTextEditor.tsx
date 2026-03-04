'use client'

import { useEffect } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Mark, mergeAttributes } from '@tiptap/core'

type RichTextEditorProps = {
  value: string
  onChange: (value: string) => void
}

const FONT_FAMILIES = [
  { label: 'Default', value: '' },
  { label: 'Geist', value: 'Geist, sans-serif' },
  { label: 'Montserrat', value: 'Montserrat, sans-serif' },
  { label: 'Roboto', value: 'Roboto, sans-serif' }
]

const FONT_SIZES = ['14px', '16px', '18px', '20px', '24px']

const TextStyleMark = Mark.create({
  name: 'textStyle',

  addAttributes() {
    return {
      fontFamily: {
        default: null,
        parseHTML: element => element.style.fontFamily || null
      },
      fontSize: {
        default: null,
        parseHTML: element => element.style.fontSize || null
      }
    }
  },

  parseHTML() {
    return [{ tag: 'span' }]
  },

  renderHTML({ HTMLAttributes }) {
    const { fontFamily, fontSize, ...rest } = HTMLAttributes
    const styles: string[] = []
    if (fontFamily) styles.push(`font-family: ${fontFamily}`)
    if (fontSize) styles.push(`font-size: ${fontSize}`)
    const style = styles.length > 0 ? styles.join('; ') : null

    return [
      'span',
      mergeAttributes(rest, style ? { style } : {}),
      0
    ]
  }
})

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, TextStyleMark] as never,
    content: value || '',
    onUpdate({ editor: editorInstance }) {
      onChange(editorInstance.getHTML())
    }
  })

  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    if ((value || '') !== current) {
      editor.commands.setContent(value || '', { emitUpdate: false })
    }
  }, [editor, value])

  const applyTextStyle = (next: { fontFamily?: string | null; fontSize?: string | null }) => {
    if (!editor) return
    const current = editor.getAttributes('textStyle') as { fontFamily?: string | null; fontSize?: string | null }
    const updated = {
      fontFamily: next.fontFamily !== undefined ? next.fontFamily : current.fontFamily ?? null,
      fontSize: next.fontSize !== undefined ? next.fontSize : current.fontSize ?? null
    }

    const hasStyles = Boolean(updated.fontFamily || updated.fontSize)

    if (!hasStyles) {
      editor.chain().focus().unsetMark('textStyle').run()
      return
    }

    editor.chain().focus().setMark('textStyle', updated).run()
  }

  const currentTextStyle = editor?.getAttributes('textStyle') as {
    fontFamily?: string | null
    fontSize?: string | null
  } | null

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-green-500">
      <div className="flex flex-wrap items-center gap-2 border-b bg-gray-50 px-3 py-2">
        <button
          type="button"
          onClick={() => (editor?.chain() as never as { focus: () => { toggleBold: () => { run: () => void } } })?.focus().toggleBold().run()}
          className={`px-2 py-1 text-sm border rounded ${editor?.isActive('bold') ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'}`}
          disabled={!editor}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => (editor?.chain() as never as { focus: () => { toggleItalic: () => { run: () => void } } })?.focus().toggleItalic().run()}
          className={`px-2 py-1 text-sm border rounded ${editor?.isActive('italic') ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'}`}
          disabled={!editor}
        >
          Italic
        </button>

        <select
          className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
          value={currentTextStyle?.fontFamily || ''}
          onChange={(event) => {
            const nextValue = event.target.value || null
            applyTextStyle({ fontFamily: nextValue })
          }}
          disabled={!editor}
        >
          {FONT_FAMILIES.map(font => (
            <option key={font.label} value={font.value}>{font.label}</option>
          ))}
        </select>

        <select
          className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
          value={currentTextStyle?.fontSize || ''}
          onChange={(event) => {
            const nextValue = event.target.value || null
            applyTextStyle({ fontSize: nextValue })
          }}
          disabled={!editor}
        >
          <option value="">Font size</option>
          {FONT_SIZES.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>

      <EditorContent
        editor={editor}
        className="min-h-[200px] px-3 py-2 text-sm leading-relaxed focus:outline-none"
      />
    </div>
  )
}
