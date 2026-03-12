'use client'

import { useEffect, useRef, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Extension, Mark, Node, mergeAttributes } from '@tiptap/core'
import { Plugin } from '@tiptap/pm/state'

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

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px']
const LIST_INDENT_STEP_REM = 1.5
const MAX_LIST_INDENT = 6

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

const ListIndentExtension = Extension.create({
  name: 'listIndent',

  addGlobalAttributes() {
    return [
      {
        types: ['paragraph', 'heading', 'listItem'],
        attributes: {
          indent: {
            default: 0,
            parseHTML: element => Number(element.getAttribute('data-indent') || 0),
            renderHTML: attributes => {
              const indent = Number(attributes.indent || 0)
              if (!indent) {
                return {}
              }

              return {
                'data-indent': indent,
                style: `margin-left: ${indent * LIST_INDENT_STEP_REM}rem`
              }
            }
          }
        }
      }
    ]
  }
})

const TextAlignExtension = Extension.create({
  name: 'textAlign',

  addGlobalAttributes() {
    return [
      {
        types: ['paragraph', 'heading', 'listItem'],
        attributes: {
          textAlign: {
            default: null,
            parseHTML: element => element.style.textAlign || null,
            renderHTML: attributes => {
              const textAlign = attributes.textAlign
              if (!textAlign) return {}
              return {
                style: `text-align: ${textAlign}`
              }
            }
          }
        }
      }
    ]
  }
})

const ImageNode = Node.create({
  name: 'image',
  group: 'block',
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: {
        default: null
      },
      alt: {
        default: null
      },
      title: {
        default: null
      }
    }
  },

  parseHTML() {
    return [{ tag: 'img[src]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'img',
      mergeAttributes(HTMLAttributes, {
        class: 'max-w-full h-auto rounded-md my-2'
      })
    ]
  }
})

