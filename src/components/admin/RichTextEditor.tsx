'use client'

import { useEffect, useRef, useState } from 'react'
import { EditorContent, NodeViewProps, NodeViewWrapper, ReactNodeViewRenderer, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Extension, Mark, Node, mergeAttributes } from '@tiptap/core'
import { Plugin } from '@tiptap/pm/state'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Image as ImageIcon,
  IndentDecrease,
  IndentIncrease,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Underline,
  Unlink2
} from 'lucide-react'

type RichTextEditorProps = {
  value: string
  onChange: (value: string) => void
}

type ImageAlignment = 'left' | 'center' | 'right'

const FONT_FAMILIES = [
  { label: 'Default', value: '' },
  { label: 'Geist', value: 'Geist, sans-serif' },
  { label: 'Montserrat', value: 'Montserrat, sans-serif' },
  { label: 'Roboto', value: 'Roboto, sans-serif' }
]

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px']
const LIST_INDENT_STEP_REM = 1.5
const MAX_LIST_INDENT = 6
const MIN_IMAGE_WIDTH_PX = 120
const MAX_PASTED_IMAGE_DIMENSION_PX = 1600
const PASTED_IMAGE_JPEG_QUALITY = 0.85
const MAX_RICH_TEXT_IMAGE_UPLOAD_SIZE = 900 * 1024
const TOOLBAR_ICON_CLASS = 'h-4 w-4'

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function selectedTextToBlockquoteHtml(value: string) {
  return value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br>')}</p>`)
    .join('')
}

