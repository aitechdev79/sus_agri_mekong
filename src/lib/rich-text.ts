const HTML_TAG_PATTERN = /<\/?[a-z][\s\S]*>/i

export function renderRichTextContent(content: string | null | undefined): string {
  const safeContent = content || ''
  if (!safeContent.trim()) {
    return ''
  }

  if (HTML_TAG_PATTERN.test(safeContent)) {
    return safeContent
  }

  return safeContent
    .split(/\n\s*\n/)
    .filter((paragraph) => paragraph.trim().length > 0)
    .map((paragraph) => `<p>${paragraph.trim().replace(/\n/g, '<br>')}</p>`)
    .join('\n')
}

