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
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900">Số liệu trang chủ</h2>
        <p className="mt-1 text-sm text-slate-600">Chỉnh các con số trong khối giới thiệu ở trang chủ.</p>
      </div>

      {error && <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
      {message && <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {HOME_STATS_FIELDS.map((field) => (
          <label key={field.key} className="block">
            <span className="mb-1 block text-sm font-medium text-slate-900">{field.labelVi}</span>
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
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100"
            />
          </label>
        ))}
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          disabled={loading || saving}
          onClick={() => void saveStats()}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {saving ? 'Đang lưu...' : 'Lưu số liệu'}
        </button>
      </div>
    </section>
  )
}
