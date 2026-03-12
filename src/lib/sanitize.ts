import sanitizeHtml from 'sanitize-html'

const FONT_FAMILY_PATTERN = /^[\w\s,"'-]+$/
const FONT_SIZE_PATTERN = /^\d+(px|rem|em|%)$/
const TEXT_ALIGN_PATTERN = /^(left|right|center|justify)$/

export function sanitizeRichText(input: string) {
  return sanitizeHtml(input || '', {
    allowedTags: ['p', 'strong', 'em', 'span', 'br', 'img'],
    allowedSchemes: ['http', 'https', 'data'],
    allowedSchemesByTag: {
      img: ['http', 'https', 'data']
    },
    allowedAttributes: {
      span: ['style'],
      p: ['style'],
      img: ['src', 'alt', 'title', 'width']
    },
    allowedStyles: {
      p: {
        'text-align': [TEXT_ALIGN_PATTERN]
      },
      span: {
        'font-family': [FONT_FAMILY_PATTERN],
        'font-size': [FONT_SIZE_PATTERN]
      }
    },
    disallowedTagsMode: 'discard'
  })
}
