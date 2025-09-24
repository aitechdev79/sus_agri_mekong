'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, File, Image, Video, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface UploadedFile {
  id?: string
  file: File
  url?: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
  progress?: number
}

interface FileUploadZoneProps {
  multiple?: boolean
  accept?: string
  maxSize?: number // in MB
  onUploadComplete?: (files: { id?: string; url: string; name?: string }[]) => void
  onUploadError?: (error: string) => void
  className?: string
  fileOnly?: boolean // If true, uploads files without creating content records
}

export function FileUploadZone({
  multiple = false,
  accept = "image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx",
  maxSize = 10,
  onUploadComplete,
  onUploadError,
  className = "",
  fileOnly = false
}: FileUploadZoneProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }, [handleFiles])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    handleFiles(selectedFiles)
  }, [handleFiles])

  const handleFiles = useCallback((selectedFiles: File[]) => {
    const validFiles: UploadedFile[] = []

    for (const file of selectedFiles) {
      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        onUploadError?.(`File "${file.name}" quá lớn. Kích thước tối đa: ${maxSize}MB`)
        continue
      }

      validFiles.push({
        file,
        status: 'pending'
      })
    }

    if (!multiple) {
      setFiles(validFiles.slice(0, 1))
    } else {
      setFiles(prev => [...prev, ...validFiles])
    }
  }, [maxSize, multiple, onUploadError])

  const uploadFiles = async () => {
    if (files.length === 0) return

    setIsUploading(true)
    const pendingFiles = files.filter(f => f.status === 'pending')

    try {
      if (multiple && pendingFiles.length > 1) {
        // Multiple file upload
        const formData = new FormData()
        pendingFiles.forEach(({ file }) => {
          formData.append('files', file)
        })

        // Update status to uploading
        setFiles(prev => prev.map(f =>
          f.status === 'pending' ? { ...f, status: 'uploading' as const } : f
        ))

        const uploadUrl = fileOnly ? '/api/upload/file-only' : '/api/upload/multiple'
        const response = await fetch(uploadUrl, {
          method: 'POST',
          body: formData
        })

        const result = await response.json()

        if (result.success) {
          if (fileOnly) {
            // File-only endpoint returns a single file object
            setFiles(prev => prev.map(f =>
              f.status === 'uploading' ? {
                ...f,
                url: result.file.url,
                status: 'success' as const
              } : f
            ))
            onUploadComplete?.([result.file])
          } else {
            // Regular endpoint returns an array of files
            setFiles(prev => prev.map((f, index) => {
              if (f.status === 'uploading') {
                const uploadedFile = result.files[index]
                return uploadedFile ? {
                  ...f,
                  id: uploadedFile.id,
                  url: uploadedFile.url,
                  status: 'success' as const
                } : { ...f, status: 'error' as const, error: 'Upload failed' }
              }
              return f
            }))
            onUploadComplete?.(result.files)
          }
        } else {
          throw new Error(result.error || 'Upload failed')
        }
      } else {
        // Single file upload
        for (const fileData of pendingFiles) {
          setFiles(prev => prev.map(f =>
            f === fileData ? { ...f, status: 'uploading' as const } : f
          ))

          const formData = new FormData()
          formData.append('file', fileData.file)

          try {
            const uploadUrl = fileOnly ? '/api/upload/file-only' : '/api/upload'
            const response = await fetch(uploadUrl, {
              method: 'POST',
              body: formData
            })

            const result = await response.json()

            if (result.success) {
              setFiles(prev => prev.map(f =>
                f === fileData ? {
                  ...f,
                  id: fileOnly ? undefined : result.file.id,
                  url: result.file.url,
                  status: 'success' as const
                } : f
              ))

              onUploadComplete?.([result.file])
            } else {
              throw new Error(result.error || 'Upload failed')
            }
          } catch (error) {
            setFiles(prev => prev.map(f =>
              f === fileData ? {
                ...f,
                status: 'error' as const,
                error: error instanceof Error ? error.message : 'Upload failed'
              } : f
            ))
          }
        }
      }
    } catch (error) {
      onUploadError?.(error instanceof Error ? error.message : 'Upload failed')
      setFiles(prev => prev.map(f =>
        f.status === 'uploading' ? { ...f, status: 'error' as const, error: 'Upload failed' } : f
      ))
    } finally {
      setIsUploading(false)
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const clearAll = () => {
    setFiles([])
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-5 h-5" />
    if (file.type.startsWith('video/')) return <Video className="w-5 h-5" />
    if (file.type === 'application/pdf') return <FileText className="w-5 h-5" />
    return <File className="w-5 h-5" />
  }

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">
          Kéo thả file vào đây hoặc
        </p>
        <Button
          type="button"
          variant="ghost"
          onClick={() => fileInputRef.current?.click()}
          className="text-green-600 hover:text-green-700"
        >
          Chọn file
        </Button>
        <p className="text-sm text-gray-500 mt-2">
          Hỗ trợ: Hình ảnh, Video, PDF, Word, Excel, PowerPoint
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Kích thước tối đa: {maxSize}MB {multiple && '• Có thể chọn nhiều file'}
        </p>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInput}
        className="hidden"
      />

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-700">
              File đã chọn ({files.length})
            </h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-red-600 hover:text-red-700"
            >
              Xóa tất cả
            </Button>
          </div>

          <div className="border rounded-lg divide-y">
            {files.map((fileData, index) => (
              <div key={index} className="p-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getFileIcon(fileData.file)}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {fileData.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(fileData.file.size)}
                    </p>
                    {fileData.error && (
                      <p className="text-xs text-red-500 mt-1">
                        {fileData.error}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(fileData.status)}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          {files.some(f => f.status === 'pending') && (
            <Button
              onClick={uploadFiles}
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang tải lên...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Tải lên {files.filter(f => f.status === 'pending').length} file
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}