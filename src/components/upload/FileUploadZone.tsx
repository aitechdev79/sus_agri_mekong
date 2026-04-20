'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, File as FileIcon, Image, Video, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const MAX_FILE_ONLY_IMAGE_INPUT_SIZE = 10 * 1024 * 1024
const MAX_FILE_ONLY_IMAGE_DIMENSION = 1600
const FILE_ONLY_IMAGE_TARGET_SIZE = 900 * 1024
const IMAGE_OUTPUT_QUALITY = 0.85

interface UploadedFile {
  id?: string
  file: File
  url?: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
  progress?: number
}

interface UploadedFileData {
  id?: string
  url: string
  name?: string
  size?: number
  type?: string
  thumbnailUrl?: string
}

interface FileUploadZoneProps {
  multiple?: boolean
  accept?: string
  maxSize?: number // in MB
  maxInputSize?: number | null // in MB. null disables input-size validation before client compression.
  onUploadComplete?: (files: UploadedFileData[]) => void
  onUploadError?: (error: string) => void
  className?: string
  fileOnly?: boolean // If true, uploads files without creating content records
}

const supportsCanvasResize = (file: File) =>
  file.type.startsWith('image/') && file.type !== 'image/svg+xml'

const loadImageElement = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = document.createElement('img')
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Không thể đọc ảnh để resize.'))
    image.src = src
  })

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Không thể đọc file ảnh.'))
    reader.readAsDataURL(file)
  })

const canvasToBlob = (canvas: HTMLCanvasElement, type: string, quality?: number) =>
  new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, type, quality)
  })

async function resizeFileOnlyImage(file: File, targetMaxBytes: number) {
  if (!supportsCanvasResize(file)) return file

  const sourceUrl = await fileToDataUrl(file)
  const image = await loadImageElement(sourceUrl)
  const longestSide = Math.max(image.width, image.height)
  const shouldResize = longestSide > MAX_FILE_ONLY_IMAGE_DIMENSION
  const shouldCompress = file.size > targetMaxBytes

  if (!shouldResize && !shouldCompress) {
    return file
  }

  const scale = shouldResize ? MAX_FILE_ONLY_IMAGE_DIMENSION / longestSide : 1
  const targetWidth = Math.max(1, Math.round(image.width * scale))
  const targetHeight = Math.max(1, Math.round(image.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = targetWidth
  canvas.height = targetHeight

  const context = canvas.getContext('2d')
  if (!context) return file

  context.drawImage(image, 0, 0, targetWidth, targetHeight)

  const outputTypes = file.type === 'image/png' || file.type === 'image/webp'
    ? ['image/webp', 'image/jpeg']
    : ['image/jpeg']
  const qualitySteps = [IMAGE_OUTPUT_QUALITY, 0.78, 0.72, 0.66, 0.6, 0.54]

  let bestBlob: Blob | null = null
  let bestType = outputTypes[0]

  for (const outputType of outputTypes) {
    for (const quality of qualitySteps) {
      const blob = await canvasToBlob(canvas, outputType, quality)
      if (!blob) continue

      bestBlob = blob
      bestType = outputType

      if (blob.size <= targetMaxBytes) {
        const extension = outputType === 'image/webp' ? 'webp' : 'jpg'
        const baseName = file.name.replace(/\.[^.]+$/, '') || 'image'
        return new File([blob], `${baseName}.${extension}`, {
          type: outputType,
          lastModified: Date.now()
        })
      }
    }
  }

  if (!bestBlob) return file

  const extension = bestType === 'image/webp' ? 'webp' : 'jpg'
  const baseName = file.name.replace(/\.[^.]+$/, '') || 'image'
  return new File([bestBlob], `${baseName}.${extension}`, {
    type: bestType,
    lastModified: Date.now()
  })
}

export function FileUploadZone({
  multiple = false,
  accept = "image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx",
  maxSize = 10,
  maxInputSize = MAX_FILE_ONLY_IMAGE_INPUT_SIZE / 1024 / 1024,
  onUploadComplete,
  onUploadError,
  className = "",
  fileOnly = false
}: FileUploadZoneProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback((selectedFiles: File[]) => {
    const validFiles: UploadedFile[] = []

    for (const file of selectedFiles) {
      const canResizeBeforeUpload = fileOnly && supportsCanvasResize(file)

      // Validate file size
      if (canResizeBeforeUpload && maxInputSize !== null && file.size > maxInputSize * 1024 * 1024) {
        onUploadError?.(`File "${file.name}" quá lớn. Kích thước tối đa trước khi nén: ${MAX_FILE_ONLY_IMAGE_INPUT_SIZE / 1024 / 1024}MB`)
        continue
      }

      if (!canResizeBeforeUpload && file.size > maxSize * 1024 * 1024) {
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
    }, [fileOnly, maxInputSize, maxSize, multiple, onUploadError])

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

          try {
            const uploadFile = fileOnly && fileData.file.type.startsWith('image/')
              ? await resizeFileOnlyImage(fileData.file, Math.min(maxSize * 1024 * 1024, FILE_ONLY_IMAGE_TARGET_SIZE))
              : fileData.file
            const formData = new FormData()
            formData.append('file', uploadFile)

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

              onUploadComplete?.([{
                id: result.file.id,
                url: result.file.url,
                name: result.file.originalName || result.file.fileName,
                size: result.file.size,
                type: result.file.type,
                thumbnailUrl: result.file.thumbnailUrl
              }])
            } else {
              const errorMsg = result.error || 'Upload failed'
              if (result.suggestion) {
                throw new Error(`${errorMsg}\n\nGợi ý: ${result.suggestion}`)
              }
              throw new Error(errorMsg)
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
    // eslint-disable-next-line jsx-a11y/alt-text -- This is a Lucide icon, not an img element
    if (file.type.startsWith('image/')) return <Image className="w-5 h-5" />
    if (file.type.startsWith('video/')) return <Video className="w-5 h-5" />
    if (file.type === 'application/pdf') return <FileText className="w-5 h-5" />
    return <FileIcon className="w-5 h-5" />
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
        {fileOnly && (
          <p className="text-xs text-amber-600 mt-2 bg-amber-50 px-2 py-1 rounded">
            Ảnh lớn sẽ được tự resize/nén trước khi tải lên.
          </p>
        )}
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
