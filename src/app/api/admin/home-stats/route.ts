import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-middleware'
import {
  HOME_STATS_DEFAULTS,
  HOME_STATS_SETTING_KEYS,
  HomeStatsKey,
  normalizeHomeStatValue,
} from '@/lib/home-stats'

async function getHomeStats() {
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

  return stats
}

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ stats: await getHomeStats() })
  } catch (error) {
    console.error('Admin home stats fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch home stats' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await requireAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const rawStats = body?.stats ?? body
    const nextStats: Partial<Record<HomeStatsKey, number>> = {}

    for (const statKey of Object.keys(HOME_STATS_SETTING_KEYS) as HomeStatsKey[]) {
      const normalized = normalizeHomeStatValue(rawStats?.[statKey])
      if (normalized === null) {
        return NextResponse.json(
          { error: `${statKey} must be a non-negative integer` },
          { status: 400 },
        )
      }
      nextStats[statKey] = normalized
    }

    await prisma.$transaction(
      (Object.keys(HOME_STATS_SETTING_KEYS) as HomeStatsKey[]).map((statKey) =>
        prisma.appSetting.upsert({
          where: { key: HOME_STATS_SETTING_KEYS[statKey] },
          update: { valueInt: nextStats[statKey] ?? HOME_STATS_DEFAULTS[statKey] },
          create: {
            key: HOME_STATS_SETTING_KEYS[statKey],
            valueInt: nextStats[statKey] ?? HOME_STATS_DEFAULTS[statKey],
          },
        }),
      ),
    )

    return NextResponse.json({ stats: await getHomeStats() })
  } catch (error) {
    console.error('Admin home stats update error:', error)
    return NextResponse.json({ error: 'Failed to update home stats' }, { status: 500 })
  }
}