function selectedTextToParagraphHtml(value: string, attributes = '') {
  return value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p${attributes}>${escapeHtml(paragraph).replace(/\n/g, '<br>')}</p>`)
    .join('')
}

function selectedTextToListHtml(value: string, listTag: 'ul' | 'ol') {
  const items = value
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => `<li><p>${escapeHtml(item)}</p></li>`)
    .join('')

  return items ? `<${listTag}>${items}</${listTag}>` : ''
}

function ResizableImageNodeView({ node, selected, updateAttributes, editor }: NodeViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const widthRef = useRef<number | null>(typeof node.attrs.width === 'number' ? node.attrs.width : null)
  const [displayWidth, setDisplayWidth] = useState<number | null>(widthRef.current)
  const alignment = (node.attrs.align as ImageAlignment | null) || 'left'

  useEffect(() => {
    const nextWidth = typeof node.attrs.width === 'number' ? node.attrs.width : null
    widthRef.current = nextWidth
    setDisplayWidth(nextWidth)
  }, [node.attrs.width])

  const handleResizeStart = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!editor.isEditable) return
    event.preventDefault()
    event.stopPropagation()

    const container = containerRef.current
    if (!container) return

    const startX = event.clientX
    const startWidth = container.getBoundingClientRect().width
    const parentWidth = container.parentElement?.getBoundingClientRect().width || startWidth
    const maxWidth = Math.max(MIN_IMAGE_WIDTH_PX, Math.round(parentWidth))

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX
      const nextWidth = Math.max(MIN_IMAGE_WIDTH_PX, Math.min(Math.round(startWidth + delta), maxWidth))
      widthRef.current = nextWidth
      setDisplayWidth(nextWidth)
    }

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      updateAttributes({ width: widthRef.current })
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const imageStyle = displayWidth
    ? { width: `${displayWidth}px`, maxWidth: '100%', height: 'auto' as const }
    : { maxWidth: '100%', height: 'auto' as const }

  const wrapperClassName = [
    'relative block w-fit max-w-full',
    alignment === 'center' ? 'mx-auto' : '',
    alignment === 'right' ? 'ml-auto' : '',
    selected ? 'ring-2 ring-green-500 rounded-md' : ''
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <NodeViewWrapper as="div" className="my-2">
      <div
        ref={containerRef}
        className={wrapperClassName}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- Rich text content image must render dynamic uploaded URLs */}
        <img
          src={String(node.attrs.src || '')}
          alt={String(node.attrs.alt || '')}
          title={String(node.attrs.title || '')}
          className="block rounded-md"
          style={imageStyle}
          draggable={false}
        />
        {editor.isEditable && (
          <div
            role="presentation"
            onMouseDown={handleResizeStart}
            className="absolute -bottom-1 -right-1 h-3 w-3 cursor-se-resize rounded-sm border border-white bg-green-600 shadow"
            title="Drag to resize"
          />
        )}
      </div>
    </NodeViewWrapper>
  )
}

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

const UnderlineMark = Mark.create({
  name: 'underline',

  parseHTML() {
    return [
      { tag: 'u' },
      {
        style: 'text-decoration',
        getAttrs: value => typeof value === 'string' && value.includes('underline') ? {} : false
      }
    ]
  },

  renderHTML() {
    return ['u', 0]
  }
})

const LinkMark = Mark.create({
  name: 'link',

  inclusive: false,

  addAttributes() {
    return {
      href: {
        default: null
      },
      target: {
        default: '_blank'
      },
      rel: {
        default: 'noopener noreferrer'
      }
    }
  },

  parseHTML() {
    return [{ tag: 'a[href]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['a', mergeAttributes(HTMLAttributes), 0]
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
      },
      align: {
        default: 'left',
        parseHTML: (element) => {
          const dataAlign = element.getAttribute('data-align')
          if (dataAlign === 'center' || dataAlign === 'right' || dataAlign === 'left') {
            return dataAlign
          }

          const marginLeft = element.style.marginLeft
          const marginRight = element.style.marginRight
          if (marginLeft === 'auto' && marginRight === 'auto') return 'center'
          if (marginLeft === 'auto') return 'right'
          return 'left'
        },
        renderHTML: (attributes) => {
          const align = attributes.align === 'center' || attributes.align === 'right' ? attributes.align : 'left'
          const styleByAlign =
            align === 'center'
              ? 'display: block; margin-left: auto; margin-right: auto;'
              : align === 'right'
                ? 'display: block; margin-left: auto; margin-right: 0;'
                : 'display: block; margin-left: 0; margin-right: auto;'

          return {
            'data-align': align,
            style: styleByAlign
          }
        }
      },
      width: {
        default: null,
        parseHTML: (element) => {
          const widthAttr = Number.parseInt(element.getAttribute('width') || '', 10)
          if (Number.isFinite(widthAttr) && widthAttr > 0) {
            return widthAttr
          }

          const widthFromStyle = Number.parseInt(element.style.width || '', 10)
          if (Number.isFinite(widthFromStyle) && widthFromStyle > 0) {
            return widthFromStyle
          }

          return null
        },
        renderHTML: (attributes) => {
          const width = Number(attributes.width)
          if (!Number.isFinite(width) || width <= 0) {
            return {}
          }
          return { width: String(Math.round(width)) }
        }
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
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageNodeView)
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
    const insertImage = (src: string, alt: string, insertAt?: number) => {
      const chain = this.editor.chain().focus()

      if (typeof insertAt === 'number') {
        chain.insertContentAt(insertAt, [
          { type: 'image', attrs: { src, alt } },
          { type: 'paragraph' }
        ])
      } else {
        chain.insertContent([
          { type: 'image', attrs: { src, alt } },
          { type: 'paragraph' }
        ])
      }

      chain.run()
    }

    const uploadAndInsertImages = (files: File[], insertAt?: number) => {
      this.options.onImageUploadStart()

      void (async () => {
        try {
          let currentInsertAt = insertAt

          for (const file of files) {
            const url = await this.options.uploadImage(file)
            if (!url) continue

            insertImage(url, file.name || 'Pasted image', currentInsertAt)
            if (typeof currentInsertAt === 'number') {
              currentInsertAt += 2
            }
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Khong the tai anh len.'
          this.options.onImageUploadError(message)
        } finally {
          this.options.onImageUploadEnd()
        }
      })()
    }

    return [
      new Plugin({
        props: {
          handlePaste: (_view, event) => {
            const clipboard = event.clipboardData
            if (!clipboard) return false

            const imageFilesFromFiles = Array.from(clipboard.files || []).filter((file) => file.type.startsWith('image/'))
            const imageFilesFromItems = Array.from(clipboard.items || [])
              .filter((item) => item.kind === 'file' && item.type.startsWith('image/'))
              .map((item) => item.getAsFile())
              .filter((file): file is File => Boolean(file))
            const imageFiles = [...imageFilesFromFiles, ...imageFilesFromItems]

            if (imageFiles.length > 0) {
              event.preventDefault()
              uploadAndInsertImages(imageFiles)
              return true
            }

            const html = clipboard.getData('text/html') || ''
            const htmlImageSources = Array.from(html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi))
              .map((match) => (match[1] || '').trim())
              .filter((src) => /^(https?:\/\/|data:image\/|\/uploads\/|\.?\/uploads\/)/i.test(src))
              .filter(Boolean)

            if (htmlImageSources.length > 0) {
              event.preventDefault()
              for (const src of htmlImageSources) {
                insertImage(src, 'Pasted image')
              }
              return true
            }

            const pastedText = (clipboard.getData('text/plain') || '').trim()
            const isImageUrl = /^(https?:\/\/\S+|data:image\/\w+;base64,\S+)$/i.test(pastedText)
            if (isImageUrl) {
              event.preventDefault()
              insertImage(pastedText, 'Pasted image')
              return true
            }

            return false
          },
          handleDrop: (view, event, _slice, moved) => {
            if (moved) return false

            const transfer = event.dataTransfer
            if (!transfer) return false

            const imageFiles = Array.from(transfer.files || []).filter((file) => file.type.startsWith('image/'))
            if (imageFiles.length === 0) return false

            event.preventDefault()

            const coords = view.posAtCoords({ left: event.clientX, top: event.clientY })
            const insertAt = coords?.pos

            uploadAndInsertImages(imageFiles, insertAt)
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

  const loadImageElement = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new window.Image()
      image.onload = () => resolve(image)
      image.onerror = () => reject(new Error('Không thể đọc ảnh đã paste.'))
      image.src = src
    })

  const toDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Không thể đọc ảnh từ clipboard.'))
    reader.readAsDataURL(file)
  })

  const resizePastedImage = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      return file
    }

    const sourceUrl = await toDataUrl(file)
    const image = await loadImageElement(sourceUrl)
    const longestSide = Math.max(image.width, image.height)
    const shouldResize = longestSide > MAX_PASTED_IMAGE_DIMENSION_PX
    const shouldCompress = file.size > MAX_RICH_TEXT_IMAGE_UPLOAD_SIZE

    if (!shouldResize && !shouldCompress) {
      return file
    }

    const scale = shouldResize ? MAX_PASTED_IMAGE_DIMENSION_PX / longestSide : 1
    const targetWidth = Math.max(1, Math.round(image.width * scale))
    const targetHeight = Math.max(1, Math.round(image.height * scale))
    const canvas = document.createElement('canvas')
    canvas.width = targetWidth
    canvas.height = targetHeight

    const context = canvas.getContext('2d')
    if (!context) {
      return file
    }

    context.drawImage(image, 0, 0, targetWidth, targetHeight)

    const supportsTransparency = file.type === 'image/png' || file.type === 'image/webp'
    const attemptEncode = (outputType: string, quality?: number) =>
      new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, outputType, quality)
      })

    let outputType = supportsTransparency ? 'image/webp' : 'image/jpeg'
    let quality = outputType === 'image/jpeg' || outputType === 'image/webp' ? PASTED_IMAGE_JPEG_QUALITY : undefined
    let blob = await attemptEncode(outputType, quality)

    if (blob && blob.size > MAX_RICH_TEXT_IMAGE_UPLOAD_SIZE && (outputType === 'image/jpeg' || outputType === 'image/webp')) {
      const qualitySteps = [0.78, 0.72, 0.66, 0.6]
      for (const nextQuality of qualitySteps) {
        const nextBlob = await attemptEncode(outputType, nextQuality)
        if (!nextBlob) continue
        blob = nextBlob
        quality = nextQuality
        if (blob.size <= MAX_RICH_TEXT_IMAGE_UPLOAD_SIZE) break
      }
    }

    if (blob && blob.size > MAX_RICH_TEXT_IMAGE_UPLOAD_SIZE) {
      outputType = 'image/jpeg'
      const qualitySteps = [0.78, 0.7, 0.62, 0.55]
      for (const nextQuality of qualitySteps) {
        const nextBlob = await attemptEncode(outputType, nextQuality)
        if (!nextBlob) continue
        blob = nextBlob
        quality = nextQuality
        if (blob.size <= MAX_RICH_TEXT_IMAGE_UPLOAD_SIZE) break
      }
    }

    if (!blob) {
      return file
    }

    const extension = outputType === 'image/webp' ? 'webp' : 'jpg'
    const baseName = file.name.replace(/\.[^.]+$/, '') || 'pasted-image'

    return new File([blob], `${baseName}.${extension}`, {
      type: outputType,
      lastModified: Date.now()
    })
  }

  const uploadPastedImage = async (file: File) => {
    const preparedFile = await resizePastedImage(file)

    try {
      const formData = new FormData()
      formData.append('file', preparedFile)

      const response = await fetch('/api/upload/file-only', {
        method: 'POST',
        body: formData
      })

      const result = await response.json().catch(() => null)
      if (response.ok && result?.success && result?.file?.url) {
        return String(result.file.url)
      }

      if (preparedFile.type.startsWith('image/') && preparedFile.size <= MAX_RICH_TEXT_IMAGE_UPLOAD_SIZE) {
        return await toDataUrl(preparedFile)
      }

      const suggestion = result?.suggestion ? ` ${result.suggestion}` : ''
      throw new Error((result?.error || 'Không thể tải ảnh lên.') + suggestion)
    } catch {
      if (preparedFile.type.startsWith('image/') && preparedFile.size <= MAX_RICH_TEXT_IMAGE_UPLOAD_SIZE) {
        return await toDataUrl(preparedFile)
      }
      throw new Error('Không thể tải ảnh lên sau khi đã tự nén ảnh. Hãy thử ảnh nhỏ hơn, cắt bớt ảnh, hoặc đổi sang JPG/WebP.')
    }
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyleMark,
      UnderlineMark,
      LinkMark,
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
      withSelection()?.unsetMark('textStyle').run()
      return
    }

    withSelection()?.setMark('textStyle', updated).run()
  }

  const currentTextStyle = editor?.getAttributes('textStyle') as {
    fontFamily?: string | null
    fontSize?: string | null
  } | null
  const currentImageAlignment = ((editor?.getAttributes('image')?.align as ImageAlignment | undefined) || 'left')

  const withSelection = () => {
    if (!editor) return null
    let chain = editor.chain()
    if (lastSelectionRef.current) {
      chain = chain.setTextSelection(lastSelectionRef.current)
    }
    return chain.focus()
  }

  const getStoredSelectionRange = () => {
    if (!editor) return null
    return lastSelectionRef.current || editor.state.selection
  }

  const getInlineBlockFormatRange = () => {
    if (!editor) return null

    const selectionRange = getStoredSelectionRange()
    if (!selectionRange) return null

    const { from, to } = selectionRange
    const $from = editor.state.doc.resolve(from)
    const $to = editor.state.doc.resolve(to)
    const selectedText = editor.state.doc.textBetween(from, to, '\n', '\n').trim()
    const isPartialSingleBlockSelection =
      from !== to &&
      selectedText.length > 0 &&
      $from.sameParent($to) &&
      ($from.parentOffset > 0 || $to.parentOffset < $to.parent.content.size)

    if (isPartialSingleBlockSelection) {
      return { from, to, text: selectedText }
    }

    if (from !== to || !$from.parent.isTextblock) {
      return null
    }

    const parent = $from.parent
    const parentStart = $from.start()
    const parentSize = parent.content.size
    let segmentStart = 0
    const segments: Array<{ start: number; end: number }> = []

    parent.forEach((node, offset) => {
      if (node.type.name === 'hardBreak') {
        segments.push({ start: segmentStart, end: offset })
        segmentStart = offset + node.nodeSize
        return
      }

      if (node.isText && node.text?.includes('\n')) {
        for (const match of node.text.matchAll(/\n/g)) {
          const delimiterOffset = offset + (match.index || 0)
          segments.push({ start: segmentStart, end: delimiterOffset })
          segmentStart = delimiterOffset + 1
        }
      }
    })
    segments.push({ start: segmentStart, end: parentSize })

    const activeSegment = segments.find((segment) => (
      $from.parentOffset >= segment.start &&
      $from.parentOffset <= segment.end &&
      segment.end > segment.start
    ))

    if (!activeSegment) return null
    if (activeSegment.start === 0 && activeSegment.end === parentSize) return null

    const segmentFrom = parentStart + activeSegment.start
    const segmentTo = parentStart + activeSegment.end
    const segmentText = editor.state.doc.textBetween(segmentFrom, segmentTo, '\n', '\n').trim()

    if (!segmentText) return null

    return {
      from: segmentFrom,
      to: segmentTo,
      text: segmentText
    }
  }

  const replaceInlineBlockWithHtml = (buildHtml: (text: string) => string) => {
    if (!editor) return false

    const range = getInlineBlockFormatRange()
    if (!range) return false

    const html = buildHtml(range.text)
    if (!html) return false

    editor
      .chain()
      .setTextSelection({ from: range.from, to: range.to })
      .focus()
      .insertContentAt({ from: range.from, to: range.to }, html)
      .run()

    return true
  }

  const handleToggleBold = () => {
    withSelection()?.toggleBold().run()
  }

  const handleToggleItalic = () => {
    withSelection()?.toggleItalic().run()
  }

  const handleToggleUnderline = () => {
    if (!editor) return

    if (editor.isActive('underline')) {
      withSelection()?.unsetMark('underline').run()
      return
    }

    withSelection()?.setMark('underline').run()
  }

  const handleToggleBulletList = () => {
    if (replaceInlineBlockWithHtml((text) => selectedTextToListHtml(text, 'ul'))) return
    withSelection()?.toggleBulletList().run()
  }

  const handleToggleOrderedList = () => {
    if (replaceInlineBlockWithHtml((text) => selectedTextToListHtml(text, 'ol'))) return
    withSelection()?.toggleOrderedList().run()
  }

  const handleToggleBlockquote = () => {
    if (replaceInlineBlockWithHtml((text) => `<blockquote>${selectedTextToBlockquoteHtml(text)}</blockquote>`)) return
    withSelection()?.toggleBlockquote().run()
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
  const currentLinkHref = (editor?.getAttributes('link')?.href as string | undefined) || ''
  const handleSetTextAlign = (textAlign: 'left' | 'center' | 'right' | 'justify') => {
    if (replaceInlineBlockWithHtml((text) => selectedTextToParagraphHtml(text, ` style="text-align: ${textAlign}"`))) return
    withSelection()?.updateAttributes(indentTargetType, { textAlign }).run()
  }

  const normalizeLinkHref = (href: string) => {
    const trimmed = href.trim()
    if (!trimmed) return ''
    if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) return trimmed
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return `mailto:${trimmed}`
    return `https://${trimmed}`
  }

  const handleSetLink = () => {
    if (!editor) return

    const nextHref = window.prompt('Nhap URL', currentLinkHref || 'https://')
    if (nextHref === null) return

    const normalizedHref = normalizeLinkHref(nextHref)
    if (!normalizedHref) {
      withSelection()?.unsetMark('link').run()
      return
    }

    withSelection()?.setMark('link', {
      href: normalizedHref,
      target: '_blank',
      rel: 'noopener noreferrer'
    }).run()
  }

  const handleUnsetLink = () => {
    withSelection()?.unsetMark('link').run()
  }

  const handleSetImageAlignment = (align: ImageAlignment) => {
    if (!editor) return
    editor.chain().focus().updateAttributes('image', { align }).run()
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
          className={`inline-flex h-9 w-9 items-center justify-center border rounded ${editor?.isActive('bold') ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'}`}
          disabled={!editor}
          title="Bold"
          aria-label="Bold"
        >
          <Bold className={TOOLBAR_ICON_CLASS} />
        </button>
        <button
          type="button"
          onClick={handleToggleItalic}
          className={`inline-flex h-9 w-9 items-center justify-center border rounded ${editor?.isActive('italic') ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'}`}
          disabled={!editor}
          title="Italic"
          aria-label="Italic"
        >
          <Italic className={TOOLBAR_ICON_CLASS} />
        </button>
        <button
          type="button"
          onClick={handleToggleUnderline}
          className={`inline-flex h-9 w-9 items-center justify-center border rounded ${editor?.isActive('underline') ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'}`}
          disabled={!editor}
          title="Underline"
          aria-label="Underline"
        >
          <Underline className={TOOLBAR_ICON_CLASS} />
        </button>
        <button
          type="button"
          onClick={handleToggleBulletList}
          className={`inline-flex h-9 w-9 items-center justify-center border rounded ${editor?.isActive('bulletList') ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'}`}
          disabled={!editor}
          title="Bullet list"
          aria-label="Bullet list"
        >
          <List className={TOOLBAR_ICON_CLASS} />
        </button>
        <button
          type="button"
          onClick={handleToggleOrderedList}
          className={`inline-flex h-9 w-9 items-center justify-center border rounded ${editor?.isActive('orderedList') ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'}`}
          disabled={!editor}
          title="Numbered list"
          aria-label="Numbered list"
        >
          <ListOrdered className={TOOLBAR_ICON_CLASS} />
        </button>
        <button
          type="button"
          onClick={handleToggleBlockquote}
          className={`inline-flex h-9 w-9 items-center justify-center border rounded ${editor?.isActive('blockquote') ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'}`}
          disabled={!editor}
          title="Blockquote"
          aria-label="Blockquote"
        >
          <Quote className={TOOLBAR_ICON_CLASS} />
        </button>
        <button
          type="button"
          onClick={handleOutdent}
          className="inline-flex h-9 w-9 items-center justify-center border rounded bg-white text-gray-700 border-gray-300"
          disabled={!editor}
          title="Outdent"
          aria-label="Outdent"
        >
          <IndentDecrease className={TOOLBAR_ICON_CLASS} />
        </button>
        <button
          type="button"
          onClick={handleIndent}
          className="inline-flex h-9 w-9 items-center justify-center border rounded bg-white text-gray-700 border-gray-300"
          disabled={!editor}
          title="Indent"
          aria-label="Indent"
        >
          <IndentIncrease className={TOOLBAR_ICON_CLASS} />
        </button>
        <button
          type="button"
          onClick={() => handleSetTextAlign('left')}
          className={`inline-flex h-9 w-9 items-center justify-center border rounded ${currentTextAlign === 'left' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'}`}
          disabled={!editor}
          title="Align left"
          aria-label="Align left"
        >
          <AlignLeft className={TOOLBAR_ICON_CLASS} />
        </button>
        <button
          type="button"
          onClick={() => handleSetTextAlign('center')}
          className={`inline-flex h-9 w-9 items-center justify-center border rounded ${currentTextAlign === 'center' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'}`}
          disabled={!editor}
          title="Align center"
          aria-label="Align center"
        >
          <AlignCenter className={TOOLBAR_ICON_CLASS} />
        </button>
        <button
          type="button"
          onClick={() => handleSetTextAlign('right')}
          className={`inline-flex h-9 w-9 items-center justify-center border rounded ${currentTextAlign === 'right' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'}`}
          disabled={!editor}
          title="Align right"
          aria-label="Align right"
        >
          <AlignRight className={TOOLBAR_ICON_CLASS} />
        </button>
        <button
          type="button"
          onClick={() => handleSetTextAlign('justify')}
          className={`inline-flex h-9 w-9 items-center justify-center border rounded ${currentTextAlign === 'justify' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'}`}
          disabled={!editor}
          title="Justify"
          aria-label="Justify"
        >
          <AlignJustify className={TOOLBAR_ICON_CLASS} />
        </button>
        <button
          type="button"
          onClick={handleSetLink}
          className={`inline-flex h-9 w-9 items-center justify-center border rounded ${editor?.isActive('link') ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'}`}
          disabled={!editor}
          title="Set link"
          aria-label="Set link"
        >
          <Link2 className={TOOLBAR_ICON_CLASS} />
        </button>
        <button
          type="button"
          onClick={handleUnsetLink}
          className="inline-flex h-9 w-9 items-center justify-center border rounded bg-white text-gray-700 border-gray-300"
          disabled={!editor}
          title="Remove link"
          aria-label="Remove link"
        >
          <Unlink2 className={TOOLBAR_ICON_CLASS} />
        </button>

        <button
          type="button"
          onClick={() => handleSetImageAlignment('left')}
          className={`inline-flex h-9 w-9 items-center justify-center border rounded ${currentImageAlignment === 'left' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'}`}
          disabled={!editor}
          title="Image align left"
          aria-label="Image align left"
        >
          <div className="relative">
            <ImageIcon className={TOOLBAR_ICON_CLASS} />
            <AlignLeft className="absolute -bottom-1 -right-1 h-3 w-3" />
          </div>
        </button>
        <button
          type="button"
          onClick={() => handleSetImageAlignment('center')}
          className={`inline-flex h-9 w-9 items-center justify-center border rounded ${currentImageAlignment === 'center' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'}`}
          disabled={!editor}
          title="Image align center"
          aria-label="Image align center"
        >
          <div className="relative">
            <ImageIcon className={TOOLBAR_ICON_CLASS} />
            <AlignCenter className="absolute -bottom-1 -right-1 h-3 w-3" />
          </div>
        </button>
        <button
          type="button"
          onClick={() => handleSetImageAlignment('right')}
          className={`inline-flex h-9 w-9 items-center justify-center border rounded ${currentImageAlignment === 'right' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'}`}
          disabled={!editor}
          title="Image align right"
          aria-label="Image align right"
        >
          <div className="relative">
            <ImageIcon className={TOOLBAR_ICON_CLASS} />
            <AlignRight className="absolute -bottom-1 -right-1 h-3 w-3" />
          </div>
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
          Dang tai anh...
        </div>
      )}

      <EditorContent
        editor={editor}
        className="min-h-[200px] px-3 py-2 text-[12px] leading-relaxed focus:outline-none [&_.ProseMirror]:min-h-[180px] [&_.ProseMirror]:outline-none [&_.ProseMirror_p]:my-2 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_li>p]:my-1 [&_.ProseMirror_blockquote]:my-4 [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-green-600 [&_.ProseMirror_blockquote]:bg-green-50/60 [&_.ProseMirror_blockquote]:px-4 [&_.ProseMirror_blockquote]:py-3 [&_.ProseMirror_blockquote]:italic"
      />
    </div>
  )
}

