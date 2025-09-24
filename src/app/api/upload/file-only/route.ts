import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-middleware'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'video/mp4', 'video/mpeg', 'video/quicktime'
]

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)

    if (!user) {
      return NextResponse.json(
        { error: 'Cần đăng nhập để tải file' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'Không có file được tải lên' },
        { status: 400 }
      )
    }

    // Basic validation
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File quá lớn. Kích thước tối đa: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Loại file không được hỗ trợ: ${file.type}` },
        { status: 400 }
      )
    }

    // For now, return a data URL for immediate use
    // This is a temporary solution until proper cloud storage is implemented
    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`

    // For images under 1MB, we can use data URLs temporarily
    if (file.type.startsWith('image/') && file.size < 1024 * 1024) {
      return NextResponse.json({
        success: true,
        file: {
          url: dataUrl,
          fileName: file.name,
          originalName: file.name,
          size: file.size,
          type: file.type,
          // Use same data URL as thumbnail for small images
          thumbnailUrl: dataUrl
        }
      })
    }

    // For larger files, return file info but suggest external hosting
    return NextResponse.json({
      success: false,
      error: 'File upload currently limited to images under 1MB on Vercel. Please use an external image hosting service and provide the URL instead.',
      suggestion: 'You can use services like Imgur, Cloudinary, or upload to your own server and provide the direct URL.'
    })

  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { error: 'Lỗi khi tải file' },
      { status: 500 }
    )
  }
}