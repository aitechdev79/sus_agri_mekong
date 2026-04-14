export const VIETNAM_TIME_ZONE = 'Asia/Ho_Chi_Minh'

const VIETNAM_OFFSET_MINUTES = 7 * 60

function getLocale(locale?: string) {
  return locale === 'en' ? 'en-US' : 'vi-VN'
}

export function formatVietnamDate(date: Date | string, locale?: string) {
  const value = typeof date === 'string' ? new Date(date) : date

  return value.toLocaleDateString(getLocale(locale), {
    timeZone: VIETNAM_TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export function formatVietnamDateTime(date: Date | string, locale?: string) {
  const value = typeof date === 'string' ? new Date(date) : date

  return value.toLocaleString(getLocale(locale), {
    timeZone: VIETNAM_TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

function getVietnamDateParts(date: Date | string) {
  const value = typeof date === 'string' ? new Date(date) : date
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: VIETNAM_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(value)

  const partMap = Object.fromEntries(parts.map((part) => [part.type, part.value]))

  return {
    year: partMap.year,
    month: partMap.month,
    day: partMap.day,
    hour: partMap.hour === '24' ? '00' : partMap.hour,
    minute: partMap.minute
  }
}

export function formatVietnamDateInput(date: Date | string) {
  const parts = getVietnamDateParts(date)
  return `${parts.year}-${parts.month}-${parts.day}`
}

export function formatVietnamDateTimeInput(date: Date | string) {
  const parts = getVietnamDateParts(date)
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`
}

export function parseVietnamDateTimeInput(value?: string | null, isAllDay?: boolean) {
  if (!value) return null

  const trimmed = value.trim()
  const normalized = isAllDay && /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? `${trimmed}T00:00` : trimmed
  const localDateTimeMatch = normalized.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/)

  if (localDateTimeMatch) {
    const [, year, month, day, hour, minute, second = '0'] = localDateTimeMatch
    const utcTime = Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second)
    )

    const date = new Date(utcTime - VIETNAM_OFFSET_MINUTES * 60 * 1000)
    if (Number.isNaN(date.getTime())) return null
    return date
  }

  const date = new Date(normalized)
  if (Number.isNaN(date.getTime())) return null
  return date
}
