'use client'

import { useEffect, useState } from 'react'
import { Search, Trash2, X } from 'lucide-react'

type PartnerStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'

interface PartnerItem {
  id: string
  ownerUserId: string | null
  companyName: string
  slug: string
  logoUrl: string | null
  contactEmail: string | null
  website: string | null
  phone: string | null
  province: string | null
  description?: string | null
  status: PartnerStatus
  isPublic: boolean
  isVerified: boolean
  reviewedAt?: string | null
  createdAt: string
  displayOrder: number
  updatedAt: string
}

export function PartnerManager() {
  const [partners, setPartners] = useState<PartnerItem[]>([])
  const [loading, setLoading] = useState(true)
  const [homeDisplayLimit, setHomeDisplayLimit] = useState('4')
  const [savingHomeDisplayLimit, setSavingHomeDisplayLimit] = useState(false)
  const [query, setQuery] = useState('')
  const [savingId, setSavingId] = useState('')
  const [uploadingId, setUploadingId] = useState('')
  const [deletingId, setDeletingId] = useState('')
  const [orderDrafts, setOrderDrafts] = useState<Record<string, string>>({})
  const [selectedPartner, setSelectedPartner] = useState<PartnerItem | null>(null)
  const [error, setError] = useState('')

  const loadPartners = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetch('/api/admin/partners')
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'KhÃ´ng thá»ƒ táº£i danh sÃ¡ch Ä‘á»‘i tÃ¡c')
      }
      const list: PartnerItem[] = data.partners || []
      setPartners(list)
      setOrderDrafts(
        list.reduce<Record<string, string>>((acc, item) => {
          acc[item.id] = String(item.displayOrder)
          return acc
        }, {}),
      )
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'ÄÃ£ cÃ³ lá»—i xáº£y ra')
      setPartners([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPartners()
  }, [])

  useEffect(() => {
    const loadHomeSettings = async () => {
      try {
        const response = await fetch('/api/admin/partners/home-settings')
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || 'KhÃ´ng thá»ƒ táº£i cáº¥u hÃ¬nh hiá»ƒn thá»‹ trang chá»§')
        }
        setHomeDisplayLimit(String(data.homeDisplayLimit || 4))
      } catch (settingsError) {
        console.error('Partner home settings fetch error:', settingsError)
        setHomeDisplayLimit('4')
      }
    }

    void loadHomeSettings()
  }, [])

  const filteredPartners = partners.filter((item) => {
    const haystack = `${item.companyName} ${item.slug} ${item.contactEmail || ''} ${item.province || ''}`.toLowerCase()
    return haystack.includes(query.trim().toLowerCase())
  })

  const updatePartner = async (id: string, payload: Record<string, unknown>) => {
    try {
      setSavingId(id)
      const response = await fetch(`/api/admin/partners/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'KhÃ´ng thá»ƒ cáº­p nháº­t Ä‘á»‘i tÃ¡c')
      }

      setPartners((prev) => prev.map((item) => (item.id === id ? { ...item, ...data.partner } : item)))
      if (data.partner?.displayOrder !== undefined) {
        setOrderDrafts((prev) => ({
          ...prev,
          [id]: String(data.partner.displayOrder),
        }))
      }
    } catch (updateError) {
      alert(updateError instanceof Error ? updateError.message : 'ÄÃ£ cÃ³ lá»—i xáº£y ra')
    } finally {
      setSavingId('')
    }
  }

  const handleLogoFileChange = async (id: string, file: File | null) => {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Vui lÃ²ng chá»n file áº£nh.')
      return
    }

    try {
      setUploadingId(id)

      const formData = new FormData()
      formData.append('file', file)

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const uploadData = await uploadResponse.json()
      if (!uploadResponse.ok || !uploadData?.file?.url) {
        throw new Error(uploadData?.error || 'KhÃ´ng thá»ƒ táº£i áº£nh lÃªn')
      }

      const logoUrl = String(uploadData.file.url)
      await updatePartner(id, { logoUrl })
    } catch (uploadError) {
      alert(uploadError instanceof Error ? uploadError.message : 'ÄÃ£ cÃ³ lá»—i xáº£y ra khi táº£i áº£nh')
    } finally {
      setUploadingId('')
    }
  }

  const deletePartner = async (id: string, companyName: string) => {
    const confirmed = confirm(`Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n xÃ³a Ä‘á»‘i tÃ¡c "${companyName}"?`)
    if (!confirmed) return

    try {
      setDeletingId(id)
      const response = await fetch(`/api/admin/partners/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'KhÃ´ng thá»ƒ xÃ³a Ä‘á»‘i tÃ¡c')
      }

      setPartners((prev) => prev.filter((item) => item.id !== id))
      setOrderDrafts((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
    } catch (deleteError) {
      alert(deleteError instanceof Error ? deleteError.message : 'ÄÃ£ cÃ³ lá»—i xáº£y ra khi xÃ³a Ä‘á»‘i tÃ¡c')
    } finally {
      setDeletingId('')
    }
  }

  const saveHomeDisplayLimit = async () => {
    const parsed = Number(homeDisplayLimit)
    if (!Number.isFinite(parsed) || parsed < 1) {
      alert('Sá»‘ lÆ°á»£ng hiá»ƒn thá»‹ pháº£i lÃ  sá»‘ nguyÃªn dÆ°Æ¡ng')
      return
    }

    try {
      setSavingHomeDisplayLimit(true)
      const response = await fetch('/api/admin/partners/home-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ homeDisplayLimit: Math.trunc(parsed) }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'KhÃ´ng thá»ƒ lÆ°u cáº¥u hÃ¬nh hiá»ƒn thá»‹')
      }

      setHomeDisplayLimit(String(data.homeDisplayLimit))
    } catch (saveError) {
      alert(saveError instanceof Error ? saveError.message : 'ÄÃ£ cÃ³ lá»—i xáº£y ra khi lÆ°u cáº¥u hÃ¬nh')
    } finally {
      setSavingHomeDisplayLimit(false)
    }
  }

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Quáº£n lÃ½ Ä‘á»‘i tÃ¡c doanh nghiá»‡p</h2>
          <p className="text-sm text-slate-600">
            Quy Æ°á»›c hiá»ƒn thá»‹ trang chá»§: `displayOrder` &gt;= 0 lÃ  hiá»ƒn thá»‹, &lt; 0 lÃ  áº©n.
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="TÃ¬m theo tÃªn cÃ´ng ty, slug, email..."
          className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Sá»‘ lÆ°á»£ng logo Ä‘á»‘i tÃ¡c hiá»ƒn thá»‹ trÃªn trang chá»§</p>
            <p className="text-xs text-slate-600">Máº·c Ä‘á»‹nh: 4. Trang chá»§ sáº½ láº¥y theo sá»‘ lÆ°á»£ng nÃ y vÃ  thá»© tá»± Æ°u tiÃªn (`displayOrder`).</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              value={homeDisplayLimit}
              onChange={(event) => setHomeDisplayLimit(event.target.value)}
              className="w-24 rounded border border-slate-300 px-2 py-1.5 text-sm"
            />
            <button
              type="button"
              disabled={savingHomeDisplayLimit}
              onClick={() => void saveHomeDisplayLimit()}
              className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              {savingHomeDisplayLimit ? 'Äang lÆ°u...' : 'LÆ°u'}
            </button>
          </div>
        </div>
      </div>

      {error && <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px]">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Logo</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Doanh nghiá»‡p</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">LiÃªn há»‡</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Thá»© tá»±</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-slate-700">Thao tÃ¡c</th>
            </tr>
          </thead>
          <tbody>
            {filteredPartners.map((item) => (
              <tr key={item.id} className="border-b align-top">
                <td className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded border border-slate-200 bg-slate-50">
                      {item.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.logoUrl} alt={item.companyName} className="h-full w-full object-contain" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">No logo</div>
                      )}
                    </div>
                    <label className="inline-flex cursor-pointer items-center rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50">
                      {uploadingId === item.id ? 'Äang táº£i...' : 'Upload logo'}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingId === item.id || savingId === item.id}
                        className="hidden"
                        onChange={(event) => {
                          const selectedFile = event.target.files?.[0] || null
                          void handleLogoFileChange(item.id, selectedFile)
                          event.currentTarget.value = ''
                        }}
                      />
                    </label>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPartner(item)}
                    className="font-medium text-slate-900 hover:text-emerald-700 hover:underline"
                  >
                    {item.companyName}
                  </button>
                  <div className="text-xs text-slate-500">{item.slug}</div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">
                  <div>{item.contactEmail || 'ChÆ°a cÃ³ email'}</div>
                  <div className="text-slate-500">{item.province || 'ChÆ°a cÃ³ tá»‰nh/thÃ nh'}</div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">{item.displayOrder}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-2 py-1">
                      <input
                        type="number"
                        value={orderDrafts[item.id] ?? String(item.displayOrder)}
                        onChange={(event) =>
                          setOrderDrafts((prev) => ({
                            ...prev,
                            [item.id]: event.target.value,
                          }))
                        }
                        className="w-20 rounded border border-slate-300 px-2 py-1 text-xs"
                        title="displayOrder: >=0 hiá»‡n trang chá»§, <0 áº©n"
                      />
                      <button
                        type="button"
                        disabled={savingId === item.id}
                        onClick={() => {
                          const parsed = Number(orderDrafts[item.id] ?? item.displayOrder)
                          if (!Number.isFinite(parsed)) {
                            alert('Thá»© tá»± khÃ´ng há»£p lá»‡')
                            return
                          }
                          void updatePartner(item.id, { displayOrder: Math.trunc(parsed) })
                        }}
                        className="rounded border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                      >
                        LÆ°u thá»© tá»±
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedPartner(item)}
                      className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Chi tiáº¿t
                    </button>
                    <button
                      type="button"
                      disabled={deletingId === item.id}
                      onClick={() => void deletePartner(item.id, item.companyName)}
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                    >
                      <Trash2 className="mr-1 h-3.5 w-3.5" />
                      {deletingId === item.id ? 'Äang xÃ³a...' : 'XÃ³a'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {loading && <p className="py-6 text-center text-sm text-slate-500">Äang táº£i danh sÃ¡ch Ä‘á»‘i tÃ¡c...</p>}
      {!loading && filteredPartners.length === 0 && (
        <p className="py-6 text-center text-sm text-slate-500">ChÆ°a cÃ³ há»“ sÆ¡ Ä‘á»‘i tÃ¡c nÃ o.</p>
      )}

      {selectedPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Chi tiáº¿t Ä‘á»‘i tÃ¡c</h3>
              <button
                type="button"
                onClick={() => setSelectedPartner(null)}
                className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                aria-label="ÄÃ³ng"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-3 px-6 py-5 text-sm text-slate-700 md:grid-cols-2">
              <div className="md:col-span-2">
                <span className="font-medium text-slate-900">TÃªn doanh nghiá»‡p: </span>
                {selectedPartner.companyName}
              </div>
              <div>
                <span className="font-medium text-slate-900">Slug: </span>
                {selectedPartner.slug}
              </div>
              <div>
                <span className="font-medium text-slate-900">Owner user ID: </span>
                {selectedPartner.ownerUserId || 'â€”'}
              </div>
              <div>
                <span className="font-medium text-slate-900">Email: </span>
                {selectedPartner.contactEmail || 'â€”'}
              </div>
              <div>
                <span className="font-medium text-slate-900">Äiá»‡n thoáº¡i: </span>
                {selectedPartner.phone || 'â€”'}
              </div>
              <div>
                <span className="font-medium text-slate-900">Website: </span>
                {selectedPartner.website || 'â€”'}
              </div>
              <div>
                <span className="font-medium text-slate-900">Tá»‰nh/ThÃ nh: </span>
                {selectedPartner.province || 'â€”'}
              </div>
              <div>
                <span className="font-medium text-slate-900">Thá»© tá»±: </span>
                {selectedPartner.displayOrder}
              </div>
              <div>
                <span className="font-medium text-slate-900">Quy á»°á»›c hiá»ƒn thá»‹: </span>
                {selectedPartner.displayOrder >= 0 ? 'Hien logo tren nen tang' : 'An logo tren nen tang'}
              </div>
              <div>
                <span className="font-medium text-slate-900">ÄÃ£ xÃ¡c minh: </span>
                {selectedPartner.isVerified ? 'CÃ³' : 'KhÃ´ng'}
              </div>
              <div>
                <span className="font-medium text-slate-900">NgÃ y táº¡o: </span>
                {new Date(selectedPartner.createdAt).toLocaleString('vi-VN')}
              </div>
              <div>
                <span className="font-medium text-slate-900">Cáº­p nháº­t: </span>
                {new Date(selectedPartner.updatedAt).toLocaleString('vi-VN')}
              </div>
              <div className="md:col-span-2">
                <span className="font-medium text-slate-900">MÃ´ táº£: </span>
                {selectedPartner.description || 'â€”'}
              </div>
            </div>

            <div className="flex justify-end border-t px-6 py-4">
              <button
                type="button"
                onClick={() => setSelectedPartner(null)}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                ÄÃ³ng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

