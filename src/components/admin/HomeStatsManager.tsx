'use client'

import { useEffect, useState } from 'react'
import { HOME_STATS_DEFAULTS, HOME_STATS_FIELDS, HomeStatsKey } from '@/lib/home-stats'

type HomeStatsForm = Record<HomeStatsKey, string>

function toForm(stats: Record<HomeStatsKey, number>): HomeStatsForm {
  return {
    publishedReports: String(stats.publishedReports),
    trackedPolicies: String(stats.trackedPolicies),
    members: String(stats.members),
    supportedInitiatives: String(stats.supportedInitiatives),
  }
}

export function HomeStatsManager() {
  const [form, setForm] = useState<HomeStatsForm>(() => toForm(HOME_STATS_DEFAULTS))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await fetch('/api/admin/home-stats')
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || 'Không thể tải số liệu trang chủ')
        }
        setForm(toForm(data.stats || HOME_STATS_DEFAULTS))
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Đã có lỗi xảy ra')
      } finally {
        setLoading(false)
      }
    }

    void loadStats()
  }, [])

  const saveStats = async () => {
    const stats = {} as Record<HomeStatsKey, number>

    for (const field of HOME_STATS_FIELDS) {
      const value = Number(form[field.key])
      if (!Number.isFinite(value) || value < 0) {
        setError('Các số liệu phải là số nguyên không âm')
        setMessage('')
        return
      }
      stats[field.key] = Math.trunc(value)
    }

    try {
      setSaving(true)
      setError('')
      setMessage('')

      const response = await fetch('/api/admin/home-stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stats }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Không thể lưu số liệu trang chủ')
      }

      setForm(toForm(data.stats || stats))
      setMessage('Đã lưu số liệu trang chủ.')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Đã có lỗi xảy ra khi lưu')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-vn-gold/30 bg-vn-gold-light shadow-sm">
      <div className="px-4 py-5 md:px-6">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-montserrat text-sm font-semibold uppercase tracking-wide text-vn-green">Trang chủ</p>
            <h2 className="mt-1 font-montserrat text-2xl font-bold text-vn-dark">Số liệu trang chủ</h2>
            <p className="mt-2 max-w-2xl font-montserrat text-sm text-slate-600">Chỉnh các con số trong khối giới thiệu ở trang chủ.</p>
          </div>
          <button
            type="button"
            disabled={loading || saving}
            onClick={() => void saveStats()}
            className="h-11 rounded-lg bg-vn-green px-5 text-sm font-semibold text-white transition hover:bg-vn-green/90 disabled:opacity-60"
          >
            {saving ? 'Đang lưu...' : 'Lưu số liệu'}
          </button>
        </div>

        {error && <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
        {message && <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {HOME_STATS_FIELDS.map((field) => (
            <label key={field.key} className="relative block overflow-hidden rounded-lg bg-white p-4 shadow-md">
              <span className="absolute left-0 top-0 h-1 w-full bg-vn-green" />
              <span className="mb-3 block font-montserrat text-xs font-semibold text-vn-dark">{field.labelVi}</span>
              <input
                type="number"
                min={0}
                step={1}
                value={form[field.key]}
                disabled={loading || saving}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    [field.key]: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-montserrat text-3xl font-bold text-vn-gold focus:outline-none focus:ring-2 focus:ring-vn-green disabled:bg-slate-100"
              />
            </label>
          ))}
        </div>
      </div>
    </section>
  )
}
