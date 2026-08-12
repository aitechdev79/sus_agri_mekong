const HTML_TAG_PATTERN = /<\/?[a-z][\s\S]*>/i
const COLOR_STYLE_PATTERN = /(?:^|;)\s*(?:color|background-color|-webkit-text-fill-color|opacity|filter|mix-blend-mode)\s*:[^;]+/gi
const EMPTY_STYLE_ATTR_PATTERN = /\sstyle=(['"])\s*\1/gi

function normalizeRichTextImageSources(html: string) {
  return html.replace(/<img\b([^>]*?)\bsrc=(['"])(.*?)\2([^>]*)>/gi, (_match, beforeSrc, quote, src, afterSrc) => {
    const trimmedSrc = String(src || '').trim()

    if (!trimmedSrc || /^https?:\/\//i.test(trimmedSrc) || /^data:image\//i.test(trimmedSrc) || trimmedSrc.startsWith('/')) {
      return `<img${beforeSrc}src=${quote}${trimmedSrc}${quote}${afterSrc}>`
    }

    if (trimmedSrc.startsWith('./uploads/')) {
      return `<img${beforeSrc}src=${quote}${trimmedSrc.replace('./uploads/', '/uploads/')}${quote}${afterSrc}>`
    }

    if (trimmedSrc.startsWith('uploads/')) {
      return `<img${beforeSrc}src=${quote}/${trimmedSrc}${quote}${afterSrc}>`
    }

    return `<img${beforeSrc}src=${quote}/${trimmedSrc.replace(/^\/+/, '')}${quote}${afterSrc}>`
  })
}

function normalizeRichTextInlineStyles(html: string) {
  return html
    .replace(/\sstyle=(['"])(.*?)\1/gi, (_match, quote, styleValue) => {
      const cleanedStyle = String(styleValue || '')
        .replace(COLOR_STYLE_PATTERN, '')
        .replace(/;;+/g, ';')
        .replace(/^;\s*|\s*;$/g, '')
        .trim()

      return cleanedStyle ? ` style=${quote}${cleanedStyle}${quote}` : ''
    })
    .replace(EMPTY_STYLE_ATTR_PATTERN, '')
}

export function renderRichTextContent(content: string | null | undefined): string {
  const safeContent = content || ''
  if (!safeContent.trim()) {
    return ''
  }

  if (HTML_TAG_PATTERN.test(safeContent)) {
    return normalizeRichTextInlineStyles(normalizeRichTextImageSources(safeContent))
  }

  return safeContent
    .split(/\n\s*\n/)
    .filter((paragraph) => paragraph.trim().length > 0)
    .map((paragraph) => `<p>${paragraph.trim().replace(/\n/g, '<br>')}</p>`)
    .join('\n')
}

