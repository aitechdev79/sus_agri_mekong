import sanitizeHtml from 'sanitize-html'

const FONT_FAMILY_PATTERN = /^[\w\s,"'-]+$/
const FONT_SIZE_PATTERN = /^\d+(px|rem|em|%)$/

export function sanitizeRichText(input: string) {
  return sanitizeHtml(input || '', {
    allowedTags: ['p', 'strong', 'em', 'span', 'br'],
    allowedAttributes: {
      span: ['style']
    },
    allowedStyles: {
      span: {
        'font-family': [FONT_FAMILY_PATTERN],
        'font-size': [FONT_SIZE_PATTERN]
      }
    },
    disallowedTagsMode: 'discard'
  })
}