const ImagePasteExtension = Extension.create<{
  uploadImage: (file: File) => Promise<string | null>
  onImageUploadStart: () => void
  onImageUploadEnd: () => void
  onImageUploadError: (message: string) => void
}>({
  name: 'imagePaste',

  addOptions() {
    return {
      uploadImage: async () => null,
      onImageUploadStart: () => undefined,
      onImageUploadEnd: () => undefined,
      onImageUploadError: () => undefined
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handlePaste: (_view, event) => {
            const imageFiles = Array.from(event.clipboardData?.files || []).filter((file) => file.type.startsWith('image/'))

            if (imageFiles.length === 0) {
              return false
            }

            event.preventDefault()
            this.options.onImageUploadStart()

            void (async () => {
              try {
                for (const file of imageFiles) {
                  const url = await this.options.uploadImage(file)
                  if (!url) continue

                  this.editor.chain()
                    .focus()
                    .insertContent([
                      { type: 'image', attrs: { src: url, alt: file.name || 'Pasted image' } },
                      { type: 'paragraph' }
                    ])
                    .run()
                }
              } catch (error) {
                const message = error instanceof Error ? error.message : 'Khong the tai anh len'
                this.options.onImageUploadError(message)
              } finally {
                this.options.onImageUploadEnd()
              }
            })()

            return true
          }
        }
      })
    ]
  }
})

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const lastSelectionRef = useRef<{ from: number; to: number } | null>(null)
  const [isImageUploading, setIsImageUploading] = useState(false)

  const uploadPastedImage = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    const result = await response.json().catch(() => null)
    if (!response.ok || !result?.success || !result?.file?.url) {
      throw new Error(result?.error || 'Khong the tai anh len')
    }

    return String(result.file.url)
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyleMark,
      ListIndentExtension,
      TextAlignExtension,
      ImageNode,
      ImagePasteExtension.configure({
        uploadImage: uploadPastedImage,
        onImageUploadStart: () => setIsImageUploading(true),
        onImageUploadEnd: () => setIsImageUploading(false),
        onImageUploadError: (message: string) => {
          setIsImageUploading(false)
          alert(message)
        }
      })
    ] as never,
    content: value || '',
    onSelectionUpdate({ editor: editorInstance }) {
      const { from, to } = editorInstance.state.selection
      lastSelectionRef.current = { from, to }
    },
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
      withSelection().unsetMark('textStyle').run()
      return
    }

    withSelection().setMark('textStyle', updated).run()
  }

  const currentTextStyle = editor?.getAttributes('textStyle') as {
    fontFamily?: string | null
    fontSize?: string | null
  } | null

  const withSelection = () => {
    if (!editor) return null
    let chain = editor.chain()
    if (lastSelectionRef.current) {
      chain = chain.setTextSelection(lastSelectionRef.current)
    }
    return chain.focus()
  }

  const handleToggleBold = () => {
    withSelection()?.toggleBold().run()
  }

  const handleToggleItalic = () => {
    withSelection()?.toggleItalic().run()
  }

  const handleToggleBulletList = () => {
    withSelection()?.toggleBulletList().run()
  }

  const handleToggleOrderedList = () => {
    withSelection()?.toggleOrderedList().run()
  }

  const activeFontSize = currentTextStyle?.fontSize || '12px'
  const isListActive = Boolean(editor?.isActive('bulletList') || editor?.isActive('orderedList'))
  const getIndentTargetType = () => {
    if (!editor) return 'paragraph' as const
    if (isListActive) return 'listItem' as const

    for (const level of [1, 2, 3, 4, 5, 6]) {
      if (editor.isActive('heading', { level })) {
        return 'heading' as const
      }
    }

    return 'paragraph' as const
  }

  const indentTargetType = getIndentTargetType()
  const currentIndent = Number(editor?.getAttributes(indentTargetType)?.indent || 0)
  const currentTextAlign = (editor?.getAttributes(indentTargetType)?.textAlign as string | undefined) || 'left'

  const handleSetTextAlign = (textAlign: 'left' | 'center' | 'right') => {
    withSelection()?.updateAttributes(indentTargetType, { textAlign }).run()
  }

  const handleIndent = () => {
    if (!editor) return
    const nextIndent = Math.min(currentIndent + 1, MAX_LIST_INDENT)
    withSelection()?.updateAttributes(indentTargetType, { indent: nextIndent }).run()
  }

  const handleOutdent = () => {
    if (!editor) return

    if (currentIndent > 0) {
      withSelection()?.updateAttributes(indentTargetType, { indent: currentIndent - 1 }).run()
      return
    }

    if (isListActive) {
      withSelection()?.liftListItem('listItem').run()
    }
  }

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-green-500">
      <div className="flex flex-wrap items-center gap-2 border-b bg-gray-50 px-3 py-2">
        <button
          type="button"
          onClick={handleToggleBold}
          className={`px-2 py-1 text-sm border rounded ${editor?.isActive('bold') ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'}`}
          disabled={!editor}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={handleToggleItalic}
          className={`px-2 py-1 text-sm border rounded ${editor?.isActive('italic') ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'}`}
          disabled={!editor}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={handleToggleBulletList}
          className={`px-2 py-1 text-sm border rounded ${editor?.isActive('bulletList') ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'}`}
          disabled={!editor}
        >
          Bullet
        </button>
        <button
          type="button"
          onClick={handleToggleOrderedList}
          className={`px-2 py-1 text-sm border rounded ${editor?.isActive('orderedList') ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'}`}
          disabled={!editor}
        >
          Numbering
        </button>
        <button
          type="button"
          onClick={handleOutdent}
          className="px-2 py-1 text-sm border rounded bg-white text-gray-700 border-gray-300"
          disabled={!editor}
        >
          Outdent
        </button>
        <button
          type="button"
          onClick={handleIndent}
          className="px-2 py-1 text-sm border rounded bg-white text-gray-700 border-gray-300"
          disabled={!editor}
        >
          Indent
        </button>
        <button
          type="button"
          onClick={() => handleSetTextAlign('left')}
          className={`px-2 py-1 text-sm border rounded ${currentTextAlign === 'left' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'}`}
          disabled={!editor}
        >
          Left
        </button>
        <button
          type="button"
          onClick={() => handleSetTextAlign('center')}
          className={`px-2 py-1 text-sm border rounded ${currentTextAlign === 'center' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'}`}
          disabled={!editor}
        >
          Center
        </button>
        <button
          type="button"
          onClick={() => handleSetTextAlign('right')}
          className={`px-2 py-1 text-sm border rounded ${currentTextAlign === 'right' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'}`}
          disabled={!editor}
        >
          Right
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
          value={activeFontSize}
          onChange={(event) => {
            const nextValue = event.target.value || null
            applyTextStyle({ fontSize: nextValue })
          }}
          disabled={!editor}
        >
          {FONT_SIZES.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>
      {isImageUploading && (
        <div className="border-b bg-amber-50 px-3 py-2 text-xs text-amber-700">
          Dang tai anh da paste...
        </div>
      )}

      <EditorContent
        editor={editor}
        className="min-h-[200px] px-3 py-2 text-[12px] leading-relaxed focus:outline-none [&_.ProseMirror]:min-h-[180px] [&_.ProseMirror]:outline-none [&_.ProseMirror_p]:my-2 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_li>p]:my-1"
      />
    </div>
  )
}
