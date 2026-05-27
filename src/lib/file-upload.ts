import { nanoid } from 'nanoid'
import sharp from 'sharp'
import mime from 'mime-types'
import path from 'path'
import { put } from '@vercel/blob'

export interface UploadConfig {
  maxSize: number
  allowedTypes: string[]
  uploadDir: string
  access: 'public' | 'private'
}

export interface UploadResult {
  success: boolean
  url?: string
  thumbnailUrl?: string
  fileName?: string
  originalName?: string
  size?: number
  type?: string
  error?: string
}

const defaultConfig: UploadConfig = {
  maxSize: 10 * 1024 * 1024,
  allowedTypes: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/bmp',
    'image/avif',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
  ],
  uploadDir: './uploads',
  access: 'public',
}

export async function validateFile(
  file: File,
  config: Partial<UploadConfig> = {}
): Promise<{ valid: boolean; error?: string }> {
  const finalConfig = { ...defaultConfig, ...config }

  if (file.size > finalConfig.maxSize) {
    return {
      valid: false,
      error: `File quá lớn. Kích thước tối đa: ${(finalConfig.maxSize / 1024 / 1024).toFixed(1)}MB`,
    }
  }

  if (!finalConfig.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Loại file không được hỗ trợ: ${file.type}`,
    }
  }

  return { valid: true }
}

export async function saveFile(
  file: File,
  config: Partial<UploadConfig> = {}
): Promise<UploadResult> {
  try {
    const finalConfig = { ...defaultConfig, ...config }
    const validation = await validateFile(file, finalConfig)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    const fileExtension = getFileExtension(file)
    const fileName = `${nanoid()}_${Date.now()}${fileExtension}`
    const pathname = buildUploadPath(finalConfig.uploadDir, fileName)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadBuffer = file.type.startsWith('image/')
      ? await optimizeImage(buffer)
      : buffer

    const uploaded = await put(pathname, uploadBuffer, {
      access: finalConfig.access,
      contentType: file.type,
      addRandomSuffix: false,
    })

    let thumbnailUrl: string | undefined

    if (file.type.startsWith('image/')) {
      const thumbnail = await processImage(buffer, fileName, finalConfig.uploadDir, finalConfig.access)
      thumbnailUrl = thumbnail?.url
    }

    return {
      success: true,
      url: uploaded.url,
      thumbnailUrl,
      fileName,
      originalName: file.name,
      size: file.size,
      type: file.type,
    }
  } catch (error) {
    console.error('File upload error:', error)
    return { success: false, error: 'Lỗi khi lưu file' }
  }
}

async function optimizeImage(buffer: Buffer): Promise<Buffer> {
  try {
    return await sharp(buffer)
      .resize(1920, 1080, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .toBuffer()
  } catch (error) {
    console.error('Image optimization error:', error)
    return buffer
  }
}

async function processImage(
  buffer: Buffer,
  fileName: string,
  uploadDir: string,
  access: 'public' | 'private'
): Promise<{ url: string } | null> {
  try {
    const thumbnailBuffer = await sharp(buffer)
      .resize(300, 200, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality: 80 })
      .toBuffer()

    const thumbnailFileName = `thumb_${fileName}`
    const thumbnailPath = buildUploadPath(uploadDir, thumbnailFileName)
    return await put(thumbnailPath, thumbnailBuffer, {
      access,
      contentType: 'image/jpeg',
      addRandomSuffix: false,
    })
  } catch (error) {
    console.error('Image processing error:', error)
    return null
  }
}

function getFileExtension(file: File): string {
  const originalExtension = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')) : ''
  if (originalExtension) return originalExtension.toLowerCase()

  switch (file.type) {
    case 'image/jpeg':
      return '.jpg'
    case 'image/png':
      return '.png'
    case 'image/webp':
      return '.webp'
    case 'application/pdf':
      return '.pdf'
    case 'video/mp4':
      return '.mp4'
    case 'video/mpeg':
      return '.mpeg'
    case 'video/quicktime':
      return '.mov'
    default:
      return ''
  }
}

function buildUploadPath(uploadDir: string, fileName: string): string {
  const normalizedDir = uploadDir.replace(/^\.?\/+/, '').replace(/\/+$/, '')
  return normalizedDir ? `${normalizedDir}/${fileName}` : fileName
}

export function getFileInfo(fileName: string): {
  isImage: boolean
  isVideo: boolean
  isDocument: boolean
  icon: string
} {
  const extension = path.extname(fileName).toLowerCase()
  const mimeType = mime.lookup(fileName) || ''

  const isImage = mimeType.startsWith('image/')
  const isVideo = mimeType.startsWith('video/')
  const isDocument = mimeType.startsWith('application/')

  let icon = 'file'
  if (isImage) icon = 'image'
  else if (isVideo) icon = 'video'
  else if (extension === '.pdf') icon = 'file-text'
  else if (['.doc', '.docx'].includes(extension)) icon = 'file-text'
  else if (['.xls', '.xlsx'].includes(extension)) icon = 'spreadsheet'
  else if (['.ppt', '.pptx'].includes(extension)) icon = 'presentation'

  return { isImage, isVideo, isDocument, icon }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
