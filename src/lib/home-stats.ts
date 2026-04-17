export const HOME_STATS_DEFAULTS = {
  publishedReports: 10,
  trackedPolicies: 20,
  members: 5000,
  supportedInitiatives: 15,
}

export type HomeStatsKey = keyof typeof HOME_STATS_DEFAULTS

export const HOME_STATS_SETTING_KEYS: Record<HomeStatsKey, string> = {
  publishedReports: 'home_stats_published_reports',
  trackedPolicies: 'home_stats_tracked_policies',
  members: 'home_stats_members',
  supportedInitiatives: 'home_stats_supported_initiatives',
}

export const HOME_STATS_FIELDS: Array<{
  key: HomeStatsKey
  labelVi: string
  labelEn: string
}> = [
  {
    key: 'publishedReports',
    labelVi: 'Số báo cáo được xuất bản',
    labelEn: 'Published reports',
  },
  {
    key: 'trackedPolicies',
    labelVi: 'Số chính sách đã theo dõi',
    labelEn: 'Tracked policies',
  },
  {
    key: 'members',
    labelVi: 'Số thành viên tham gia',
    labelEn: 'Community members',
  },
  {
    key: 'supportedInitiatives',
    labelVi: 'Số sáng kiến được hỗ trợ',
    labelEn: 'Supported initiatives',
  },
]

export function normalizeHomeStatValue(value: unknown) {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return null
  const parsed = Math.trunc(numeric)
  if (parsed < 0) return null
  return parsed
}
