import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { nanoid } from 'nanoid'
import sharp from 'sharp'
import mime from 'mime-types'

export interface UploadConfig {
  maxSize: number // in bytes
  allowedTypes: string[]
  uploadDir: string
}

export interface UploadResult {
  success: boolean
  url?: string
  fileName?: string
  originalName?: string
  size?: number
  type?: string
  error?: string
}

const defaultConfig: UploadConfig = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'video/mp4',
    'video/mpeg',
    'video/quicktime'
  ],
  uploadDir: './uploads'
}

export async function validateFile(
  file: File,
  config: Partial<UploadConfig> = {}
): Promise<{ valid: boolean; error?: string }> {
  const finalConfig = { ...defaultConfig, ...config }

  // Check file size
  if (file.size > finalConfig.maxSize) {
    return {
      valid: false,
      error: `File quá lớn. Kích thước tối đa: ${(finalConfig.maxSize / 1024 / 1024).toFixed(1)}MB`
    }
  }

  // Check file type
  if (!finalConfig.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Loại file không được hỗ trợ: ${file.type}`
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

    // Validate file
    const validation = await validateFile(file, finalConfig)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', finalConfig.uploadDir)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Generate unique filename
    const fileExtension = path.extname(file.name)
    const fileName = `${nanoid()}_${Date.now()}${fileExtension}`
    const filePath = path.join(uploadDir, fileName)

    // Convert File to Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Process image files (create thumbnails)
    if (file.type.startsWith('image/')) {
      await processImage(buffer, filePath, fileName, uploadDir)
    } else {
      // Save file directly
      await writeFile(filePath, buffer)
    }

    const publicUrl = `${finalConfig.uploadDir}/${fileName}`.replace('./uploads', '/uploads')

    return {
      success: true,
      url: publicUrl,
      fileName,
      originalName: file.name,
      size: file.size,
      type: file.type
    }
  } catch (error) {
    console.error('File upload error:', error)
    return { success: false, error: 'Lỗi khi lưu file' }
  }
}

async function processImage(
  buffer: Buffer,
  filePath: string,
  fileName: string,
  uploadDir: string
): Promise<void> {
  try {
    // Save original image (optimize)
    await sharp(buffer)
      .jpeg({ quality: 85 })
      .png({ compressionLevel: 8 })
      .webp({ quality: 85 })
      .resize(1920, 1080, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toFile(filePath)

    // Create thumbnail
    const thumbnailFileName = `thumb_${fileName}`
    const thumbnailPath = path.join(uploadDir, thumbnailFileName)

    await sharp(buffer)
      .resize(300, 200, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 80 })
      .toFile(thumbnailPath)

  } catch (error) {
    console.error('Image processing error:', error)
    // Fallback: save original file
    await writeFile(filePath, buffer)
  }
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