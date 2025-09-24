'use client'

import { useState, useEffect } from 'react'
import { Search, Download, Eye, Upload, Grid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FileUploadZone } from './FileUploadZone'
import Image from 'next/image'
import { normalizeImageUrl } from '@/lib/image-utils'

interface FileData {
  id: string
  title: string
  fileUrl: string
  fileType: string
  fileSize: number
  thumbnailUrl?: string
  createdAt: string
  downloadCount: number
}

interface FileManagerProps {
  onSelectFile?: (file: FileData) => void
  multiple?: boolean
  showUpload?: boolean
}

export function FileManager({ onSelectFile, multiple = false, showUpload = true }: FileManagerProps) {
  const [files, setFiles] = useState<FileData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showUploadZone, setShowUploadZone] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })

  useEffect(() => {
    loadFiles()
  }, [searchTerm, filterType, currentPage]) // loadFiles is stable due to useCallback pattern

  const loadFiles = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pagination.limit.toString()
      })

      if (searchTerm) params.append('search', searchTerm)
      if (filterType) params.append('type', filterType)

      const response = await fetch(`/api/files?${params}`)
      if (response.ok) {
        const data = await response.json()
        setFiles(data.files)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error loading files:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUploadComplete = () => {
    setShowUploadZone(false)
    loadFiles()
  }

  const handleFileSelect = (file: FileData) => {
    if (multiple) {
      setSelectedFiles(prev =>
        prev.includes(file.id)
          ? prev.filter(id => id !== file.id)
          : [...prev, file.id]
      )
    } else {
      onSelectFile?.(file)
    }
  }

  const handleDownload = async (file: FileData) => {
    try {
      const response = await fetch(file.fileUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.title
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download error:', error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileTypeLabel = (fileType: string) => {
    if (fileType.startsWith('image/')) return 'Hình ảnh'
    if (fileType.startsWith('video/')) return 'Video'
    if (fileType === 'application/pdf') return 'PDF'
    if (fileType.includes('word')) return 'Word'
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'Excel'
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return 'PowerPoint'
    return 'File'
  }

  const FileCard = ({ file }: { file: FileData }) => (
    <div
      className={`relative group cursor-pointer bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow ${
        selectedFiles.includes(file.id) ? 'ring-2 ring-green-500' : ''
      }`}
      onClick={() => handleFileSelect(file)}
    >
      {/* Thumbnail/Preview */}
      <div className="aspect-video bg-gray-100 flex items-center justify-center">
        {(() => {
          const imageUrl = normalizeImageUrl(file.thumbnailUrl) ||
                          (file.fileType.startsWith('image/') ? normalizeImageUrl(file.fileUrl) : null);

          return imageUrl ? (
            <Image
              src={imageUrl}
              alt={file.title}
              width={300}
              height={200}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-4xl text-gray-400">
              📄
            </div>
          );
        })()}
      </div>

      {/* File Info */}
      <div className="p-3">
        <h4 className="font-medium text-gray-900 truncate mb-1">
          {file.title}
        </h4>
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{getFileTypeLabel(file.fileType)}</span>
          <span>{formatFileSize(file.fileSize)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-white rounded-lg shadow-lg p-1 flex space-x-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              window.open(file.fileUrl, '_blank')
            }}
            title="Xem"
          >
            <Eye className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              handleDownload(file)
            }}
            title="Tải xuống"
          >
            <Download className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  )

  const FileRow = ({ file }: { file: FileData }) => (
    <tr
      className={`cursor-pointer hover:bg-gray-50 ${
        selectedFiles.includes(file.id) ? 'bg-green-50' : ''
      }`}
      onClick={() => handleFileSelect(file)}
    >
      <td className="px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
            {(() => {
              const imageUrl = normalizeImageUrl(file.thumbnailUrl) ||
                              (file.fileType.startsWith('image/') ? normalizeImageUrl(file.fileUrl) : null);

              return imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={file.title}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <span className="text-sm">📄</span>
              );
            })()}
          </div>
          <div>
            <div className="font-medium text-gray-900 truncate max-w-xs">
              {file.title}
            </div>
            <div className="text-sm text-gray-500">
              {getFileTypeLabel(file.fileType)}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">
        {formatFileSize(file.fileSize)}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">
        {(() => {
          const date = new Date(file.createdAt)
          const day = date.getDate().toString().padStart(2, '0')
          const month = (date.getMonth() + 1).toString().padStart(2, '0')
          const year = date.getFullYear()
          return `${day}/${month}/${year}`
        })()}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">
        {file.downloadCount}
      </td>
      <td className="px-4 py-3">
        <div className="flex space-x-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              window.open(file.fileUrl, '_blank')
            }}
            title="Xem"
          >
            <Eye className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              handleDownload(file)
            }}
            title="Tải xuống"
          >
            <Download className="w-3 h-3" />
          </Button>
        </div>
      </td>
    </tr>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Quản lý File</h3>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </Button>
          {showUpload && (
            <Button
              onClick={() => setShowUploadZone(!showUploadZone)}
              size="sm"
            >
              <Upload className="w-4 h-4 mr-2" />
              Tải lên
            </Button>
          )}
        </div>
      </div>

      {/* Upload Zone */}
      {showUploadZone && (
        <FileUploadZone
          multiple={true}
          onUploadComplete={handleUploadComplete}
          onUploadError={(error) => console.error(error)}
        />
      )}

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm file..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Tất cả loại file</option>
          <option value="image/">Hình ảnh</option>
          <option value="video/">Video</option>
          <option value="application/pdf">PDF</option>
          <option value="word">Word</option>
          <option value="excel">Excel</option>
          <option value="powerpoint">PowerPoint</option>
        </select>
      </div>

      {/* File List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : files.length > 0 ? (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {files.map(file => (
                <FileCard key={file.id} file={file} />
              ))}
            </div>
          ) : (
            <div className="bg-white border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">File</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Kích thước</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ngày tạo</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Lượt tải</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {files.map(file => (
                    <FileRow key={file.id} file={file} />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              <Button
                variant="ghost"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Trước
              </Button>
              <span className="text-sm text-gray-600">
                Trang {pagination.page} / {pagination.pages}
              </span>
              <Button
                variant="ghost"
                onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
                disabled={currentPage === pagination.pages}
              >
                Sau
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">Chưa có file nào</div>
          <div className="text-gray-400">Tải lên file đầu tiên để bắt đầu</div>
        </div>
      )}

      {/* Selected Files Summary */}
      {multiple && selectedFiles.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <span>Đã chọn {selectedFiles.length} file</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                const selected = files.filter(f => selectedFiles.includes(f.id))
                onSelectFile?.(selected[0])
              }}
              className="text-white hover:bg-green-700"
            >
              Xác nhận
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}