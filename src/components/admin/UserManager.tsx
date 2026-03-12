'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, PencilLine, Save, Search, ShieldCheck, Trash2, UserCheck, Users, X } from 'lucide-react'

interface AdminUser {
  id: string
  name: string | null
  email: string
  phone: string | null
  role: 'USER' | 'BUSINESS' | 'MODERATOR' | 'ADMIN'
  province: string | null
  organization: string | null
  isVerified: boolean
  createdAt: string
  _count: {
    contents: number
    submissions: number
    comments: number
    bookmarks: number
  }
}

interface UserManagerProps {
  backHref: string
}

interface EditFormState {
  id: string
  name: string
  phone: string
  role: AdminUser['role']
  province: string
  organization: string
  isVerified: boolean
  newPassword: string
}

interface PromoteFormState {
  ownerUserId: string
  companyName: string
  contactEmail: string
  province: string
  displayOrder: string
  logoUrl: string
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function getRoleLabel(role: AdminUser['role']) {
  const labels = {
    ADMIN: 'Admin',
    BUSINESS: 'Business',
    MODERATOR: 'Moderator',
    USER: 'User'
  }

  return labels[role]
}

function getRoleBadge(role: AdminUser['role']) {
  const styles = {
    ADMIN: 'bg-red-100 text-red-700',
    BUSINESS: 'bg-cyan-100 text-cyan-700',
    MODERATOR: 'bg-amber-100 text-amber-700',
    USER: 'bg-slate-100 text-slate-700'
  }

  return styles[role]
}

function escapeCsvValue(value: string) {
  if (value.includes('"') || value.includes(',') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }

  return value
}

function escapeXmlValue(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function downloadBlob(content: BlobPart, filename: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export function UserManager({ backHref }: UserManagerProps) {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [partnerOwnerIds, setPartnerOwnerIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [editForm, setEditForm] = useState<EditFormState | null>(null)
  const [savingEdit, setSavingEdit] = useState(false)
  const [deletingUserId, setDeletingUserId] = useState('')
  const [promoteForm, setPromoteForm] = useState<PromoteFormState | null>(null)
  const [promoting, setPromoting] = useState(false)
  const [uploadingPartnerLogo, setUploadingPartnerLogo] = useState(false)
  const [promoteError, setPromoteError] = useState('')
  const [editError, setEditError] = useState('')
  const [editSuccess, setEditSuccess] = useState('')

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true)
        const [usersResponse, partnersResponse] = await Promise.all([
          fetch('/api/admin/users'),
          fetch('/api/admin/partners'),
        ])
        const data = await usersResponse.json()

        if (!usersResponse.ok) {
          throw new Error(data.error || 'Không thể tải danh sách người dùng')
        }

        setUsers(data.users || [])
        if (partnersResponse.ok) {
          const partnersData = await partnersResponse.json()
          const ownerIds = (partnersData.partners || [])
            .map((item: { ownerUserId?: string | null }) => item.ownerUserId || '')
            .filter(Boolean)
          setPartnerOwnerIds(ownerIds)
        }
      } catch (error) {
        console.error('User manager fetch error:', error)
        setUsers([])
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return users

    return users.filter((user) => {
      const haystack = [
        user.name || '',
        user.email,
        user.phone || '',
        user.province || '',
        user.organization || '',
        user.role
      ]
        .join(' ')
        .toLowerCase()

      return haystack.includes(normalizedQuery)
    })
  }, [query, users])

  const summary = useMemo(() => {
    return {
      totalUsers: users.length,
      verifiedUsers: users.filter((user) => user.isVerified).length,
      adminUsers: users.filter((user) => user.role === 'ADMIN').length,
      moderatorUsers: users.filter((user) => user.role === 'MODERATOR').length
    }
  }, [users])

  const handleExportCsv = () => {
    const header = [
      'ID',
      'Tên',
      'Email',
      'Số điện thoại',
      'Vai trò',
      'Đã xác minh',
      'Tỉnh/Thành',
      'Tổ chức',
      'Số nội dung',
      'Số bài gửi',
      'Số bình luận',
      'Số bookmark',
      'Ngày tạo'
    ]

    const rows = filteredUsers.map((user) => [
      user.id,
      user.name || '',
      user.email,
      user.phone || '',
      getRoleLabel(user.role),
      user.isVerified ? 'Có' : 'Không',
      user.province || '',
      user.organization || '',
      String(user._count.contents),
      String(user._count.submissions),
      String(user._count.comments),
      String(user._count.bookmarks),
      formatDate(user.createdAt)
    ])

    const csvContent = [header, ...rows]
      .map((row) => row.map((cell) => escapeCsvValue(cell)).join(','))
      .join('\n')

    downloadBlob(
      `\uFEFF${csvContent}`,
      `users-${new Date().toISOString().slice(0, 10)}.csv`,
      'text/csv;charset=utf-8;'
    )
  }

  const handleExportExcel = () => {
    const header = [
      'ID',
      'Tên',
      'Email',
      'Số điện thoại',
      'Vai trò',
      'Đã xác minh',
      'Tỉnh/Thành',
      'Tổ chức',
      'Số nội dung',
      'Số bài gửi',
      'Số bình luận',
      'Số bookmark',
      'Ngày tạo'
    ]

    const rows = filteredUsers.map((user) => [
      user.id,
      user.name || '',
      user.email,
      user.phone || '',
      getRoleLabel(user.role),
      user.isVerified ? 'Có' : 'Không',
      user.province || '',
      user.organization || '',
      String(user._count.contents),
      String(user._count.submissions),
      String(user._count.comments),
      String(user._count.bookmarks),
      formatDate(user.createdAt)
    ])

    const tableHeader = header.map((cell) => `<th>${escapeXmlValue(cell)}</th>`).join('')
    const tableRows = rows
      .map((row) => `<tr>${row.map((cell) => `<td>${escapeXmlValue(cell)}</td>`).join('')}</tr>`)
      .join('')

    const excelContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
</head>
<body>
<table border="1">
<thead><tr>${tableHeader}</tr></thead>
<tbody>${tableRows}</tbody>
</table>
</body>
</html>`

    downloadBlob(
      excelContent,
      `users-${new Date().toISOString().slice(0, 10)}.xls`,
      'application/vnd.ms-excel;charset=utf-8;'
    )
  }

  const openEditUser = (user: AdminUser) => {
    setEditError('')
    setEditSuccess('')
    setEditForm({
      id: user.id,
      name: user.name || '',
      phone: user.phone || '',
      role: user.role,
      province: user.province || '',
      organization: user.organization || '',
      isVerified: user.isVerified,
      newPassword: ''
    })
  }

  const closeEditUser = () => {
    if (savingEdit) return
    setEditForm(null)
    setEditError('')
    setEditSuccess('')
  }

  const updateEditField = <K extends keyof EditFormState>(field: K, value: EditFormState[K]) => {
    setEditForm((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  const saveUserChanges = async () => {
    if (!editForm) return

    try {
      setSavingEdit(true)
      setEditError('')
      setEditSuccess('')

      const response = await fetch(`/api/admin/users/${editForm.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name,
          phone: editForm.phone,
          role: editForm.role,
          province: editForm.province,
          organization: editForm.organization,
          isVerified: editForm.isVerified,
          newPassword: editForm.newPassword
        })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Không thể cập nhật người dùng')
      }

