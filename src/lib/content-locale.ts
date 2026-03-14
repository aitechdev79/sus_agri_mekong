export function isEnglishLocale(locale?: string | null) {
  if (!locale) return false
  return locale.toLowerCase().startsWith('en')
}

export function getLocaleFromPathname(pathname?: string | null) {
  if (!pathname) return 'vi'

  const segment = pathname.split('/')[1]
  if (segment === 'en' || segment === 'vi') {
    return segment
  }
  return 'vi'
}

export function pickLocalizedText(
  locale: string,
  vietnameseText?: string | null,
  englishText?: string | null
) {
  if (isEnglishLocale(locale) && englishText && englishText.trim().length > 0) {
    return englishText
  }
  return vietnameseText || ''
}

export function stripLocalePrefix(pathname?: string | null) {
  if (!pathname) return '/'
  const stripped = pathname.replace(/^\/(en|vi)(?=\/|$)/, '')
  return stripped || '/'
}

export function withLocalePrefix(path: string, locale?: string | null) {
  if (!path.startsWith('/')) return path
  if (locale !== 'en' && locale !== 'vi') return path
  if (path === '/') return `/${locale}`
  return `/${locale}${path}`
}
