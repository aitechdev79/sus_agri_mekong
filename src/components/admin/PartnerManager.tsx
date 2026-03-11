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

function statusLabel(status: PartnerStatus) {
  const labels: Record<PartnerStatus, string> = {
    DRAFT: 'Nháp',
    PENDING: 'Chờ duyệt',
    APPROVED: 'Đã duyệt',
    REJECTED: 'Từ chối',
    SUSPENDED: 'Tạm dừng',
  }
  return labels[status]
}

function statusClass(status: PartnerStatus) {
  const styles: Record<PartnerStatus, string> = {
    DRAFT: 'bg-slate-100 text-slate-700',
    PENDING: 'bg-amber-100 text-amber-700',
    APPROVED: 'bg-emerald-100 text-emerald-700',
    REJECTED: 'bg-rose-100 text-rose-700',
    SUSPENDED: 'bg-gray-200 text-gray-700',
  }
  return styles[status]
}

export function PartnerManager() {
  const [partners, setPartners] = useState<PartnerItem[]>([])
  const [loading, setLoading] = useState(true)
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
        throw new Error(data.error || 'Không thể tải danh sách đối tác')
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
      setError(fetchError instanceof Error ? fetchError.message : 'Đã có lỗi xảy ra')
      setPartners([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPartners()
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
        throw new Error(data.error || 'Không thể cập nhật đối tác')
      }

      setPartners((prev) => prev.map((item) => (item.id === id ? { ...item, ...data.partner } : item)))
      if (data.partner?.displayOrder !== undefined) {
        setOrderDrafts((prev) => ({
          ...prev,
          [id]: String(data.partner.displayOrder),
        }))
      }
    } catch (updateError) {
      alert(updateError instanceof Error ? updateError.message : 'Đã có lỗi xảy ra')
    } finally {
      setSavingId('')
    }
  }

  const handleLogoFileChange = async (id: string, file: File | null) => {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh.')
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
        throw new Error(uploadData?.error || 'Không thể tải ảnh lên')
      }

      const logoUrl = String(uploadData.file.url)
      await updatePartner(id, { logoUrl })
    } catch (uploadError) {
      alert(uploadError instanceof Error ? uploadError.message : 'Đã có lỗi xảy ra khi tải ảnh')
    } finally {
      setUploadingId('')
    }
  }

  const deletePartner = async (id: string, companyName: string) => {
    const confirmed = confirm(`Bạn có chắc chắn muốn xóa đối tác "${companyName}"?`)
    if (!confirmed) return

    try {
      setDeletingId(id)
      const response = await fetch(`/api/admin/partners/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Không thể xóa đối tác')
      }

      setPartners((prev) => prev.filter((item) => item.id !== id))
      setOrderDrafts((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
    } catch (deleteError) {
      alert(deleteError instanceof Error ? deleteError.message : 'Đã có lỗi xảy ra khi xóa đối tác')
    } finally {
      setDeletingId('')
    }
  }

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Quản lý đối tác doanh nghiệp</h2>
          <p className="text-sm text-slate-600">
            Quy ước hiển thị trang chủ: `displayOrder` &gt;= 0 là hiển thị, &lt; 0 là ẩn.
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Tìm theo tên công ty, slug, email..."
          className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {error && <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px]">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Logo</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Doanh nghiệp</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Liên hệ</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Trạng thái</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Hiển thị</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Thứ tự</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-slate-700">Thao tác</th>
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
                      {uploadingId === item.id ? 'Đang tải...' : 'Upload logo'}
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
                  <div>{item.contactEmail || 'Chưa có email'}</div>
                  <div className="text-slate-500">{item.province || 'Chưa có tỉnh/thành'}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(item.status)}`}>
                    {statusLabel(item.status)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${item.isPublic ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                    {item.isPublic ? 'Public' : 'Private'}
                  </span>
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
                        title="displayOrder: >=0 hiện trang chủ, <0 ẩn"
                      />
                      <button
                        type="button"
                        disabled={savingId === item.id}
                        onClick={() => {
                          const parsed = Number(orderDrafts[item.id] ?? item.displayOrder)
                          if (!Number.isFinite(parsed)) {
                            alert('Thứ tự không hợp lệ')
                            return
                          }
                          void updatePartner(item.id, { displayOrder: Math.trunc(parsed) })
                        }}
                        className="rounded border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                      >
                        Lưu thứ tự
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedPartner(item)}
                      className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Chi tiết
                    </button>
                    <button
                      type="button"
                      disabled={deletingId === item.id}
                      onClick={() => void deletePartner(item.id, item.companyName)}
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                    >
                      <Trash2 className="mr-1 h-3.5 w-3.5" />
                      {deletingId === item.id ? 'Đang xóa...' : 'Xóa'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {loading && <p className="py-6 text-center text-sm text-slate-500">Đang tải danh sách đối tác...</p>}
      {!loading && filteredPartners.length === 0 && (
        <p className="py-6 text-center text-sm text-slate-500">Chưa có hồ sơ đối tác nào.</p>
      )}

      {selectedPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Chi tiết đối tác</h3>
              <button
                type="button"
                onClick={() => setSelectedPartner(null)}
                className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Đóng"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-3 px-6 py-5 text-sm text-slate-700 md:grid-cols-2">
              <div className="md:col-span-2">
                <span className="font-medium text-slate-900">Tên doanh nghiệp: </span>
                {selectedPartner.companyName}
              </div>
              <div>
                <span className="font-medium text-slate-900">Slug: </span>
                {selectedPartner.slug}
              </div>
              <div>
                <span className="font-medium text-slate-900">Owner user ID: </span>
                {selectedPartner.ownerUserId || '—'}
              </div>
              <div>
                <span className="font-medium text-slate-900">Email: </span>
                {selectedPartner.contactEmail || '—'}
              </div>
              <div>
                <span className="font-medium text-slate-900">Điện thoại: </span>
                {selectedPartner.phone || '—'}
              </div>
              <div>
                <span className="font-medium text-slate-900">Website: </span>
                {selectedPartner.website || '—'}
              </div>
              <div>
                <span className="font-medium text-slate-900">Tỉnh/Thành: </span>
                {selectedPartner.province || '—'}
              </div>
              <div>
                <span className="font-medium text-slate-900">Trạng thái: </span>
                {statusLabel(selectedPartner.status)}
              </div>
              <div>
                <span className="font-medium text-slate-900">Hiển thị: </span>
                {selectedPartner.displayOrder >= 0 ? 'Hiển thị' : 'Ẩn'}
              </div>
              <div>
                <span className="font-medium text-slate-900">Thứ tự: </span>
                {selectedPartner.displayOrder}
              </div>
              <div>
                <span className="font-medium text-slate-900">Đã xác minh: </span>
                {selectedPartner.isVerified ? 'Có' : 'Không'}
              </div>
              <div>
                <span className="font-medium text-slate-900">Ngày tạo: </span>
                {new Date(selectedPartner.createdAt).toLocaleString('vi-VN')}
              </div>
              <div>
                <span className="font-medium text-slate-900">Cập nhật: </span>
                {new Date(selectedPartner.updatedAt).toLocaleString('vi-VN')}
              </div>
              <div className="md:col-span-2">
                <span className="font-medium text-slate-900">Mô tả: </span>
                {selectedPartner.description || '—'}
              </div>
            </div>

            <div className="flex justify-end border-t px-6 py-4">
              <button
                type="button"
                onClick={() => setSelectedPartner(null)}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
