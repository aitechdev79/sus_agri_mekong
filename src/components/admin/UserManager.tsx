'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, ShieldCheck, UserCheck, Users } from 'lucide-react'

interface AdminUser {
  id: string
  name: string | null
  email: string
  phone: string | null
  role: 'USER' | 'MODERATOR' | 'ADMIN'
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
    MODERATOR: 'Moderator',
    USER: 'User'
  }

  return labels[role]
}

function getRoleBadge(role: AdminUser['role']) {
  const styles = {
    ADMIN: 'bg-red-100 text-red-700',
    MODERATOR: 'bg-amber-100 text-amber-700',
    USER: 'bg-slate-100 text-slate-700'
  }

  return styles[role]
}

export function UserManager({ backHref }: UserManagerProps) {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/users')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Không thể tải danh sách người dùng')
        }

        setUsers(data.users || [])
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
    </div>
  )
}
