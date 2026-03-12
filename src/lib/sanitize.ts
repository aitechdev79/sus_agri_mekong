import sanitizeHtml from 'sanitize-html'

const FONT_FAMILY_PATTERN = /^[\w\s,"'-]+$/
const FONT_SIZE_PATTERN = /^\d+(px|rem|em|%)$/
const TEXT_ALIGN_PATTERN = /^(left|right|center|justify)$/
const MARGIN_LEFT_PATTERN = /^(0|[0-9]+(\.[0-9]+)?rem)$/
const BLOCK_TAGS = ['p', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const
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
    allowedTags: ['p', 'strong', 'em', 'span', 'br', 'img', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    allowedSchemes: ['http', 'https', 'data'],
    allowedSchemesByTag: {
      img: ['http', 'https', 'data']
    },
    allowedAttributes: {
      span: ['style'],
      p: ['style', 'data-indent'],
      li: ['style', 'data-indent'],
      h1: ['style', 'data-indent'],
      h2: ['style', 'data-indent'],
      h3: ['style', 'data-indent'],
      h4: ['style', 'data-indent'],
      h5: ['style', 'data-indent'],
      h6: ['style', 'data-indent'],
      img: ['src', 'alt', 'title', 'width']
    },
    allowedStyles: {
      ...BLOCK_STYLE_RULES,
      span: {
        'font-family': [FONT_FAMILY_PATTERN],
        'font-size': [FONT_SIZE_PATTERN]
      }
    },
    disallowedTagsMode: 'discard'
  })
}
