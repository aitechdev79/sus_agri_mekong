import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { HOME_STATS_DEFAULTS, HOME_STATS_SETTING_KEYS, HomeStatsKey } from '@/lib/home-stats'

export async function GET() {
  try {
    const entries = await prisma.appSetting.findMany({
      where: {
        key: {
          in: Object.values(HOME_STATS_SETTING_KEYS),
        },
      },
      select: {
        key: true,
        valueInt: true,
      },
    })

    const stats = { ...HOME_STATS_DEFAULTS }

    for (const [statKey, settingKey] of Object.entries(HOME_STATS_SETTING_KEYS) as Array<[HomeStatsKey, string]>) {
      const entry = entries.find((item) => item.key === settingKey)
      if (entry) {
        stats[statKey] = entry.valueInt
      }
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Home stats fetch error:', error)
    return NextResponse.json({ stats: HOME_STATS_DEFAULTS })
  }
}