      setUsers((prev) => prev.map((user) => (user.id === data.user.id ? data.user : user)))
      setEditForm((prev) => (prev ? { ...prev, newPassword: '' } : prev))
      setEditSuccess('Đã cập nhật thông tin người dùng.')
    } catch (error) {
      setEditError(error instanceof Error ? error.message : 'Đã có lỗi xảy ra.')
    } finally {
      setSavingEdit(false)
    }
  }

  const deleteUser = async (user: AdminUser) => {
    const confirmed = confirm(`Bạn có chắc chắn muốn xóa người dùng "${user.name || user.email}"?`)
    if (!confirmed) return

    try {
      setDeletingUserId(user.id)
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Không thể xóa người dùng')
      }

      setUsers((prev) => prev.filter((item) => item.id !== user.id))
      if (editForm?.id === user.id) {
        closeEditUser()
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Đã có lỗi xảy ra khi xóa người dùng')
    } finally {
      setDeletingUserId('')
    }
  }

  const openPromoteModal = (user: AdminUser) => {
    setPromoteError('')
    setPromoteForm({
      ownerUserId: user.id,
      companyName: (user.organization || user.name || user.email).trim(),
      contactEmail: user.email,
      province: user.province || '',
      displayOrder: '0',
      logoUrl: '',
    })
  }

  const closePromoteModal = () => {
    if (promoting || uploadingPartnerLogo) return
    setPromoteForm(null)
    setPromoteError('')
  }

  const updatePromoteField = <K extends keyof PromoteFormState>(field: K, value: PromoteFormState[K]) => {
    setPromoteForm((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  const uploadPromoteLogo = async (file: File | null) => {
    if (!file || !promoteForm) return
    if (!file.type.startsWith('image/')) {
      setPromoteError('Vui long chon file anh hop le.')
      return
    }

    try {
      setUploadingPartnerLogo(true)
      setPromoteError('')

      const formData = new FormData()
      formData.append('file', file)

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const uploadData = await uploadResponse.json()
      if (!uploadResponse.ok || !uploadData?.file?.url) {
        throw new Error(uploadData?.error || 'Khong the tai logo len')
      }

      updatePromoteField('logoUrl', String(uploadData.file.url))
    } catch (error) {
      setPromoteError(error instanceof Error ? error.message : 'Khong the tai logo len')
    } finally {
      setUploadingPartnerLogo(false)
    }
  }

  const submitPromoteToPartner = async () => {
    if (!promoteForm) return
    if (!promoteForm.companyName.trim()) {
      setPromoteError('Vui long nhap ten doanh nghiep.')
      return
    }

    const parsedOrder = Number(promoteForm.displayOrder)
    if (!Number.isFinite(parsedOrder)) {
      setPromoteError('Thu tu hien thi khong hop le.')
      return
    }

    try {
      setPromoting(true)
      setPromoteError('')

      const response = await fetch('/api/admin/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerUserId: promoteForm.ownerUserId,
          companyName: promoteForm.companyName.trim(),
          contactEmail: promoteForm.contactEmail.trim() || null,
          province: promoteForm.province.trim() || null,
          logoUrl: promoteForm.logoUrl.trim() || null,
          displayOrder: Math.trunc(parsedOrder),
          status: 'APPROVED',
          isPublic: true,
          isVerified: true,
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Khong the chuyen thanh doi tac')
      }

      setPartnerOwnerIds((prev) => (prev.includes(promoteForm.ownerUserId) ? prev : [...prev, promoteForm.ownerUserId]))
      setEditSuccess('Da chuyen user BUSINESS thanh doi tac.')
      closePromoteModal()
    } catch (error) {
      setPromoteError(error instanceof Error ? error.message : 'Khong the chuyen thanh doi tac')
    } finally {
      setPromoting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <Link href={backHref} className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại dashboard
        </Link>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h2>
          <p className="text-sm text-gray-600">Admin có thể xem danh sách tài khoản đã đăng ký, trạng thái xác minh và mức độ hoạt động cơ bản.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Download className="mr-2 h-4 w-4" />
            Tải CSV
          </button>
          <button
            type="button"
            onClick={handleExportExcel}
            className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Tải Excel
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-gray-500">
            <Users className="h-5 w-5" />
            <span className="text-sm">Tổng tài khoản</span>
          </div>
          <div className="mt-3 text-3xl font-bold text-gray-900">{summary.totalUsers}</div>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-gray-500">
            <UserCheck className="h-5 w-5" />
            <span className="text-sm">Đã xác minh</span>
          </div>
          <div className="mt-3 text-3xl font-bold text-gray-900">{summary.verifiedUsers}</div>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-gray-500">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-sm">Admin</span>
          </div>
          <div className="mt-3 text-3xl font-bold text-gray-900">{summary.adminUsers}</div>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-gray-500">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-sm">Moderator</span>
          </div>
          <div className="mt-3 text-3xl font-bold text-gray-900">{summary.moderatorUsers}</div>
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm theo tên, email, số điện thoại, tổ chức..."
              className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-700">Người dùng</th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-700">Liên hệ</th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-700">Vai trò</th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-700">Địa phương / Tổ chức</th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-700">Hoạt động</th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-700">Ngày tạo</th>
                <th className="px-5 py-3 text-right text-sm font-medium text-gray-700">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b align-top">
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-900">{user.name || 'Chưa cập nhật tên'}</div>
                    <div className="mt-1 text-xs text-gray-500">{user.id}</div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700">
                    <div>{user.email}</div>
                    <div className="mt-1 text-gray-500">{user.phone || 'Chưa có số điện thoại'}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-2">
                      <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium ${getRoleBadge(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                      <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium ${
                        user.isVerified ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {user.isVerified ? 'Đã xác minh' : 'Chưa xác minh'}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700">
                    <div>{user.province || 'Chưa có tỉnh/thành'}</div>
                    <div className="mt-1 text-gray-500">{user.organization || 'Chưa có tổ chức'}</div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700">
                    <div>Nội dung: {user._count.contents}</div>
                    <div className="mt-1">Gửi bài: {user._count.submissions}</div>
                    <div className="mt-1">Bình luận: {user._count.comments}</div>
                    <div className="mt-1">Lưu: {user._count.bookmarks}</div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700">{formatDate(user.createdAt)}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditUser(user)}
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <PencilLine className="mr-2 h-4 w-4" />
                        Sửa
                      </button>
                      {user.role === 'BUSINESS' && (
                        <button
                          type="button"
                          onClick={() => openPromoteModal(user)}
                          disabled={partnerOwnerIds.includes(user.id)}
                          className="inline-flex items-center rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <UserCheck className="mr-2 h-4 w-4" />
                          {partnerOwnerIds.includes(user.id) ? 'Da la doi tac' : 'Len doi tac'}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => void deleteUser(user)}
                        disabled={deletingUserId === user.id}
                        className="inline-flex items-center rounded-md border border-rose-300 bg-rose-50 px-3 py-1.5 text-sm font-medium text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {deletingUserId === user.id ? 'Đang xóa...' : 'Xóa'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && filteredUsers.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-gray-500">Không tìm thấy người dùng nào.</div>
          )}

          {loading && (
            <div className="px-5 py-10 text-center text-sm text-gray-500">Đang tải danh sách người dùng...</div>
          )}
        </div>
      </div>

      {editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Chỉnh sửa người dùng</h3>
              <button
                type="button"
                onClick={closeEditUser}
                className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Đóng"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 px-6 py-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="text"
                  disabled
                  value={users.find((item) => item.id === editForm.id)?.email || ''}
                  className="w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Họ tên</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(event) => updateEditField('name', event.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Số điện thoại</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(event) => updateEditField('phone', event.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Vai trò</label>
                <select
                  value={editForm.role}
                  onChange={(event) => updateEditField('role', event.target.value as AdminUser['role'])}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="USER">User</option>
                  <option value="BUSINESS">Business</option>
                  <option value="MODERATOR">Moderator</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="flex items-end">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={editForm.isVerified}
                    onChange={(event) => updateEditField('isVerified', event.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  Đã xác minh
                </label>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Tỉnh/Thành</label>
                <input
                  type="text"
                  value={editForm.province}
                  onChange={(event) => updateEditField('province', event.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Tổ chức</label>
                <input
                  type="text"
                  value={editForm.organization}
                  onChange={(event) => updateEditField('organization', event.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">Mật khẩu mới (tuỳ chọn)</label>
                <input
                  type="password"
                  value={editForm.newPassword}
                  onChange={(event) => updateEditField('newPassword', event.target.value)}
                  placeholder="Để trống nếu không đổi mật khẩu"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {(editError || editSuccess) && (
              <div className="px-6 pb-2">
                {editError && <p className="text-sm text-red-600">{editError}</p>}
                {editSuccess && <p className="text-sm text-green-600">{editSuccess}</p>}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 border-t px-6 py-4">
              <button
                type="button"
                onClick={closeEditUser}
                disabled={savingEdit}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Huỷ
              </button>
              <button
                type="button"
                onClick={saveUserChanges}
                disabled={savingEdit}
                className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="mr-2 h-4 w-4" />
                {savingEdit ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {promoteForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Chuyen user BUSINESS thanh doi tac</h3>
              <button
                type="button"
                onClick={closePromoteModal}
                className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Dong"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Ten doanh nghiep</label>
                <input
                  type="text"
                  value={promoteForm.companyName}
                  onChange={(event) => updatePromoteField('companyName', event.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Email lien he</label>
                  <input
                    type="email"
                    value={promoteForm.contactEmail}
                    onChange={(event) => updatePromoteField('contactEmail', event.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Tinh/Thanh</label>
                  <input
                    type="text"
                    value={promoteForm.province}
                    onChange={(event) => updatePromoteField('province', event.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Thu tu hien thi</label>
                  <input
                    type="number"
                    value={promoteForm.displayOrder}
                    onChange={(event) => updatePromoteField('displayOrder', event.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Logo doanh nghiep</label>
                  <div className="flex items-center gap-2">
                    <label className="inline-flex cursor-pointer items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                      {uploadingPartnerLogo ? 'Dang tai...' : 'Upload logo'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingPartnerLogo || promoting}
                        onChange={(event) => {
                          const file = event.target.files?.[0] || null
                          void uploadPromoteLogo(file)
                          event.currentTarget.value = ''
                        }}
                      />
                    </label>
                    {promoteForm.logoUrl && (
                      <span className="truncate text-xs text-gray-500">{promoteForm.logoUrl}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {promoteError && (
              <div className="px-6 pb-2">
                <p className="text-sm text-red-600">{promoteError}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 border-t px-6 py-4">
              <button
                type="button"
                onClick={closePromoteModal}
                disabled={promoting || uploadingPartnerLogo}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Huy
              </button>
              <button
                type="button"
                onClick={() => void submitPromoteToPartner()}
                disabled={promoting || uploadingPartnerLogo}
                className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <UserCheck className="mr-2 h-4 w-4" />
                {promoting ? 'Dang xu ly...' : 'Chuyen thanh doi tac'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
