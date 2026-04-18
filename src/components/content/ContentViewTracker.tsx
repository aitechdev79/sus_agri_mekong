'use client'

import { useEffect } from 'react'

interface ContentViewTrackerProps {
  contentId: string
}

const DEDUPE_WINDOW_MS = 30_000

export function ContentViewTracker({ contentId }: ContentViewTrackerProps) {
  useEffect(() => {
    const storageKey = `content-view:${contentId}`
    const now = Date.now()
    const lastTrackedAt = Number(sessionStorage.getItem(storageKey) || 0)

    if (lastTrackedAt && now - lastTrackedAt < DEDUPE_WINDOW_MS) {
      return
    }

    sessionStorage.setItem(storageKey, String(now))

    fetch(`/api/content/${contentId}/view`, {
      method: 'POST',
      keepalive: true
    }).catch(() => {
      sessionStorage.removeItem(storageKey)
    })
  }, [contentId])

  return null
}
