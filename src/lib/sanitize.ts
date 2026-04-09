import sanitizeHtml from 'sanitize-html'

const FONT_FAMILY_PATTERN = /^[\w\s,"'-]+$/
const FONT_SIZE_PATTERN = /^\d+(px|rem|em|%)$/
const TEXT_ALIGN_PATTERN = /^(left|right|center|justify)$/
const MARGIN_LEFT_PATTERN = /^(0|[0-9]+(\.[0-9]+)?rem)$/
const IMAGE_MARGIN_PATTERN = /^(0|auto)$/
const IMAGE_DISPLAY_PATTERN = /^block$/
const BLOCK_TAGS = ['p', 'li', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const
const BLOCK_STYLE_RULES = Object.fromEntries(
  BLOCK_TAGS.map((tag) => [
    tag,
    {
      'text-align': [TEXT_ALIGN_PATTERN],
      'margin-left': [MARGIN_LEFT_PATTERN]
    }
  ])
) as Record<string, { 'text-align': RegExp[]; 'margin-left': RegExp[] }>

export function sanitizeRichText(input: string) {
  const normalizedInput = (input || '').replace(/<p([^>]*)>\s*<\/p>/gi, '<p$1><br></p>')

  return sanitizeHtml(normalizedInput, {
    allowedTags: ['p', 'strong', 'em', 'u', 'a', 'span', 'br', 'img', 'ul', 'ol', 'li', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    allowedSchemes: ['http', 'https', 'data', 'mailto', 'tel'],
    allowedSchemesByTag: {
      img: ['http', 'https', 'data'],
      a: ['http', 'https', 'mailto', 'tel']
    },
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      span: ['style'],
      p: ['style', 'data-indent'],
      li: ['style', 'data-indent'],
      blockquote: ['style', 'data-indent'],
      h1: ['style', 'data-indent'],
      h2: ['style', 'data-indent'],
      h3: ['style', 'data-indent'],
      h4: ['style', 'data-indent'],
      h5: ['style', 'data-indent'],
      h6: ['style', 'data-indent'],
      img: ['src', 'alt', 'title', 'width', 'style', 'data-align']
    },
    allowedStyles: {
      ...BLOCK_STYLE_RULES,
      img: {
        display: [IMAGE_DISPLAY_PATTERN],
        'margin-left': [IMAGE_MARGIN_PATTERN],
        'margin-right': [IMAGE_MARGIN_PATTERN]
      },
      span: {
        'font-family': [FONT_FAMILY_PATTERN],
        'font-size': [FONT_SIZE_PATTERN]
      }
    },
    disallowedTagsMode: 'discard'
  })
}
