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
    labelVi: 'Báo cáo, nghiên cứu đã xuất bản',
    labelEn: 'Published reports',
  },
  {
    key: 'trackedPolicies',
    labelVi: 'Chính sách, quy định pháp luật đã chia sẻ',
    labelEn: 'Tracked policies',
  },
  {
    key: 'members',
    labelVi: 'Hội viên và đối tác tham gia',
    labelEn: 'Community members',
  },
  {
    key: 'supportedInitiatives',
    labelVi: 'Thực hành điển hình được hỗ trợ',
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
